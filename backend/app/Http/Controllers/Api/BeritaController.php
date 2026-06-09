<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;

class BeritaController extends Controller
{
    public function index()
    {
        return Berita::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'nullable|string',
            'category' => 'nullable|string',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'image' => 'nullable|string',
            'published' => 'boolean',
        ]);

        $berita = Berita::create($validated);
        return response()->json($berita, 201);
    }

    public function show(Berita $berita)
    {
        return $berita;
    }

    public function update(Request $request, Berita $berita)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'date' => 'nullable|string',
            'category' => 'nullable|string',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'image' => 'nullable|string',
            'published' => 'boolean',
        ]);

        $berita->update($validated);
        return response()->json($berita);
    }

    public function destroy(Berita $berita)
    {
        $berita->delete();
        return response()->json(null, 204);
    }
}
