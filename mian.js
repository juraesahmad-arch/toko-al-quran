// ================= EVENT LISTENER & INISIALISASI =================
document.addEventListener('DOMContentLoaded', function() {
    renderCatalogAndModals();
    const activeBtn = document.querySelector('.variant-btn.active');
    if (activeBtn) {
        selectVariant(activeBtn);
    }
});

// ================= FUNGSI GANTI GAMBAR THUMBNAIL =================
function changeThumbnailImage(element, modalIndex) {
    // Cari elemen gambar utama berdasarkan ID unik modal
    const mainImg = document.getElementById(`mainImg${modalIndex}`);
    if (!mainImg) {
        console.error(`Gambar utama dengan ID mainImg${modalIndex} tidak ditemukan!`);
        return;
    }

    // Ganti source gambar utama dengan source thumbnail yang diklik
    mainImg.src = element.src;

    // Perbarui efek border aktif pada thumbnail
    const thumbnailContainer = element.closest('.thumbnail-container');
    if (thumbnailContainer) {
        const thumbnails = thumbnailContainer.querySelectorAll('img');
        thumbnails.forEach(thumb => {
            thumb.style.borderColor = '#ccc';
        });
        element.style.borderColor = '#007bff';
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

        // 1. Kartu Produk Katalog
        catalogHTML += `
            <div class="product-card">
                <img src="${img}" alt="${title}">
                <h3>${title}</h3>
                <div class="product-footer">
                    <button class="btn-detail" onclick="openModal('modal${i}')">detail</button>
                </div>
            </div>
        `;

        // 2. Tombol Warna Modal
        let colorButtons = '';
        colors.forEach((col, idx) => {
            let activeClass = idx === 0 ? 'active' : '';
            let colorImg = safeImgList[(i + idx) % safeImgList.length]; 
            colorButtons += `<button type="button" class="color-btn ${activeClass}" onclick="selectColor(this, '${col}', '${colorImg}', ${i})">${col.split(' ')[0]}</button>`;
        });

        // 3. Struktur Modal Dinamis (Mengirim parameter indeks ${i} ke fungsi thumbnail)
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
                                <div class="price-container"><span class="modal-price">${price}</span></div>
                                <a href="https://wa.me/6285877435417?text=Halo%20Admin%20Rizky%20Barokah,%20saya%20ingin%20memesan%20produk:%20${encodeURIComponent(title)}" class="btn-buy" target="_blank">Beli Sekarang via WhatsApp</a>
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

// ================= FUNGSI INTERAKTIF MODAL & VARIASI =================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.style.display = "block";
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = "none";
    }
}

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

    // Mengganti foto utama otomatis ketika pilihan warna cover diklik berdasarkan indeks modal
    if (imageSrc) {
        const mainImg = modalContent.querySelector(`#mainImg${modalIndex}`);
        if (mainImg) {
            mainImg.src = imageSrc;
        }
    }
}

function selectColor(element, colorName) {
  // Hapus class 'active' dari semua tombol warna
  const buttons = document.querySelectorAll('.color-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  // Tambahkan class 'active' ke tombol yang sedang diklik
  element.classList.add('active');
  
  // Perbarui teks pada label warna yang dipilih secara dinamis
  const colorLabel = document.querySelector('.selected-color-label');
  if (colorLabel) {
    colorLabel.textContent = colorName;
  }
}

function selectVariant(element) {
    const buttons = document.querySelectorAll('.variant-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
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

    const phoneNumber = "6285877435417"; 
    const productName = "Al-Qur'an I'rab Nahwu Shorof";
    const message = `Halo Admin Rizky Barokah, saya ingin memesan produk berikut:\n\n📦 *Produk:* ${productName}\n📏 *Varian/Ukuran:* ${variantName}\n💰 *Harga:* ${formattedPrice}\n\nMohon informasi ketersediaan stok ya. Terima kasih!`;
    
    const waLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    const btnBuyWa = document.getElementById('btn-buy-wa') || document.querySelector('.btn-buy');
    if (btnBuyWa) {
        btnBuyWa.setAttribute('href', waLink);
    }
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        event.target.style.display = "none";
    }
}


    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex'; // Aktifkan display flex dulu
            // Gunakan requestAnimationFrame agar browser sempat merender display sebelum class active masuk
            requestAnimationFrame(() => {
                modal.classList.add('active');
            });
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active'); // Hilangkan animasi
            // Tunggu animasi selesai (300ms) baru display di-none-kan
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    // Menutup modal jika klik di luar area konten
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    }
