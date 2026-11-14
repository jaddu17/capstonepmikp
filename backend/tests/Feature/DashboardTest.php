<?php

namespace Tests\Feature;

use App\Models\Berita;
use App\Models\Donasi;
use App\Models\JadwalDonor;
use App\Models\Pesan;
use App\Models\StokDarah;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_dashboard_stats(): void
    {
        $response = $this->getJson('/api/dashboard/stats');
        $response->assertStatus(401);
    }

    public function test_admin_can_get_realtime_dashboard_stats(): void
    {
        $admin = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($admin);

        // Buat data stok darah
        StokDarah::create([
            'type' => 'A',
            'wb' => 20,
            'prc' => 30,
            'tc' => 10,
            'status' => 'STOK CUKUP',
        ]);

        StokDarah::create([
            'type' => 'B',
            'wb' => 2,
            'prc' => 1,
            'tc' => 1,
            'status' => 'STOK KURANG',
        ]);

        // Buat data jadwal
        JadwalDonor::create([
            'date' => '25 November 2026',
            'day' => 'Rabu',
            'time' => '08:00 - 12:00',
            'quota' => 50,
            'location' => 'Kantor PMI Kulon Progo',
        ]);

        // Buat data pesan belum dibaca
        Pesan::create([
            'name' => 'Ahmad',
            'email' => 'ahmad@example.com',
            'message' => 'Tanya jadwal donor',
            'read' => false,
        ]);

        // Buat data berita
        Berita::create([
            'title' => 'Kegiatan Donor Masal',
            'published' => true,
        ]);

        $response = $this->getJson('/api/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'stats' => [
                    'total_stok',
                    'jadwal_donor',
                    'total_donasi',
                    'total_layanan',
                ],
                'alerts',
                'recent_activities',
            ]);

        // Total stok A (60) + B (4) = 64
        $this->assertEquals(64, $response->json('stats.total_stok'));
        $this->assertEquals(1, $response->json('stats.jadwal_donor'));
        
        // Cek alert untuk stok B yang menipis
        $alerts = collect($response->json('alerts'));
        $this->assertTrue($alerts->contains(function ($item) {
            return str_contains($item['message'], 'Stok darah B menipis');
        }));

        // Cek alert pesan baru
        $this->assertTrue($alerts->contains(function ($item) {
            return str_contains($item['message'], 'pesan baru dari masyarakat belum dibaca');
        }));
    }
}
