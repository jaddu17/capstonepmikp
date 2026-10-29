<?php

namespace App\Services;

use App\Models\Berita;
use App\Models\JadwalDonor;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class InstagramService
{
    /**
     * Mempublikasikan foto dan caption ke Instagram via Meta Graph API.
     *
     * @param string $caption
     * @param string|null $imageUrl
     * @return array
     */
    public static function publishPhoto(string $caption, ?string $imageUrl = null): array
    {
        $enabled = filter_var(config('services.instagram.enabled', true), FILTER_VALIDATE_BOOLEAN);
        if (!$enabled) {
            return [
                'success' => false,
                'message' => 'Instagram auto-post dinonaktifkan di konfigurasi',
            ];
        }

        $isMock = filter_var(config('services.instagram.mock', true), FILTER_VALIDATE_BOOLEAN);
        $accountId = config('services.instagram.account_id', '17841400000000000');
        $accessToken = config('services.instagram.access_token');
        $defaultImage = config('services.instagram.default_image', 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80');

        // Jika mode MOCK aktif atau token belum diatur, jalankan simulasi sukses
        if ($isMock || empty($accessToken) || empty($accountId)) {
            $simulatedContainerId = 'container_' . uniqid();
            $simulatedPostId = 'ig_post_' . time();

            Log::info('[InstagramService - SIMULATOR] Auto-post Instagram berhasil disimulasikan:', [
                'account_id' => $accountId,
                'caption' => $caption,
                'image_url' => $imageUrl ? (strlen($imageUrl) > 80 ? substr($imageUrl, 0, 80) . '...' : $imageUrl) : 'Official PMI Default Banner',
                'container_id' => $simulatedContainerId,
                'post_id' => $simulatedPostId,
                'timestamp' => now()->toDateTimeString(),
            ]);

            return [
                'success' => true,
                'mode' => 'simulator',
                'container_id' => $simulatedContainerId,
                'post_id' => $simulatedPostId,
                'message' => 'Postingan berhasil disimulasikan ke Instagram (Simulator Mode)',
            ];
        }

        // Mode LIVE: Menghubungi Meta Graph API
        try {
            // URL gambar fallback jika tidak ada gambar atau berupa base64
            // (Meta Graph API mewajibkan URL gambar publik HTTPS yang dapat diakses oleh server Meta)
            $targetImageUrl = $imageUrl;
            if (!empty($targetImageUrl) && str_starts_with($targetImageUrl, '/storage/')) {
                $targetImageUrl = url($targetImageUrl);
            }

            if (empty($targetImageUrl) || str_starts_with($targetImageUrl, 'data:image') || str_starts_with($targetImageUrl, 'http://localhost') || str_starts_with($targetImageUrl, 'http://127.0.0.1')) {
                $targetImageUrl = $defaultImage;
            }

            $verifySsl = filter_var(config('services.instagram.verify_ssl'), FILTER_VALIDATE_BOOLEAN);
            $client = $verifySsl ? Http::timeout(15) : Http::withoutVerifying()->timeout(15);

            // Step 1: Create Media Container
            $containerUrl = "https://graph.facebook.com/v20.0/{$accountId}/media";
            $containerResponse = $client->post($containerUrl, [
                'image_url' => $targetImageUrl,
                'caption' => $caption,
                'access_token' => $accessToken,
            ]);

            if (!$containerResponse->successful()) {
                Log::error('[InstagramService] Gagal membuat media container:', $containerResponse->json());
                return [
                    'success' => false,
                    'error' => $containerResponse->json(),
                ];
            }

            $containerId = $containerResponse->json('id');

            // Step 2: Publish Media Container
            $publishUrl = "https://graph.facebook.com/v20.0/{$accountId}/media_publish";
            $publishResponse = $client->post($publishUrl, [
                'creation_id' => $containerId,
                'access_token' => $accessToken,
            ]);

            if (!$publishResponse->successful()) {
                Log::error('[InstagramService] Gagal mempublikasikan media ke Instagram:', $publishResponse->json());
                return [
                    'success' => false,
                    'error' => $publishResponse->json(),
                ];
            }

            $postId = $publishResponse->json('id');
            Log::info('[InstagramService] Berhasil mempublikasikan postingan ke Instagram:', [
                'post_id' => $postId,
            ]);

            return [
                'success' => true,
                'mode' => 'live',
                'post_id' => $postId,
            ];
        } catch (\Throwable $e) {
            Log::error('[InstagramService] Error exception saat menghubungi Meta API: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Otomatis posting ke Instagram saat ada Berita baru.
     */
    public static function notifyNewBerita(Berita $berita): array
    {
        $caption = "🔴 KABAR TERBARU PMI KULON PROGO 🔴\n\n"
            . "📌 {$berita->title}\n\n"
            . "Kategori: " . ($berita->category ?? 'Informasi') . "\n"
            . "Tanggal: " . ($berita->date ?? date('d M Y')) . "\n\n"
            . ($berita->excerpt ? "{$berita->excerpt}\n\n" : "")
            . "Baca selengkapnya di website resmi PMI Kabupaten Kulon Progo.\n\n"
            . "#PMIKulonProgo #PalangMerahIndonesia #Kemanusiaan #KulonProgo";

        return self::publishPhoto($caption, $berita->image);
    }

    /**
     * Otomatis posting ke Instagram saat ada Jadwal Donor Darah baru.
     */
    public static function notifyNewJadwal(JadwalDonor $jadwal): array
    {
        $caption = "🩸 JADWAL DONOR DARAH PMI KULON PROGO 🩸\n\n"
            . "Ayo donorkan darahmu dan bantu selamatkan sesama!\n\n"
            . "📍 Lokasi : {$jadwal->location}\n"
            . "🗓️ Hari/Tgl: {$jadwal->day}, {$jadwal->date}\n"
            . "⏰ Waktu  : {$jadwal->time} WIB\n"
            . "👥 Kuota  : " . ($jadwal->quota ?? 'Terbuka untuk Umum') . "\n\n"
            . "Bagikan info ini ke teman dan keluarga. Setetes darahmu, nyawa bagi mereka.\n\n"
            . "#DonorDarah #PMIKulonProgo #AyoDonor #DarahUntukKehidupan #KulonProgo";

        return self::publishPhoto($caption, null);
    }
}
