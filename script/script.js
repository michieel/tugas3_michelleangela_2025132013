// ============================================
// script.js - Michie's Shop (Materi Minggu 4)
// Sesuai soal latihan praktikum:
// - getElementById (min 5 elemen)
// - Hitung subtotal, diskon, PAJAK, total bayar
// - Tampilkan dengan innerHTML
// - Simpan ke tabel dengan createElement + appendChild
// ============================================

// ===== 1. AMBIL ELEMEN (getElementById) =====
const formPesanan      = document.getElementById("formPesanan");
const hasilTransaksi   = document.getElementById("hasilTransaksi");
const tabelRiwayat     = document.getElementById("tabelRiwayat");
const pilihProduk      = document.getElementById("pilihProduk");
const inputNamaProduk  = document.getElementById("namaProduk");
const inputHargaSatuan = document.getElementById("hargaSatuan");
const inputJumlah      = document.getElementById("jumlahProduk");
const inputAlamat      = document.getElementById("alamat");

let nomorTransaksi = 1;

// ===== 2. DATA PRODUK (object) =====
const dataProduk = {
    "hacipupu-star": { nama: "HACIPUPU Constellation", harga: 179000 },
    "snoopy":        { nama: "Peanuts Snoopy",         harga: 179000 },
    "hacipupu-home": { nama: "HACIPUPU Take Me Home",  harga: 279000 },
    "skullpanda":    { nama: "Skullpanda",             harga: 349000 }
};

// ===== 3. FUNGSI FORMAT RUPIAH =====
function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

// ===== 4. AUTO-FILL NAMA & HARGA SATUAN =====
function updateInfoProduk() {
    const kode = pilihProduk.value;

    if (kode === "") {
        inputNamaProduk.value  = "";
        inputHargaSatuan.value = "";
        return;
    }

    const produk = dataProduk[kode];
    if (produk) {
        inputNamaProduk.value  = produk.nama;
        inputHargaSatuan.value = formatRupiah(produk.harga);

        inputNamaProduk.style.transition = "background 0.3s";
        inputNamaProduk.style.background = "rgba(212, 245, 212, 0.6)";
        setTimeout(() => {
            inputNamaProduk.style.background = "rgba(255, 143, 199, 0.15)";
        }, 400);
    }
}

pilihProduk.addEventListener("change", updateInfoProduk);

// ===== 5. EVENT SUBMIT FORM =====
formPesanan.addEventListener("submit", function(event) {
    event.preventDefault();

    // --- A. Ambil nilai input ---
    const nama     = document.getElementById("namaPelanggan").value.trim();
    const kode     = pilihProduk.value;
    const jumlah   = Number(inputJumlah.value);
    const kategori = document.getElementById("kategoriPelanggan").value;
    const alamat   = inputAlamat.value.trim();

    // --- B. Validasi ---
    if (nama === "") {
        hasilTransaksi.style.display = "block";
        hasilTransaksi.textContent = "⚠️ Nama pelanggan wajib diisi!";
        return;
    }
    if (kode === "") {
        hasilTransaksi.style.display = "block";
        hasilTransaksi.textContent = "⚠️ Pilih produk dulu!";
        return;
    }
    if (jumlah <= 0) {
        hasilTransaksi.style.display = "block";
        hasilTransaksi.textContent = "⚠️ Jumlah minimal 1!";
        return;
    }
    if (alamat === "") {
        hasilTransaksi.style.display = "block";
        hasilTransaksi.textContent = "⚠️ Alamat pengiriman wajib diisi!";
        return;
    }

    // --- C. Ambil data produk ---
    const produk      = dataProduk[kode];
    const namaProduk  = produk.nama;
    const hargaSatuan = produk.harga;

    // --- D. HITUNG SUBTOTAL, DISKON, PAJAK, TOTAL ---
    const subtotal = hargaSatuan * jumlah;

    // Diskon berdasarkan kategori
    let diskon = 0;
    if (kategori === "member")   diskon = subtotal * 0.05;
    if (kategori === "reseller") diskon = subtotal * 0.10;

    const setelahDiskon = subtotal - diskon;

    // PAJAK (PPN 11%)
    const pajak = setelahDiskon * 0.11;

    const totalBayar = setelahDiskon + pajak;

    // --- E. TAMPILKAN HASIL (innerHTML) ---
    hasilTransaksi.style.display = "block";
    hasilTransaksi.innerHTML =
        "<h3>✅ Pesanan Berhasil Diproses!</h3>" +
        "<p><strong>Pelanggan:</strong> " + nama + "</p>" +
        "<p><strong>Produk:</strong> " + namaProduk + "</p>" +
        "<p><strong>Harga Satuan:</strong> " + formatRupiah(hargaSatuan) + "</p>" +
        "<p><strong>Jumlah:</strong> " + jumlah + " pcs</p>" +
        "<p><strong>Alamat Pengiriman:</strong> " + alamat + "</p>" +
        "<hr>" +
        "<p><strong>Subtotal:</strong> " + formatRupiah(subtotal) + "</p>" +
        "<p><strong>Diskon (" + kategori + "):</strong> -" + formatRupiah(Math.round(diskon)) + "</p>" +
        "<p><strong>Pajak (PPN 11%):</strong> " + formatRupiah(Math.round(pajak)) + "</p>" +
        '<p class="total-akhir"><strong>Total Bayar: ' + formatRupiah(Math.round(totalBayar)) + "</strong></p>";

    // --- F. SIMPAN KE TABEL RIWAYAT (createElement + appendChild) ---
    const barisBaru = document.createElement("tr");
    barisBaru.className = "new-row";
    barisBaru.innerHTML =
        "<td>" + nomorTransaksi + "</td>" +
        "<td>" + nama + "</td>" +
        "<td>" + namaProduk + "</td>" +
        "<td>" + formatRupiah(hargaSatuan) + "</td>" +
        "<td>" + jumlah + "</td>" +
        "<td>" + formatRupiah(subtotal) + "</td>" +
        "<td>" + formatRupiah(Math.round(diskon)) + "</td>" +
        "<td>" + formatRupiah(Math.round(pajak)) + "</td>" +
        "<td>" + formatRupiah(Math.round(totalBayar)) + "</td>";

    tabelRiwayat.appendChild(barisBaru);
    nomorTransaksi++;

    // --- G. Reset form ---
    formPesanan.reset();
    inputNamaProduk.value  = "";
    inputHargaSatuan.value = "";

    // --- H. Scroll ke riwayat ---
    document.getElementById("riwayat").scrollIntoView({ behavior: "smooth" });
});

// ============================================
// FADE-IN SAAT SCROLL
// ============================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll(".section-header, .produk-card, .form-card, .produk-tabel-wrapper").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s ease";
    observer.observe(el);
});