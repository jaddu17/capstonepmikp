<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BeritaController;
use App\Http\Controllers\Api\DonasiController;
use App\Http\Controllers\Api\InfografisController;
use App\Http\Controllers\Api\JadwalDonorController;
use App\Http\Controllers\Api\PesanController;
use App\Http\Controllers\Api\StokDarahController;

// ==========================================
// RUTE PUBLIK (Bisa diakses siapa saja)
// ==========================================
Route::post('login', [AuthController::class, 'login']);

// Masyarakat hanya boleh melihat data (index & show)
Route::apiResource('beritas', BeritaController::class)->only(['index', 'show']);
Route::apiResource('jadwal-donors', JadwalDonorController::class)->only(['index', 'show']);
Route::apiResource('stok-darahs', StokDarahController::class)->only(['index', 'show']);
Route::apiResource('infografis', InfografisController::class)->only(['index', 'show']);

// Masyarakat hanya boleh mengirim data/form (store) dan mengupload bukti bayar (update)
Route::apiResource('donasis', DonasiController::class)->only(['store', 'update']);
Route::apiResource('pesans', PesanController::class)->only(['store']);


// ==========================================
// RUTE ADMIN (Wajib menggunakan Token Sanctum)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Admin bebas melakukan Tambah, Edit, Hapus (except index & show)
    Route::apiResource('beritas', BeritaController::class)->except(['index', 'show']);
    Route::apiResource('jadwal-donors', JadwalDonorController::class)->except(['index', 'show']);
    Route::apiResource('stok-darahs', StokDarahController::class)->except(['index', 'show']);
    Route::apiResource('infografis', InfografisController::class)->except(['index', 'show']);

    // Admin bisa melihat daftar donasi/pesan masuk dan hapus
    Route::apiResource('donasis', DonasiController::class)->only(['index', 'show', 'destroy']);
    Route::apiResource('pesans', PesanController::class)->except(['store']);
    
    Route::post('stok-darahs/bulk-update', [StokDarahController::class, 'bulkUpdate']);
});