<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonnteService
{
    /**
     * Kirim pesan WhatsApp melalui Fonnte Gateway.
     *
     * @param string $message
     * @param string|null $target (Nomor HP atau ID Grup)
     * @return array
     */
    public static function send(string $message, ?string $target = null): array
    {
        $token = config('services.fonnte.token');
        $target = $target ?: config('services.fonnte.target');
        $endpoint = config('services.fonnte.endpoint', 'https://api.fonnte.com/send');

        if (empty($token) || empty($target)) {
            Log::warning('FonnteService: Token atau Target belum dikonfigurasi di .env');
            return [
                'status' => false,
                'message' => 'Token atau Target Fonnte belum dikonfigurasi',
            ];
        }

        try {
            $verifySsl = filter_var(config('services.fonnte.verify_ssl'), FILTER_VALIDATE_BOOLEAN);
            $client = $verifySsl ? Http::withHeaders(['Authorization' => $token]) : Http::withoutVerifying()->withHeaders(['Authorization' => $token]);

            $response = $client->timeout(10)->post($endpoint, [
                'target' => $target,
                'message' => $message,
                'countryCode' => '62',
            ]);

            $result = $response->json();
            Log::info('FonnteService sent message:', ['target' => $target, 'response' => $result]);

            return [
                'status' => $response->successful(),
                'data' => $result,
            ];
        } catch (\Throwable $e) {
            Log::error('FonnteService Error: ' . $e->getMessage());
            return [
                'status' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Notifikasi saat Berita Baru diterbitkan.
     */
    public static function notifyNewBerita($berita): array
    {
        $title = $berita->title ?? 'Berita Baru';
        $category = $berita->category ?? 'Umum';
        $date = $berita->date ?? date('d M Y');
        $excerpt = $berita->excerpt ?? '';

        $message = "📢 *[BERITA TERBARU - PMI KULON PROGO]*\n\n"
                 . "📌 *Judul:* {$title}\n"
                 . "📁 *Kategori:* {$category}\n"
                 . "🗓️ *Tanggal:* {$date}\n\n"
                 . ($excerpt ? "_{$excerpt}_\n\n" : "")
                 . "Kunjungi website resmi PMI Kabupaten Kulon Progo untuk membaca informasi selengkapnya.";

        return self::send($message);
    }

    /**
     * Notifikasi saat Jadwal Donor Darah Baru ditambahkan.
     */
    public static function notifyNewJadwal($jadwal): array
    {
        $date = $jadwal->date ?? '-';
        $day = $jadwal->day ?? '-';
        $location = $jadwal->location ?? '-';
        $time = $jadwal->time ?? '-';
        $quota = $jadwal->quota ?? '-';

        $message = "🩸 *[JADWAL DONOR DARAH TERBARU]*\n\n"
                 . "🗓️ *Hari/Tanggal:* {$day}, {$date}\n"
                 . "📍 *Lokasi:* {$location}\n"
                 . "⏰ *Waktu:* {$time}\n"
                 . "🎯 *Target Kantong:* {$quota}\n\n"
                 . "Ayo donorkan darahmu! Setetes darah Anda, nyawa bagi sesama.\n"
                 . "Informasi lebih lanjut kunjungi website PMI Kulon Progo.";

        return self::send($message);
    }

    /**
     * Notifikasi saat Stok Darah diperbarui.
     */
    public static function notifyStokDarahUpdated(): array
    {
        $message = "🩸 *[UPDATE STOK DARAH TERKINI]*\n\n"
                 . "Stok ketersediaan darah di PMI Kulon Progo baru saja diperbarui oleh petugas.\n"
                 . "Silakan cek ketersediaan golongan darah A, B, O, dan AB di website resmi PMI Kulon Progo.";

        return self::send($message);
    }

    /**
     * Notifikasi saat Infografis Bulanan Baru diterbitkan.
     */
    public static function notifyNewInfografis($infografis): array
    {
        $bulan = strtoupper($infografis->bulan ?? 'Terbaru');
        $tahun = $infografis->tahun ?? date('Y');
        $stats = is_array($infografis->stats) ? $infografis->stats : json_decode($infografis->stats ?? '[]', true);

        $pp = $stats['pertolongan_pertama'] ?? 0;
        $ambulance = $stats['pelayanan_ambulance'] ?? ($stats['home_emergency'] ?? 0);
        $kecelakaan = $stats['kecelakaan'] ?? 0;
        $kebakaran = $stats['kebakaran'] ?? 0;
        $bencana = $stats['bencana_alam'] ?? 0;
        $jenazah = $stats['evakuasi_jenazah'] ?? 0;

        $quote = !empty($infografis->quote) ? "💬 _{$infografis->quote}_\n\n" : "";

        $message = "📊 *[LAPORAN INFOGRAFIS PELAYANAN PMI - {$bulan} {$tahun}]*\n\n"
                 . "Berikut capaian pelayanan kemanusiaan PMI Kabupaten Kulon Progo periode {$bulan} {$tahun}:\n\n"
                 . "🚑 *Rekapitulasi Layanan:*\n"
                 . "   • Pertolongan Pertama : {$pp} Kejadian\n"
                 . "   • Kecelakaan Lalu Lintas : {$kecelakaan} Kejadian\n"
                 . "   • Bencana Alam : {$bencana} Lokasi\n"
                 . "   • Kebakaran : {$kebakaran} Kejadian\n"
                 . "   • Evakuasi Jenazah : {$jenazah} Pasien\n"
                 . "   • Home Emergency / Ambulans : {$ambulance} Layanan\n\n"
                 . $quote
                 . "Informasi dan dokumentasi pelayanan lengkap dapat dilihat di website resmi PMI Kulon Progo.";

        return self::send($message);
    }
}
