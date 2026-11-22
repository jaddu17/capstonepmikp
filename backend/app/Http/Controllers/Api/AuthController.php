<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('name', $request->username)
            ->orWhere('email', $request->username)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Username atau password salah!'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        // Menghapus token yang sedang digunakan admin
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }

    public function updateCredentials(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'username' => 'required|string|min:3|max:50|unique:users,name,' . $user->id,
            'new_password' => 'nullable|string|min:8|confirmed',
        ], [
            'current_password.required' => 'Password saat ini wajib diisi untuk verifikasi keamanan.',
            'username.required' => 'Username tidak boleh kosong.',
            'username.min' => 'Username minimal 3 karakter.',
            'username.max' => 'Username maksimal 50 karakter.',
            'username.unique' => 'Username sudah digunakan oleh akun lain.',
            'new_password.min' => 'Password baru minimal 8 karakter.',
            'new_password.confirmed' => 'Konfirmasi password baru tidak cocok.',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Password saat ini yang Anda masukkan salah!',
                'errors' => [
                    'current_password' => ['Password saat ini yang Anda masukkan salah.']
                ]
            ], 422);
        }

        if ($request->filled('new_password')) {
            if (Hash::check($request->new_password, $user->password)) {
                return response()->json([
                    'message' => 'Password baru tidak boleh sama dengan password saat ini!',
                    'errors' => [
                        'new_password' => ['Password baru tidak boleh sama dengan password saat ini.']
                    ]
                ], 422);
            }
            $user->password = $request->new_password;
        }

        $user->name = $request->username;
        $user->save();

        return response()->json([
            'message' => 'Akun dan password berhasil diperbarui!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }
}