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

        if (isset($validated['dokumentasi']) && is_array($validated['dokumentasi'])) {
            $validated['dokumentasi'] = array_map(function ($doc) {
                return \App\Helpers\ImageStorageHelper::storeIfBase64($doc, 'infografis');
            }, $validated['dokumentasi']);
        }

        $infografis = Infografis::create($validated);

        \App\Services\FonnteService::notifyNewInfografis($infografis);
        \App\Services\InstagramService::notifyNewInfografis($infografis);

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

        if (isset($validated['dokumentasi']) && is_array($validated['dokumentasi'])) {
            $validated['dokumentasi'] = array_map(function ($doc) {
                return \App\Helpers\ImageStorageHelper::storeIfBase64($doc, 'infografis');
            }, $validated['dokumentasi']);
        }

        $infografi->update($validated);

        \App\Services\FonnteService::notifyNewInfografis($infografi);
        \App\Services\InstagramService::notifyNewInfografis($infografi);

        return response()->json($infografi);
    }

    public function destroy(Infografis $infografi)
    {
        $infografi->delete();
        return response()->json(null, 204);
    }
}
