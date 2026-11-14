<?php

namespace Tests\Feature;

use App\Models\Berita;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BeritaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
        Storage::fake('local');
    }

    public function test_public_can_get_paginated_beritas(): void
    {
        // Buat 15 berita dummy
        for ($i = 1; $i <= 15; $i++) {
            Berita::create([
                'title' => "Berita {$i}",
                'date' => '24 Oktober 2026',
                'category' => 'Donor Darah',
                'excerpt' => 'Ringkasan berita',
                'content' => 'Konten lengkap berita',
                'published' => true,
            ]);
        }

        $response = $this->getJson('/api/beritas');

        // Memastikan response pagination sesuai SOP Poin 5
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data',
                'current_page',
                'per_page',
                'total',
            ]);

        // Per page default adalah 10 data
        $this->assertCount(10, $response->json('data'));
        $this->assertEquals(15, $response->json('total'));
    }

    public function test_admin_can_create_berita_with_valid_data(): void
    {
        Http::fake(); // Mencegah panggilan API WA eksternal selama test

        $admin = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($admin);

        // Gambar base64 valid format PNG (1x1 pixel)
        $validImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        $payload = [
            'title' => 'Kegiatan Donor Darah di Wates',
            'date' => '24 Oktober 2026',
            'category' => 'Donor Darah',
            'excerpt' => 'Kegiatan donor darah massal',
            'content' => 'Pelaksanaan donor darah berjalan lancar dan tertib.',
            'image' => $validImage,
            'published' => true,
        ];

        $response = $this->postJson('/api/beritas', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'title' => 'Kegiatan Donor Darah di Wates',
            ]);

        $this->assertDatabaseHas('beritas', [
            'title' => 'Kegiatan Donor Darah di Wates',
        ]);

        $createdBerita = Berita::where('title', 'Kegiatan Donor Darah di Wates')->first();
        $this->assertStringStartsWith('/storage/berita/', $createdBerita->image);
    }

    public function test_berita_rejects_invalid_image_format(): void
    {
        $admin = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($admin);

        // Ekstensi gif tidak diperbolehkan (hanya jpg, jpeg, png)
        $invalidImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

        $payload = [
            'title' => 'Berita Gambar Salah',
            'image' => $invalidImage,
        ];

        $response = $this->postJson('/api/beritas', $payload);

        // Sesuai SOP Poin 1: Validasi upload file menolak format tidak valid
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['image']);
    }

    public function test_admin_can_update_berita(): void
    {
        $admin = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($admin);

        $berita = Berita::create([
            'title' => 'Judul Sebelum Update',
            'category' => 'Umum',
            'published' => true,
        ]);

        $response = $this->putJson("/api/beritas/{$berita->id}", [
            'title' => 'Judul Setelah Diperbarui',
            'category' => 'Pelatihan',
            'published' => true,
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'title' => 'Judul Setelah Diperbarui',
            ]);

        $this->assertDatabaseHas('beritas', [
            'id' => $berita->id,
            'title' => 'Judul Setelah Diperbarui',
        ]);
    }

    public function test_admin_can_delete_berita(): void
    {
        $admin = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($admin);

        $berita = Berita::create([
            'title' => 'Berita Yang Akan Dihapus',
            'published' => true,
        ]);

        $response = $this->deleteJson("/api/beritas/{$berita->id}");

        $response->assertNoContent();

        $this->assertDatabaseMissing('beritas', [
            'id' => $berita->id,
        ]);
    }

    public function test_guest_cannot_create_or_delete_berita(): void
    {
        // Tanpa token autentikasi (Guest)
        $responsePost = $this->postJson('/api/beritas', [
            'title' => 'Berita Hacker',
        ]);
        $responsePost->assertStatus(401);

        $berita = Berita::create([
            'title' => 'Berita Resmi',
            'published' => true,
        ]);

        $responseDelete = $this->deleteJson("/api/beritas/{$berita->id}");
        $responseDelete->assertStatus(401);
    }

    public function test_public_cannot_view_draft_news(): void
    {
        // Berita terbit
        Berita::create([
            'title' => 'Berita Terbit Publik',
            'published' => true,
        ]);

        // Berita draft (belum dipublikasikan)
        Berita::create([
            'title' => 'Berita Rahasia Masih Draft',
            'published' => false,
        ]);

        $response = $this->getJson('/api/beritas');

        $response->assertStatus(200);
        $this->assertEquals(1, $response->json('total'));
        $this->assertEquals('Berita Terbit Publik', $response->json('data')[0]['title']);
    }

    public function test_admin_can_update_draft_berita_with_existing_storage_image(): void
    {
        $admin = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($admin);

        $berita = Berita::create([
            'title' => 'Draft Berita',
            'category' => 'Donor Darah',
            'image' => '/storage/berita/sample_test.png',
            'published' => false,
        ]);

        $response = $this->putJson("/api/beritas/{$berita->id}", [
            'title' => 'Draft Berita Diperbarui',
            'image' => '/storage/berita/sample_test.png',
            'published' => false,
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'title' => 'Draft Berita Diperbarui',
                'image' => '/storage/berita/sample_test.png',
                'published' => false,
            ]);
    }

    public function test_admin_can_update_seeded_berita_with_unsplash_image_url(): void
    {
        $admin = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($admin);

        $unsplashUrl = 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&h=500&fit=crop';
        $berita = Berita::create([
            'title' => 'PMI Kulon Progo Kumpulkan Darah',
            'category' => 'Donor Darah',
            'image' => $unsplashUrl,
            'published' => true,
        ]);

        // Mengedit berita seeder tanpa mengubah gambarnya tidak boleh ditolak
        $response = $this->putJson("/api/beritas/{$berita->id}", [
            'title' => 'PMI Kulon Progo Kumpulkan 300 Kantong Darah',
            'image' => $unsplashUrl,
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'title' => 'PMI Kulon Progo Kumpulkan 300 Kantong Darah',
                'image' => $unsplashUrl,
            ]);
    }
}
