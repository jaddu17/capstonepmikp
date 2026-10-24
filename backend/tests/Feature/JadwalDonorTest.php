<?php

namespace Tests\Feature;

use App\Models\JadwalDonor;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class JadwalDonorTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_view_paginated_jadwal_donor(): void
    {
        for ($i = 1; $i <= 12; $i++) {
            JadwalDonor::create([
                'date' => "2026-10-{$i}",
                'day' => 'Senin',
                'location' => "Balai Desa {$i}",
                'time' => '08:00 - 12:00',
                'quota' => '50 Kantong',
            ]);
        }

        $response = $this->getJson('/api/jadwal-donors');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'current_page', 'total']);

        $this->assertCount(10, $response->json('data'));
        $this->assertEquals(12, $response->json('total'));
    }

    public function test_admin_can_create_jadwal_donor(): void
    {
        Http::fake();

        $admin = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($admin);

        $payload = [
            'date' => '28 Oktober 2026',
            'day' => 'Rabu',
            'location' => 'Kantor Kapanewon Galur',
            'time' => '08:30 - 11:30',
            'quota' => '60 Kantong',
        ];

        $response = $this->postJson('/api/jadwal-donors', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'location' => 'Kantor Kapanewon Galur',
            ]);

        $this->assertDatabaseHas('jadwal_donors', [
            'location' => 'Kantor Kapanewon Galur',
        ]);
    }

    public function test_jadwal_donor_validation_requires_mandatory_fields(): void
    {
        $admin = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($admin);

        // Kirim tanpa tanggal, hari, lokasi, dan waktu
        $response = $this->postJson('/api/jadwal-donors', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['date', 'day', 'location', 'time']);
    }

    public function test_admin_can_delete_jadwal_donor(): void
    {
        $admin = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($admin);

        $jadwal = JadwalDonor::create([
            'date' => '30 Oktober 2026',
            'day' => 'Jumat',
            'location' => 'SMK 1 Pengasih',
            'time' => '09:00 - 12:00',
            'quota' => '40',
        ]);

        $response = $this->deleteJson("/api/jadwal-donors/{$jadwal->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('jadwal_donors', [
            'id' => $jadwal->id,
        ]);
    }
}
