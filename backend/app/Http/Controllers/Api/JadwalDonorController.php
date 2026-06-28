<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JadwalDonor;
use Illuminate\Http\Request;

class JadwalDonorController extends Controller
{
    public function index()
    {
        return JadwalDonor::orderBy('created_at', 'asc')->get();
    }

    public function store(Request $request)
    {
        $messages = [
            'date.required' => 'Kolom tanggal wajib diisi.',
            'date.string' => 'Kolom tanggal harus berupa teks.',
            'day.required' => 'Kolom hari wajib diisi.',
            'day.string' => 'Kolom hari harus berupa teks.',
            'location.required' => 'Kolom lokasi wajib diisi.',
            'location.string' => 'Kolom lokasi harus berupa teks.',
            'time.required' => 'Kolom waktu wajib diisi.',
            'time.string' => 'Kolom waktu harus berupa teks.',
            'quota.string' => 'Kolom kuota harus berupa teks.',
        ];

        $validated = $request->validate([
            'date' => 'required|string',
            'day' => 'required|string',
            'location' => 'required|string',
            'time' => 'required|string',
            'quota' => 'nullable|string',
        ], $messages);

        $jadwal = JadwalDonor::create($validated);
        return response()->json($jadwal, 201);
    }

    public function show(JadwalDonor $jadwalDonor)
    {
        return $jadwalDonor;
    }

    public function update(Request $request, JadwalDonor $jadwalDonor)
    {
        $messages = [
            'date.string' => 'Kolom tanggal harus berupa teks.',
            'day.string' => 'Kolom hari harus berupa teks.',
            'location.string' => 'Kolom lokasi harus diisi.',
            'time.string' => 'Kolom waktu harus berupa teks.',
            'quota.string' => 'Kolom kuota harus berupa teks.',
        ];

        $validated = $request->validate([
            'date' => 'sometimes|string',
            'day' => 'sometimes|string',
            'location' => 'sometimes|string',
            'time' => 'sometimes|string',
            'quota' => 'nullable|string',
        ], $messages);

        $jadwalDonor->update($validated);
        return response()->json($jadwalDonor);
    }

    public function destroy(JadwalDonor $jadwalDonor)
    {
        $jadwalDonor->delete();
        return response()->json(null, 204);
    }
}
