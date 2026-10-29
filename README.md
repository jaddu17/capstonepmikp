# Sistem Informasi & Pelayanan Publik PMI Kabupaten Kulon Progo
### Capstone Project - Teknologi Informasi

Aplikasi web terintegrasi untuk pelayanan publik, pemantauan stok darah, jadwal mobile unit donor darah, publikasi kegiatan kemanusiaan, serta laporan donasi masyarakat pada Palang Merah Indonesia (PMI) Kabupaten Kulon Progo.

Aplikasi ini dibangun dengan pemisahan tegas antara **Presentation Layer (Frontend: React + Vite)** dan **Business Logic/Data Access Layer (Backend: Laravel 11 REST API)**, serta mematuhi seluruh **Standar Operasional Prosedur (SOP) Capstone Project**.

---

## 🚀 Fitur Utama

1. **Dashboard & Manajemen Pelayanan Admin:**
   - **Kelola Berita & Publikasi:** CRUD berita kemanusiaan dan edukasi donor.
   - **Kelola Stok Darah:** Pembaruan jumlah kantong darah (WB, PRC, TC) untuk golongan darah A, B, O, dan AB.
   - **Kelola Jadwal Mobile Unit:** Publikasi lokasi, waktu, dan kuota donor darah.
   - **Laporan Donasi Masuk:** Verifikasi bukti transfer donasi masyarakat.
   - **Pesan Masuk & Respon:** Komunikasi dua arah dengan masyarakat melalui email & WhatsApp langsung.
   - **Infografis Bulanan:** Rekap visual capaian pelayanan dan dokumentasi kegiatan.
2. **Portal Informasi Publik:**
   - Cek stok darah terkini secara real-time.
   - Informasi persyaratan donor darah & edukasi kemanusiaan.
   - Form donasi online dengan upload bukti transfer.
   - Form kontak pengaduan/pertanyaan langsung ke PMI.
3. **Otomatisasi Multi-Channel (Integrasi API WhatsApp & Instagram):**
   - **WhatsApp Gateway (Fonnte API):** Broadcast otomatis ke Grup WhatsApp PMI Kulon Progo saat ada Berita Baru, Jadwal Donor Baru, dan Perubahan Stok Darah.
   - **Instagram Meta Graph API:** Publikasi otomatis ke Feed Instagram PMI Kulon Progo saat ada publikasi baru.
   - **Scheduler Harian (`notif:stok-harian`):** Pengiriman rekap ketersediaan kantong darah harian setiap pukul 07:00 WIB.

---

## 🛡️ Kepatuhan Standar Operasional Prosedur (SOP)

| Poin SOP | Ketentuan | Implementasi di Sistem |
| :--- | :--- | :--- |
| **SOP 1 & 6** | Keamanan & Mitigasi Serangan | Rate limiter `throttle:5,1` pada login, hashing password `bcrypt`, sanitasi input `strip_tags`, validasi eksplisit `email`, proteksi route otorisasi `auth:sanctum`. |
| **SOP 1** | Pembatasan File Upload | Pembatasan ekstensi `.jpg, .jpeg, .png`, ukuran maksimal `2MB` (`Base64ImageRule`), dan pembatasan jumlah file maksimal 8. |
| **SOP 2** | User Interface & Responsivitas | Responsive design mobile, tablet, desktop menggunakan TailwindCSS. Terdapat `loading state` (spinner) dan `error state` (alert retry). |
| **SOP 3** | Clean Code & Subdirectory | Routing dengan `basename` dinamis, `base: './'` pada Vite, tanpa `<a>` hardcoded, konstanta kontak terpusat di `src/config/site.ts`. |
| **SOP 4** | Manajemen API & Environment | Panggilan API terpusat di `api.ts`, seluruh credential (Fonnte Token, Meta Token, DB Password) disimpan di `.env`. |
| **SOP 5** | Database & Query Pagination | Seluruh pengambilan data menggunakan `->paginate(10)`. Frontend dilengkapi kontrol pagination navigasi halaman. |
| **SOP 7** | Automated Testing | 8 Test Suite lengkap (`36 feature tests`, `124 assertions`) 100% lulus uji regresi otomatis. |

---

## 🛠️ Tech Stack

- **Backend:** PHP 8.2+, Laravel 11, Laravel Sanctum, SQLite (Testing) / MySQL (Production).
- **Frontend:** TypeScript, React 19, Vite 6, TailwindCSS, Lucide React, Sonner Toast.
- **Third-Party APIs:** Fonnte WhatsApp API Gateway, Meta Instagram Graph API v20.0, Open-Meteo Weather API.

---

## 💻 Panduan Instalasi & Menjalankan Lokal

### 1. Prasyarat Sistem
- PHP >= 8.2 & Composer
- Node.js >= 18.x & pnpm / npm
- MySQL Server (XAMPP / Laragon / Native)

### 2. Konfigurasi Backend (Laravel)
```bash
# Masuk ke folder backend
cd backend

# Salin konfigurasi environment
cp .env.example .env

# Pasang dependencies
composer install

# Buat Application Key
php artisan key:generate

# Jalankan migrasi dan seeder database
php artisan migrate --seed

# Jalankan server backend (Port 8000)
php artisan serve
```

### 3. Konfigurasi Frontend (React + Vite)
```bash
# Buka terminal baru dan masuk ke folder frontend
cd frontend

# Salin konfigurasi environment (opsional untuk dev)
cp .env.example .env

# Pasang dependencies
pnpm install # atau npm install

# Jalankan development server (Port 5173)
pnpm run dev # atau npm run dev
```

Buka browser di: **`http://localhost:5173`**

---

## 🔑 Akun Demo Administrator

- **URL Login Admin:** `http://localhost:5173/admin/login`
- **Username:** `admin`
- **Password:** `pmi2026`

---

## 🧪 Menjalankan Automated Testing

Untuk memverifikasi integritas seluruh fitur dan kepatuhan SOP Keamanan & Database:
```bash
cd backend
php artisan test
```
*Hasil: 36 Tests, 124 Assertions, 100% PASSED.*

---

## ⏰ Menjalankan Scheduler Notifikasi Harian Manual

Untuk menguji rekap stok darah harian ke WhatsApp & Instagram:
```bash
cd backend
php artisan notif:stok-harian
```

---

## 👥 Tim Pengembang & Hak Cipta

- **Institusi:** Program Studi Teknologi Informasi, Universitas Muhammadiyah Yogyakarta
- **Mitra:** Palang Merah Indonesia (PMI) Kabupaten Kulon Progo
- **Tahun:** 2026
