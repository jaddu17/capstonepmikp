<?php

namespace Tests\Feature;

use App\Models\Berita;
use App\Models\JadwalDonor;
use App\Models\User;
use App\Services\InstagramService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class InstagramTest extends TestCase
{
    use RefreshDatabase;

    public function test_instagram_service_publishes_photo_in_simulator_mode(): void
    {
        $result = InstagramService::publishPhoto("Test Caption PMI Kulon Progo", null);

        $this->assertTrue($result['success']);
        $this->assertEquals('simulator', $result['mode']);
        $this->assertNotEmpty($result['post_id']);
    }

    public function test_creating_berita_triggers_instagram_auto_post(): void
    {
        $user = User::create([
            'name' => 'admin',
            'email' => 'admin@pmikp.id',
            'password' => 'pmi2026',
        ]);
        Sanctum::actingAs($user);

        $payload = [
            'title' => 'Edukasi Kemanusiaan di Wates',
            'category' => 'Kegiatan',
            'date' => '29 Oktober 2026',
            'excerpt' => 'Relawan PMI KP mengadakan edukasi.',
            'content' => 'Lengkap isi berita...',
            'published' => true,
        ];

        $response = $this->postJson('/api/beritas', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('beritas', [
            'title' => 'Edukasi Kemanusiaan di Wates',
        ]);
    }

    public function test_creating_jadwal_donor_triggers_instagram_auto_post(): void
    {
        $user = User::create([
            'name' => 'admin',
            'email' => 'admin@pmikp.id',
            'password' => 'pmi2026',
        ]);
        Sanctum::actingAs($user);

        $payload = [
            'date' => '30 Oktober 2026',
            'day' => 'Jumat',
            'location' => 'Balai Desa Pengasih',
            'time' => '08:30 - 12:00',
            'quota' => '75 Kantong',
        ];

        $response = $this->postJson('/api/jadwal-donors', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('jadwal_donors', [
            'location' => 'Balai Desa Pengasih',
        ]);
    }
}
