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
| **SOP 1** | Pembatasan File Upload & Payload | Pembatasan ekstensi `.jpg, .jpeg, .png`, ukuran maksimal `2MB` (`Base64ImageRule`), pembatasan dokumentasi maksimal 8 file. Gambar otomatis dikonversi dan disimpan ke disk storage publik (`/storage/...`), mereduksi payload API response ke `<10KB`. |
| **SOP 2** | User Interface & Responsivitas | Responsive design mobile, tablet, desktop menggunakan TailwindCSS. Terdapat `loading state` (spinner) dan `error state` (alert retry). |
| **SOP 3** | Clean Code & Subdirectory Routing | Routing dengan `basename` dinamis berbasis `VITE_BASE_PATH` (default `/`), tanpa `<a>` hardcoded (menggunakan `<Link>`), konstanta kontak terpusat di `src/config/site.ts`. |
| **SOP 4** | Manajemen API & Environment | Panggilan API terpusat di `api.ts`, konfigurasi third-party terisolasi di `config/services.php` (tahan terhadap `config:cache`), seluruh credential disimpan aman di `.env`. |
| **SOP 5** | Database & Query Pagination | Seluruh pengambilan data menggunakan `->paginate(10)`. Frontend dilengkapi kontrol navigasi halaman dan status empty state. Kolom database gambar bertipe `LONGTEXT` untuk mencegah data truncation. |
| **SOP 7** | Automated Testing | 8 Test Suite lengkap (`36 feature tests`, `124 assertions`) 100% lulus uji regresi otomatis. |

---

## 🛠️ Tech Stack

- **Backend:** PHP 8.2+, Laravel 11, Laravel Sanctum, MySQL (Production) / SQLite (Testing).
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

# Hubungkan symbolic link public storage (untuk asset media upload)
php artisan storage:link

# Jalankan migrasi dan seeder database
php artisan migrate --seed

# Jalankan server backend (Port 8000)
php artisan serve
```

### 3. Konfigurasi Frontend (React + Vite)
```bash
# Buka terminal baru dan masuk ke folder frontend
cd frontend

# Salin konfigurasi environment
cp .env.example .env

# Pasang dependencies
pnpm install # atau npm install

# Jalankan development server (Port 5173)
pnpm run dev # atau npm run dev
```

Buka browser di: **`http://localhost:5173`**

### 4. Build untuk Production
```bash
cd frontend
pnpm run build

# Uji hasil bundle produksi secara lokal
pnpm run preview
```

---

## 🔑 Akun Demo Administrator

- **URL Login Admin:** `http://localhost:5173/admin/login`
- **Username:** `admin`
- **Password:** `pmi2026` *(atau sesuai `ADMIN_PASSWORD` pada `.env`)*

---

## ⏰ Menjalankan Task Scheduler Otomatis (WhatsApp & Instagram)

Sistem memiliki task terjadwal otomatis (`notif:stok-harian`) yang mengirimkan rekap stok darah harian ke WhatsApp Group PMI dan Feed Instagram setiap pukul **07:00 WIB**.

### A. Untuk Keperluan Presentasi & Demo Lokal (Laptop Penguji/Dosen)
Jalankan scheduler worker di terminal backend agar scheduler terus berjalan secara real-time:
```bash
cd backend
php artisan schedule:work
```
*Worker ini akan mengecek antrean tugas terjadwal setiap 1 menit tanpa perlu mengonfigurasi cron Linux.*

### B. Untuk Server Produksi (Linux / VPS / cPanel)
Tambahkan baris berikut ke crontab server pengguna (`crontab -e`):
```bash
* * * * * cd /var/www/capstonepmikp/backend && php artisan schedule:run >> /dev/null 2>&1
```

### C. Eksekusi Seketika (Manual Testing On-Demand)
Untuk langsung menguji notifikasi harian tanpa menunggu jam 07:00:
```bash
cd backend
php artisan notif:stok-harian
```

---

## 🧪 Menjalankan Automated Testing

Untuk memverifikasi integritas seluruh fitur dan kepatuhan SOP Keamanan & Database:
```bash
cd backend
php artisan test
```
*Hasil: 36 Tests, 124 Assertions, 100% PASSED.*

---

## 👥 Tim Pengembang & Hak Cipta

- **Institusi:** Program Studi Teknologi Informasi, Universitas Muhammadiyah Yogyakarta
- **Mitra:** Palang Merah Indonesia (PMI) Kabupaten Kulon Progo
- **Tahun:** 2026

