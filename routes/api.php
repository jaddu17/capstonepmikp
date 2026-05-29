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

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('login', [AuthController::class, 'login']);

Route::apiResource('beritas', BeritaController::class);
Route::apiResource('donasis', DonasiController::class);
Route::apiResource('infografis', InfografisController::class);
Route::apiResource('jadwal-donors', JadwalDonorController::class);
Route::apiResource('pesans', PesanController::class);
Route::apiResource('stok-darahs', StokDarahController::class);
Route::post('stok-darahs/bulk-update', [StokDarahController::class, 'bulkUpdate']);
