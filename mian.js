// ================= EVENT LISTENER & INISIALISASI UTAMA =================
document.addEventListener('DOMContentLoaded', function() {
    // 1. Render katalog dan modal secara dinamis
    renderCatalogAndModals();

    // 2. Jalankan varian aktif jika ada
    const activeBtn = document.querySelector('.variant-btn.active');
    if (activeBtn) {
        selectVariant(activeBtn);
    }

    // 3. Muat harga tersimpan dari LocalStorage untuk mode admin/kustom
    for (let i = 1; i <= 30; i++) {
        let savedPrice = localStorage.getItem('product_price_modal' + i);
        if (savedPrice) {
            let display = document.getElementById('priceDisplay' + i);
            let input = document.getElementById('priceInput' + i);
            if (display) display.innerText = 'Rp ' + parseInt(savedPrice).toLocaleString('id-ID');
            if (input) input.value = savedPrice;
        }
    }

    // 4. Inisialisasi Intersection Observer untuk animasi scroll
    const observerOptions = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.about-section, .products-grid, .hero-content, .section-title, .hero-banner-image');
    elementsToAnimate.forEach(el => observer.observe(el));
});

// ================= FUNGSI GANTI GAMBAR THUMBNAIL =================
function changeThumbnailImage(element, modalIndex) {
    const mainImg = document.getElementById(`mainImg${modalIndex}`);
    if (!mainImg) {
        console.error(`Gambar utama dengan ID mainImg${modalIndex} tidak ditemukan!`);
        return;
    }

    mainImg.src = element.src;

    const thumbnailContainer = element.closest('.thumbnail-container');
    if (thumbnailContainer) {
        const thumbnails = thumbnailContainer.querySelectorAll('img');
        thumbnails.forEach(thumb => {
            thumb.style.borderColor = '#ccc';
            thumb.style.opacity = '0.6';
        });
        element.style.borderColor = '#007bff';
        element.style.opacity = '1';
    }
}

// ================= FUNGSI RENDER KATALOG & MODAL DINAMIS =================
function renderCatalogAndModals() {
    const productsGrid = document.getElementById('products-grid-container');
    if (!productsGrid) return;

    const safeImgList = (typeof imgList !== 'undefined') ? imgList : ['https://via.placeholder.com/300'];
    const safeTitles = (typeof productTitles !== 'undefined') ? productTitles : Array(30).fill('Al-Qur\'an Standar');
    const safePrices = (typeof basePrices !== 'undefined') ? basePrices : Array(30).fill(100000);
    const safeColors = (typeof colorsList !== 'undefined') ? colorsList : Array(30).fill(['Hitam', 'Biru', 'Hijau']);

    let catalogHTML = '';
    let modalsHTML = '';

    for (let i = 1; i <= 30; i++) {
        let img = safeImgList[(i - 1) % safeImgList.length];
        let secondaryImg = safeImgList[i % safeImgList.length]; 
        let title = safeTitles[i - 1] || `Produk ${i}`;
        let rawPrice = safePrices[i - 1] || 100000;
        let price = 'Rp ' + rawPrice.toLocaleString('id-ID');
        let colors = safeColors[i - 1] || ['Hitam'];

        // PERBAIKAN: Menambahkan atribut data-name agar filter/pencarian produk berfungsi
        catalogHTML += `
            <div class="product-card" data-name="${title.toLowerCase()}">
                <img src="${img}" alt="${title}">
                <h3>${title}</h3>
                <div class="product-footer">
                    <button class="btn-detail" onclick="openModal('modal${i}')">Detail</button>
                </div>
            </div>
        `;

        // Tombol Warna Modal
        let colorButtons = '';
        colors.forEach((col, idx) => {
            let activeClass = idx === 0 ? 'active' : '';
            let colorImg = safeImgList[(i + idx) % safeImgList.length]; 
            colorButtons += `<button type="button" class="color-btn ${activeClass}" onclick="selectColor(this, '${col}', '${colorImg}', ${i})">${col}</button>`;
        });

        // Struktur Modal Dinamis
        modalsHTML += `
            <div id="modal${i}" class="modal">
                <div class="modal-content">
                    <span class="close-btn" onclick="closeModal('modal${i}')">&times;</span>
                    <div class="modal-body">
                        <div class="product-gallery">
                            <div class="main-image-container">
                                <img id="mainImg${i}" src="${img}" alt="${title}">
                            </div>
                            <div class="thumbnail-container" style="display: flex; gap: 10px; margin-top: 10px; position: relative; z-index: 10;">
                                <img src="${img}" onclick="changeThumbnailImage(this, ${i})" alt="Thumb 1" style="width: 60px; height: 60px; object-fit: cover; cursor: pointer; border-radius: 5px; border: 2px solid #007bff; opacity: 1;">
                                <img src="${secondaryImg}" onclick="changeThumbnailImage(this, ${i})" alt="Thumb 2" style="width: 60px; height: 60px; object-fit: cover; cursor: pointer; border-radius: 5px; border: 2px solid #ccc; opacity: 0.6;">
                            </div>
                        </div>
                        <div class="modal-info">
                            <h2 class="product-title-modal">${title}</h2>
                            <div class="variant-section">
                                <label>Pilih Warna Cover:</label>
                                <div class="color-options">
                                    ${colorButtons}
                                </div>
                                <p class="color-preview-text">Warna Dipilih: <span class="selected-color-label">${colors[0]}</span></p>
                            </div>
                            <div class="spec-card">
                                <h4>DESKRIPSI</h4>
                                <p>Produk berkualitas tinggi dari penerbit Rizky Barokah, dirancang khusus untuk kenyamanan membaca, menghafal, dan mempelajari ilmu agama.</p>
                            </div>
                            <div class="modal-price-action">
                                <div class="price-container">
                                    <span class="modal-price" id="priceDisplay${i}">${price}</span>
                                    <input type="hidden" id="priceInput${i}" value="${rawPrice}">
                                </div>
                                <button type="button" class="btn-buy" onclick="checkoutWhatsAppWithCustomName('${title}', 'modal${i}')">Beli Sekarang via WhatsApp</button>
                            </div>
                        </div>
                    </div>
                    <button class="btn-close-bottom" onclick="closeModal('modal${i}')">Close</button>
                </div>
            </div>
        `;
    }

    productsGrid.innerHTML = catalogHTML;
    
    if (!document.querySelector('.modal')) {
        document.body.insertAdjacentHTML('beforeend', modalsHTML);
    }
}

// ================= FUNGSI INTERAKTIF MODAL (DENGAN ANIMASI) =================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Menutup modal jika klik di luar area konten modal
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal(event.target.id);
    }
}

// ================= FUNGSI PILIH WARNA & VARIASI =================
function selectColor(button, colorName, imageSrc, modalIndex) {
    const modalContent = button.closest('.modal-content');
    if (!modalContent) return;

    const buttons = modalContent.querySelectorAll('.color-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    const label = modalContent.querySelector('.selected-color-label');
    if (label) {
        label.textContent = colorName;
    }

    if (imageSrc) {
        const mainImg = modalContent.querySelector(`#mainImg${modalIndex}`);
        if (mainImg) {
            mainImg.src = imageSrc;
        }
    }
}

function selectVariant(element) {
    const parent = element.closest('.variant-options') || document;
    parent.querySelectorAll('.variant-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    const selectedPrice = parseInt(element.getAttribute('data-price')) || 0;
    const variantName = element.innerText;

    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(selectedPrice).replace('IDR', 'Rp');

    const displayPrice = document.getElementById('display-price');
    if (displayPrice) {
        displayPrice.innerText = formattedPrice;
    }

    const specSize = document.getElementById('spec-size');
    if (specSize) {
        specSize.innerText = variantName;
    }
}

// ================= FITUR ADMIN & PENCARIAN =================
const ADMIN_PASSWORD = "rizkybarokah123";

function toggleAdminMode() {
    let isLogged = document.body.classList.contains('admin-mode-active');
    let adminBtn = document.getElementById('adminBtn');
    
    if (!isLogged) {
        let pass = prompt("Masukkan Password Khusus Pemilik Toko:");
        if (pass === ADMIN_PASSWORD) {
            document.body.classList.add('admin-mode-active');
            if (adminBtn) adminBtn.innerText = "🔓 Keluar Admin";
            alert("Mode Pemilik Aktif!");
        } else if (pass !== null) {
            alert("Password salah!");
        }
    } else {
        document.body.classList.remove('admin-mode-active');
        if (adminBtn) adminBtn.innerText = "🔑 Admin";
        alert("Keluar dari Mode Pemilik.");
    }
}

function updateProductPrice(modalId, newPrice) {
    if (!newPrice || isNaN(newPrice)) return;
    localStorage.setItem('product_price_' + modalId, newPrice);
    
    let modalNum = modalId.replace('modal', '');
    let display = document.getElementById('priceDisplay' + modalNum);
    if (display) {
        display.innerText = 'Rp ' + parseInt(newPrice).toLocaleString('id-ID');
    }
    alert("Harga berhasil diperbarui!");
}

function filterProducts() {
    let searchInput = document.getElementById('searchProduct');
    if (!searchInput) return;
    
    let input = searchInput.value.toLowerCase();
    let cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        let name = card.getAttribute('data-name') || '';
        if (name.includes(input)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

function openCartModal() {
    alert("Keranjang belanja Anda saat ini masih kosong.");
}

// ================= FUNGSI CHECKOUT WHATSAPP =================
function checkoutWhatsAppWithCustomName(productName, modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const activeColorBtn = modal.querySelector('.color-btn.active');
    const selectedColor = activeColorBtn ? activeColorBtn.innerText : 'Default';
    
    const activeVariantBtn = modal.querySelector('.variant-btn.active');
    const selectedSize = activeVariantBtn ? activeVariantBtn.innerText : 'Default';
    
    const modalNum = modalId.replace('modal', '');
    const priceInput = document.getElementById('priceInput' + modalNum);
    const selectedPrice = priceInput ? priceInput.value : '0';
    
    const customNameInput = modal.querySelector('input[id^="customName"]');
    const customName = customNameInput ? customNameInput.value.trim() : '';
    
    const phoneNumber = "6285877435417"; 
    
    let message = `Halo Admin Rizky Barokah, saya ingin memesan produk:\n\n` +
                  `📦 *Produk:* ${productName}\n` +
                  `🎨 *Warna:* ${selectedColor}\n` +
                  `📏 *Ukuran:* ${selectedSize}\n` +
                  `✍️ *Custom Nama:* ${customName ? customName : '(Tidak ada)'}\n` +
                  `💰 *Harga:* Rp ${parseInt(selectedPrice).toLocaleString('id-ID')}\n\n` +
                  `Mohon informasi ketersediaan stok ya. Terima kasih!`;
                  
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

// ================= FUNGSI SCROLL BANNER =================
function scrollBanner(direction) {
    const mainImg = document.getElementById(`mainImg${modalIndex}`);
    if (wrapper) {
        const scrollAmount = wrapper.clientWidth; 
        wrapper.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }
}