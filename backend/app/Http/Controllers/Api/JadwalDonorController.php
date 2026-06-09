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
        $validated = $request->validate([
            'date' => 'required|string',
            'day' => 'required|string',
            'location' => 'required|string',
            'time' => 'required|string',
            'quota' => 'nullable|string',
        ]);

        $jadwal = JadwalDonor::create($validated);
        return response()->json($jadwal, 201);
    }

    public function show(JadwalDonor $jadwalDonor)
    {
        return $jadwalDonor;
    }

    public function update(Request $request, JadwalDonor $jadwalDonor)
    {
        $validated = $request->validate([
            'date' => 'sometimes|string',
            'day' => 'sometimes|string',
            'location' => 'sometimes|string',
            'time' => 'sometimes|string',
            'quota' => 'nullable|string',
        ]);

        $jadwalDonor->update($validated);
        return response()->json($jadwalDonor);
    }

    public function destroy(JadwalDonor $jadwalDonor)
    {
        $jadwalDonor->delete();
        return response()->json(null, 204);
    }
}
