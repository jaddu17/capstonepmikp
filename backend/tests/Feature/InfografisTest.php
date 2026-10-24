<?php

namespace Tests\Feature;

use App\Models\Infografis;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class InfografisTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_view_infografis_with_pagination(): void
    {
        Infografis::create([
            'bulan' => 'Oktober',
            'tahun' => '2026',
            'kontak' => ['markas' => '0274-12345'],
            'stats' => ['donor_darah' => 150],
            'pelayanan' => ['Ambulans 24 Jam'],
        ]);

        $response = $this->getJson('/api/infografis');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'current_page', 'total']);

        $this->assertCount(1, $response->json('data'));
    }

    public function test_admin_can_create_and_delete_infografis(): void
    {
        $admin = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($admin);

        $payload = [
            'bulan' => 'November',
            'tahun' => '2026',
            'quote' => 'Setetes darah Anda nyawa bagi sesama',
        ];

        $responseCreate = $this->postJson('/api/infografis', $payload);
        $responseCreate->assertStatus(201);

        $createdId = $responseCreate->json('id');

        $responseDelete = $this->deleteJson("/api/infografis/{$createdId}");
        $responseDelete->assertStatus(204);

        $this->assertDatabaseMissing('infografis', [
            'id' => $createdId,
        ]);
    }
}
