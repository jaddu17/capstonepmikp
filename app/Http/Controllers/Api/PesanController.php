<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pesan;
use Illuminate\Http\Request;

class PesanController extends Controller
{
    public function index()
    {
        return Pesan::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string',
            'phone' => 'nullable|string',
            'type' => 'nullable|string',
            'subject' => 'required|string',
            'message' => 'required|string',
            'date' => 'nullable|string',
            'read' => 'boolean',
            'replied' => 'boolean',
            'reply_text' => 'nullable|string',
        ]);

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
            'type' => 'nullable|string',
            'subject' => 'sometimes|string',
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
