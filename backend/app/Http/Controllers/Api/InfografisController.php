<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Infografis;
use Illuminate\Http\Request;

class InfografisController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Infografis::orderBy('created_at', 'desc')->paginate(10);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'bulan' => 'required|string',
            'tahun' => 'required|string',
            'kontak' => 'nullable|array',
            'stats' => 'nullable|array',
            'dokumentasi' => 'nullable|array|max:8',
            'dokumentasi.*' => ['nullable', 'string', new \App\Rules\Base64ImageRule()],
            'pelayanan' => 'nullable|array',
            'quote' => 'nullable|string',
        ]);

        $infografis = Infografis::create($validated);
        return response()->json($infografis, 201);
    }

    public function show(Infografis $infografi)
    {
        return $infografi;
    }

    public function update(Request $request, Infografis $infografi)
    {
        $validated = $request->validate([
            'bulan' => 'sometimes|string',
            'tahun' => 'sometimes|string',
            'kontak' => 'nullable|array',
            'stats' => 'nullable|array',
            'dokumentasi' => 'nullable|array',
            'dokumentasi.*' => ['nullable', 'string', new \App\Rules\Base64ImageRule()],
            'pelayanan' => 'nullable|array',
            'quote' => 'nullable|string',
        ]);

        $infografi->update($validated);
        return response()->json($infografi);
    }

    public function destroy(Infografis $infografi)
    {
        $infografi->delete();
        return response()->json(null, 204);
    }
}
