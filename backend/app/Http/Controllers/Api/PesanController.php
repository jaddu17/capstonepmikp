<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pesan;
use Illuminate\Http\Request;

class PesanController extends Controller
{
    public function index()
    {
        return Pesan::orderBy('created_at', 'desc')->paginate(10);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:25',
            'message' => 'required|string|max:5000',
            'date' => 'nullable|string|max:50',
            'read' => 'boolean',
            'replied' => 'boolean',
            'reply_text' => 'nullable|string',
        ]);

        // Masking / Sanitasi input untuk mencegah XSS & karakter berbahaya (SOP Poin 1)
        $validated['name'] = strip_tags($validated['name']);
        $validated['message'] = strip_tags($validated['message']);

        $pesan = Pesan::create($validated);
        return response()->json($pesan, 201);
    }

    public function show(Pesan $pesan)
    {
        return $pesan;
    }

    public function update(Request $request, Pesan $pesan)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|string',
            'phone' => 'nullable|string',
            'message' => 'sometimes|string',
            'date' => 'nullable|string',
            'read' => 'boolean',
            'replied' => 'boolean',
            'reply_text' => 'nullable|string',
        ]);

        $pesan->update($validated);
        return response()->json($pesan);
    }

    public function destroy(Pesan $pesan)
    {
        $pesan->delete();
        return response()->json(null, 204);
    }
}
