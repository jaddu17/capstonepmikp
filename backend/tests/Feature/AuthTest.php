<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_login_with_correct_credentials(): void
    {
        $user = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        $response = $this->postJson('/api/login', [
            'username' => 'adminpmi',
            'password' => 'secret123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'access_token',
                'token_type',
                'user' => ['id', 'name', 'email'],
            ]);
    }

    public function test_user_cannot_login_with_incorrect_password(): void
    {
        User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        $response = $this->postJson('/api/login', [
            'username' => 'adminpmi',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Username atau password salah!',
            ]);
    }

    public function test_login_rate_limiting_mitigates_brute_force(): void
    {
        User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        // Coba 5 kali percobaan gagal (batas throttle: 5 per menit)
        for ($i = 0; $i < 5; $i++) {
            $response = $this->postJson('/api/login', [
                'username' => 'adminpmi',
                'password' => 'wrongpassword',
            ]);
            $response->assertStatus(401);
        }

        // Percobaan ke-6 harus diblokir oleh throttle (HTTP 429 Too Many Requests)
        $response = $this->postJson('/api/login', [
            'username' => 'adminpmi',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(429);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Logout berhasil',
            ]);
    }
}
