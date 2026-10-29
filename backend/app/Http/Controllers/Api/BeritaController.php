<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\Request;

class BeritaController extends Controller
{
    public function index(Request $request)
    {
        $query = Berita::orderBy('created_at', 'desc');

        // Jika bukan admin (tidak ada token sanctum), publik hanya boleh melihat berita yang dipublikasikan
        if (!$request->user('sanctum')) {
            $query->where('published', true);
        }

        return $query->paginate(10);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'nullable|string',
            'category' => 'nullable|string',
            'excerpt' => 'nullable|string',
            'content' => 'nullable|string',
            'image' => ['nullable', 'string', new \App\Rules\Base64ImageRule()],
            'published' => 'boolean',
        ]);

        if (isset($validated['image'])) {
            $validated['image'] = \App\Helpers\ImageStorageHelper::storeIfBase64($validated['image'], 'berita');
        }

        $berita = Berita::create($validated);

        if ($berita->published) {
            \App\Services\FonnteService::notifyNewBerita($berita);
            \App\Services\InstagramService::notifyNewBerita($berita);
        }

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
            'image' => ['nullable', 'string', new \App\Rules\Base64ImageRule()],
            'published' => 'boolean',
        ]);

        if (isset($validated['image'])) {
            $validated['image'] = \App\Helpers\ImageStorageHelper::storeIfBase64($validated['image'], 'berita');
        }

        $berita->update($validated);
        return response()->json($berita);
    }

    public function destroy(Berita $berita)
    {
        $berita->delete();
        return response()->json(null, 204);
    }
}
