<?php

namespace Tests\Feature;

use App\Models\StokDarah;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StokDarahTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_view_stok_darah(): void
    {
        StokDarah::create(['type' => 'A', 'wb' => 15, 'prc' => 20, 'tc' => 5, 'status' => 'STOK CUKUP']);
        StokDarah::create(['type' => 'B', 'wb' => 10, 'prc' => 15, 'tc' => 4, 'status' => 'STOK CUKUP']);
        StokDarah::create(['type' => 'O', 'wb' => 25, 'prc' => 30, 'tc' => 8, 'status' => 'STOK CUKUP']);
        StokDarah::create(['type' => 'AB', 'wb' => 5, 'prc' => 8, 'tc' => 2, 'status' => 'STOK CUKUP']);

        $response = $this->getJson('/api/stok-darahs');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'current_page', 'total']);

        $this->assertCount(4, $response->json('data'));
    }

    public function test_admin_can_bulk_update_stok_darah(): void
    {
        Http::fake();

        $admin = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($admin);

        $stokA = StokDarah::create(['type' => 'A', 'wb' => 10, 'prc' => 10, 'tc' => 5, 'status' => 'STOK CUKUP']);
        $stokB = StokDarah::create(['type' => 'B', 'wb' => 5, 'prc' => 5, 'tc' => 2, 'status' => 'STOK KURANG']);

        $payload = [
            [
                'id' => $stokA->id,
                'wb' => 25,
                'prc' => 30,
                'tc' => 10,
                'status' => 'STOK CUKUP',
            ],
            [
                'id' => $stokB->id,
                'wb' => 15,
                'prc' => 20,
                'tc' => 5,
                'status' => 'STOK CUKUP',
            ],
        ];

        $response = $this->postJson('/api/stok-darahs/bulk-update', $payload);

        $response->assertStatus(200);

        $this->assertDatabaseHas('stok_darahs', [
            'id' => $stokA->id,
            'wb' => 25,
            'prc' => 30,
        ]);

        $this->assertDatabaseHas('stok_darahs', [
            'id' => $stokB->id,
            'wb' => 15,
            'status' => 'STOK CUKUP',
        ]);
    }

    public function test_guest_cannot_bulk_update_stok_darah(): void
    {
        $response = $this->postJson('/api/stok-darahs/bulk-update', []);
        $response->assertStatus(401);
    }

    public function test_daily_stok_notification_command_executes_successfully(): void
    {
        Http::fake();

        StokDarah::create(['type' => 'A', 'wb' => 10, 'prc' => 15, 'tc' => 5, 'status' => 'STOK CUKUP']);

        $this->artisan('notif:stok-harian')
            ->expectsOutputToContain('Mengambil data stok darah terkini')
            ->expectsOutputToContain('Notifikasi harian stok darah berhasil dijalankan')
            ->assertExitCode(0);
    }
}
