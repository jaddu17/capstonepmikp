<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donasi;
use Illuminate\Http\Request;

class DonasiController extends Controller
{
    public function index()
    {
        return Donasi::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'nullable|string|max:255',
            'wa' => 'nullable|string|max:20',
            'keterangan' => 'nullable|string',
            'proof' => 'nullable|string',
            'date' => 'required|string',
            'status' => 'nullable|string',
        ]);

        if (!isset($validated['status'])) {
            $validated['status'] = 'Sudah Bayar';
        }

        $donasi = Donasi::create($validated);
        return response()->json($donasi, 201);
    }

    public function show(Donasi $donasi)
    {
        return $donasi;
    }

    public function update(Request $request, Donasi $donasi)
    {
        $validated = $request->validate([
            'nama' => 'sometimes|nullable|string|max:255',
            'wa' => 'sometimes|nullable|string|max:20',
            'keterangan' => 'nullable|string',
            'proof' => 'nullable|string',
            'date' => 'sometimes|required|string',
            'status' => 'sometimes|required|string',
        ]);

        $donasi->update($validated);
        return response()->json($donasi);
    }

    public function destroy(Donasi $donasi)
    {
        $donasi->delete();
        return response()->json(null, 204);
    }
}