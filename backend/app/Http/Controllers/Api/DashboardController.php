<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use App\Models\Donasi;
use App\Models\Infografis;
use App\Models\JadwalDonor;
use App\Models\Pesan;
use App\Models\StokDarah;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Mengambil ringkasan data statistik real-time untuk dashboard admin.
     */
    public function stats(): JsonResponse
    {
        // 1. Total Stok Darah (penjumlahan seluruh kantong WB + PRC + TC)
        $totalStok = (int) StokDarah::all()->sum(function ($item) {
            return ($item->wb ?? 0) + ($item->prc ?? 0) + ($item->tc ?? 0);
        });

        // 2. Jadwal Donor
        $totalJadwal = JadwalDonor::count();

        // 3. Total Donasi Masuk
        $totalDonasi = Donasi::count();

        // 4. Total Layanan dari Infografis Terkini
        $latestInfografis = Infografis::orderBy('created_at', 'desc')->first();
        $totalLayanan = 0;
        if ($latestInfografis && is_array($latestInfografis->stats)) {
            foreach ($latestInfografis->stats as $val) {
                $totalLayanan += (int) $val;
            }
        }

        // 5. Notifikasi & Peringatan Dinamis
        $alerts = [];
        
        // Cek stok darah yang berstatus kurang/menipis
        $lowStocks = StokDarah::where(function ($q) {
            $q->where('status', 'like', '%Kurang%')
              ->orWhere('status', 'like', '%Menipis%');
        })->get();

        foreach ($lowStocks as $ls) {
            $currentTotal = ($ls->wb ?? 0) + ($ls->prc ?? 0) + ($ls->tc ?? 0);
            $alerts[] = [
                'type' => 'warning',
                'message' => "Stok darah {$ls->type} menipis (sisa {$currentTotal} kantong)",
            ];
        }

        // Pesan masyarakat yang belum dibaca
        $unreadMessagesCount = Pesan::where('read', false)->count();
        if ($unreadMessagesCount > 0) {
            $alerts[] = [
                'type' => 'info',
                'message' => "{$unreadMessagesCount} pesan baru dari masyarakat belum dibaca",
            ];
        }

        // Donasi yang baru masuk dan butuh verifikasi
        $pendingDonationsCount = Donasi::where('status', 'Sudah Bayar')->count();
        if ($pendingDonationsCount > 0) {
            $alerts[] = [
                'type' => 'info',
                'message' => "{$pendingDonationsCount} donasi baru menunggu verifikasi admin",
            ];
        }

        if (empty($alerts)) {
            $alerts[] = [
                'type' => 'info',
                'message' => 'Semua sistem dan stok darah dalam status normal',
            ];
        }

        // 6. Aktivitas Terbaru Teragregasi
        $activities = [];

        $recentBeritas = Berita::orderBy('updated_at', 'desc')->take(2)->get();
        foreach ($recentBeritas as $b) {
            $activities[] = [
                'action' => 'Publikasi berita: ' . ($b->title ?: 'Tanpa Judul'),
                'timestamp' => $b->updated_at,
                'user' => 'Admin',
            ];
        }

        $recentStok = StokDarah::orderBy('updated_at', 'desc')->take(2)->get();
        foreach ($recentStok as $s) {
            $activities[] = [
                'action' => 'Update stok darah golongan ' . $s->type,
                'timestamp' => $s->updated_at,
                'user' => 'Admin',
            ];
        }

        $recentJadwal = JadwalDonor::orderBy('created_at', 'desc')->take(2)->get();
        foreach ($recentJadwal as $j) {
            $activities[] = [
                'action' => 'Tambah jadwal donor di ' . ($j->location ?: 'Kulon Progo'),
                'timestamp' => $j->created_at,
                'user' => 'Admin',
            ];
        }

        $recentPesan = Pesan::orderBy('updated_at', 'desc')->take(2)->get();
        foreach ($recentPesan as $p) {
            $activities[] = [
                'action' => $p->replied ? "Balas pesan dari {$p->name}" : "Pesan baru dari {$p->name}",
                'timestamp' => $p->updated_at,
                'user' => $p->replied ? 'Admin' : 'Masyarakat',
            ];
        }

        $recentDonasi = Donasi::orderBy('created_at', 'desc')->take(2)->get();
        foreach ($recentDonasi as $d) {
            $activities[] = [
                'action' => 'Donasi masuk dari ' . ($d->nama ?: 'Donatur'),
                'timestamp' => $d->created_at,
                'user' => 'Donatur',
            ];
        }

        usort($activities, function ($a, $b) {
            return ($b['timestamp'] ?? 0) <=> ($a['timestamp'] ?? 0);
        });

        $formattedActivities = array_map(function ($act) {
            $timeString = 'Baru saja';
            if (!empty($act['timestamp'])) {
                try {
                    $diff = Carbon::parse($act['timestamp'])->diffForHumans();
                    $timeString = str_replace(
                        ['seconds ago', 'second ago', 'minutes ago', 'minute ago', 'hours ago', 'hour ago', 'days ago', 'day ago', 'before'],
                        ['detik lalu', 'detik lalu', 'menit lalu', 'menit lalu', 'jam lalu', 'jam lalu', 'hari lalu', 'hari lalu', 'lalu'],
                        $diff
                    );
                } catch (\Throwable) {
                    $timeString = 'Baru saja';
                }
            }
            return [
                'action' => $act['action'],
                'time' => $timeString,
                'user' => $act['user'],
            ];
        }, array_slice($activities, 0, 4));

        return response()->json([
            'stats' => [
                'total_stok' => $totalStok,
                'jadwal_donor' => $totalJadwal,
                'total_donasi' => $totalDonasi,
                'total_layanan' => $totalLayanan,
            ],
            'alerts' => $alerts,
            'recent_activities' => $formattedActivities,
        ]);
    }
}

