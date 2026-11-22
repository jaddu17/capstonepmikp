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

    public function test_authenticated_user_can_update_username_only(): void
    {
        $user = User::create([
            'name' => 'oldadmin',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/user/credentials', [
            'current_password' => 'secret123',
            'username' => 'newadmin',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Akun dan password berhasil diperbarui!',
                'user' => [
                    'name' => 'newadmin',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'newadmin',
        ]);
    }

    public function test_authenticated_user_can_update_password(): void
    {
        $user = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/user/credentials', [
            'current_password' => 'secret123',
            'username' => 'adminpmi',
            'new_password' => 'newsecretpassword123',
            'new_password_confirmation' => 'newsecretpassword123',
        ]);

        $response->assertStatus(200);

        // Pastikan password lama tidak bisa login lagi
        $failLogin = $this->postJson('/api/login', [
            'username' => 'adminpmi',
            'password' => 'secret123',
        ]);
        $failLogin->assertStatus(401);

        // Pastikan password baru bisa digunakan untuk login
        $successLogin = $this->postJson('/api/login', [
            'username' => 'adminpmi',
            'password' => 'newsecretpassword123',
        ]);
        $successLogin->assertStatus(200);
    }

    public function test_cannot_update_credentials_with_wrong_current_password(): void
    {
        $user = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/user/credentials', [
            'current_password' => 'wrongcurrentpassword',
            'username' => 'adminbaru',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['current_password']);
    }

    public function test_cannot_update_password_if_confirmation_mismatches(): void
    {
        $user = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/user/credentials', [
            'current_password' => 'secret123',
            'username' => 'adminpmi',
            'new_password' => 'password12345',
            'new_password_confirmation' => 'passwordBeda12345',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['new_password']);
    }

    public function test_cannot_update_password_if_same_as_current(): void
    {
        $user = User::create([
            'name' => 'adminpmi',
            'email' => 'admin@pmi.org',
            'password' => 'secret123',
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/user/credentials', [
            'current_password' => 'secret123',
            'username' => 'adminpmi',
            'new_password' => 'secret123',
            'new_password_confirmation' => 'secret123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['new_password']);
    }

    public function test_can_login_using_email_or_username(): void
    {
        User::create([
            'name' => 'adminmarkas',
            'email' => 'markas@pmikp.id',
            'password' => 'secret123',
        ]);

        // Login dengan username
        $resUsername = $this->postJson('/api/login', [
            'username' => 'adminmarkas',
            'password' => 'secret123',
        ]);
        $resUsername->assertStatus(200);

        // Login dengan email
        $resEmail = $this->postJson('/api/login', [
            'username' => 'markas@pmikp.id',
            'password' => 'secret123',
        ]);
        $resEmail->assertStatus(200);
    }
}
