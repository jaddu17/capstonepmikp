<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pesan;
use Illuminate\Http\Request;

class PesanController extends Controller
{
    public function index(Request $request)
    {
        $query = Pesan::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('message', 'like', "%{$search}%");
            });
        }

        if ($request->filled('filter')) {
            if ($request->filter === 'unread') {
                $query->where('read', false);
            } elseif ($request->filter === 'read') {
                $query->where('read', true);
            }
        }

        $paginated = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'data' => $paginated->items(),
            'current_page' => $paginated->currentPage(),
            'last_page' => $paginated->lastPage(),
            'per_page' => $paginated->perPage(),
            'total' => $paginated->total(),
            'unread_count' => Pesan::where('read', false)->count(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:25',
            'type' => 'nullable|string|max:50',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:5000',
            'date' => 'nullable|string|max:50',
            'read' => 'boolean',
            'replied' => 'boolean',
            'reply_text' => 'nullable|string',
        ]);

        if (empty($validated['subject'])) {
            $validated['subject'] = 'Pertanyaan / Pesan Masyarakat';
        }
        if (empty($validated['type'])) {
            $validated['type'] = 'umum';
        }

        // Masking / Sanitasi input untuk mencegah XSS & karakter berbahaya (SOP Poin 1)
        $validated['name'] = strip_tags($validated['name']);
        $validated['message'] = strip_tags($validated['message']);
        $validated['subject'] = strip_tags($validated['subject']);

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
