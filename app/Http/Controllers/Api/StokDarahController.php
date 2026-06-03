<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StokDarah;
use Illuminate\Http\Request;

class StokDarahController extends Controller
{
    public function index()
    {
        return StokDarah::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'wb' => 'required|integer|min:0',
            'prc' => 'required|integer|min:0',
            'tc' => 'required|integer|min:0',
            'status' => 'nullable|string',
        ]);

        $stok = StokDarah::create($validated);
        return response()->json($stok, 201);
    }

    public function show(StokDarah $stokDarah)
    {
        return $stokDarah;
    }

    public function update(Request $request, StokDarah $stokDarah)
    {
        $validated = $request->validate([
            'type' => 'sometimes|string',
            'wb' => 'sometimes|integer|min:0',
            'prc' => 'sometimes|integer|min:0',
            'tc' => 'sometimes|integer|min:0',
            'status' => 'nullable|string',
        ]);

        $stokDarah->update($validated);
        return response()->json($stokDarah);
    }

    public function destroy(StokDarah $stokDarah)
    {
        $stokDarah->delete();
        return response()->json(null, 204);
    }

    // Bulk update all blood stocks at once
    public function bulkUpdate(Request $request)
    {
        $items = $request->validate([
            '*.id' => 'required|integer',
            '*.wb' => 'required|integer|min:0',
            '*.prc' => 'required|integer|min:0',
            '*.tc' => 'required|integer|min:0',
            '*.status' => 'nullable|string',
        ]);

        foreach ($request->all() as $item) {
            StokDarah::where('id', $item['id'])->update([
                'wb' => $item['wb'],
                'prc' => $item['prc'],
                'tc' => $item['tc'],
                'status' => $item['status'] ?? 'STOK CUKUP',
            ]);
        }

        return response()->json(StokDarah::all());
    }
}
