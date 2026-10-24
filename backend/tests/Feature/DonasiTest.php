<?php

namespace Tests\Feature;

use App\Models\Donasi;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DonasiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_submit_donation(): void
    {
        $validProof = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

        $payload = [
            'nama' => 'Budi Santoso',
            'wa' => '081234567890',
            'keterangan' => 'Donasi untuk kemanusiaan',
            'proof' => $validProof,
            'date' => '24 Oktober 2026',
        ];

        $response = $this->postJson('/api/donasis', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'nama' => 'Budi Santoso',
                'status' => 'Sudah Bayar',
            ]);

        $this->assertDatabaseHas('donasis', [
            'nama' => 'Budi Santoso',
        ]);
    }

    public function test_donation_proof_rejects_invalid_file_extension(): void
    {
        $payload = [
            'nama' => 'Donatur',
            'date' => '24 Oktober 2026',
            'proof' => 'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
        ];

        $response = $this->postJson('/api/donasis', $payload);

        // Menolak format selain jpg, jpeg, png
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['proof']);
    }

    public function test_admin_can_view_paginated_donations(): void
    {
        $admin = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($admin);

        for ($i = 1; $i <= 11; $i++) {
            Donasi::create([
                'nama' => "Donatur {$i}",
                'date' => '24 Oktober 2026',
                'status' => 'Sudah Bayar',
            ]);
        }

        $response = $this->getJson('/api/donasis');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'current_page', 'total']);

        $this->assertCount(10, $response->json('data'));
    }

    public function test_admin_can_update_donation_status_to_selesai(): void
    {
        $admin = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($admin);

        $donasi = Donasi::create([
            'nama' => 'Hamba Allah',
            'date' => '24 Oktober 2026',
            'status' => 'Sudah Bayar',
        ]);

        $response = $this->putJson("/api/donasis/{$donasi->id}", [
            'status' => 'Selesai',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['status' => 'Selesai']);

        $this->assertDatabaseHas('donasis', [
            'id' => $donasi->id,
            'status' => 'Selesai',
        ]);
    }

    public function test_guest_cannot_view_donations_list(): void
    {
        // Publik tidak boleh melihat rekap data donatur demi privasi data sensitif (SOP Poin 6)
        $response = $this->getJson('/api/donasis');
        $response->assertStatus(401);
    }
}
