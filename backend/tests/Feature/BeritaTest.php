<?php

namespace Tests\Feature;

use App\Models\Berita;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BeritaTest extends TestCase
{
    use RefreshDatabase;

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
}
