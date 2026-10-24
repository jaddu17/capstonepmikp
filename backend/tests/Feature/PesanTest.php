<?php

namespace Tests\Feature;

use App\Models\Pesan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PesanTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_submit_contact_message(): void
    {
        $payload = [
            'name' => 'Ahmad Fauzi',
            'email' => 'ahmad@gmail.com',
            'phone' => '085712345678',
            'type' => 'Pertanyaan',
            'subject' => 'Info Pelayanan Ambulans',
            'message' => 'Apakah layanan ambulans PMI KP buka 24 jam?',
            'date' => '24 Oktober 2026',
        ];

        $response = $this->postJson('/api/pesans', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'name' => 'Ahmad Fauzi',
                'subject' => 'Info Pelayanan Ambulans',
            ]);

        $this->assertDatabaseHas('pesans', [
            'email' => 'ahmad@gmail.com',
        ]);
    }

    public function test_message_validation_requires_mandatory_fields(): void
    {
        // Name, email, subject, message wajib diisi
        $response = $this->postJson('/api/pesans', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'subject', 'message']);
    }

    public function test_admin_can_read_and_reply_message(): void
    {
        $admin = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($admin);

        $pesan = Pesan::create([
            'name' => 'Rina',
            'email' => 'rina@gmail.com',
            'subject' => 'Donor darah',
            'message' => 'Kapan ada donor di Sentolo?',
            'read' => false,
            'replied' => false,
        ]);

        $response = $this->putJson("/api/pesans/{$pesan->id}", [
            'read' => true,
            'replied' => true,
            'reply_text' => 'Halo Rina, jadwal donor di Sentolo tanggal 28 Oktober 2026.',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'read' => true,
                'replied' => true,
            ]);

        $this->assertDatabaseHas('pesans', [
            'id' => $pesan->id,
            'read' => true,
            'replied' => true,
        ]);
    }

    public function test_admin_can_delete_message(): void
    {
        $admin = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($admin);

        $pesan = Pesan::create([
            'name' => 'Spam',
            'email' => 'spam@test.com',
            'subject' => 'Spam message',
            'message' => 'Promo...',
        ]);

        $response = $this->deleteJson("/api/pesans/{$pesan->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('pesans', [
            'id' => $pesan->id,
        ]);
    }

    public function test_guest_cannot_manage_messages(): void
    {
        $pesan = Pesan::create([
            'name' => 'Pengguna',
            'email' => 'user@gmail.com',
            'subject' => 'Pesan Masuk',
            'message' => 'Halo',
        ]);

        $responseGet = $this->getJson('/api/pesans');
        $responseGet->assertStatus(401);

        $responseDelete = $this->deleteJson("/api/pesans/{$pesan->id}");
        $responseDelete->assertStatus(401);
    }
}
