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
            'dokumentasi' => 'nullable|array|max:6',
            'dokumentasi.*' => ['nullable', 'string', new \App\Rules\Base64ImageRule(allowExistingStorage: false, maxKilobytes: 768)],
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
            'dokumentasi' => 'nullable|array|max:6',
            'dokumentasi.*' => ['nullable', 'string', new \App\Rules\Base64ImageRule(allowExistingStorage: true, maxKilobytes: 768)],
            'pelayanan' => 'nullable|array',
            'quote' => 'nullable|string',
        ]);

        if (isset($validated['dokumentasi']) && is_array($validated['dokumentasi'])) {
            $oldDocs = is_array($infografi->dokumentasi) ? $infografi->dokumentasi : [];

            $newDocs = array_map(function ($doc) {
                return \App\Helpers\ImageStorageHelper::storeIfBase64($doc, 'infografis');
            }, $validated['dokumentasi']);

            // Hapus file lama yang diganti atau dihapus dari array dokumentasi
            foreach ($oldDocs as $oldDoc) {
                if (!empty($oldDoc) && !in_array($oldDoc, $newDocs)) {
                    \App\Helpers\ImageStorageHelper::deleteFile($oldDoc, 'public');
                }
            }

            $validated['dokumentasi'] = $newDocs;
        }

        $infografi->update($validated);

        // Catatan: Notifikasi WhatsApp hanya dikirim saat Infografis pertama kali dibuat di store(),
        // agar proses edit typo / revisi angka tidak membanjiri grup WhatsApp.

        return response()->json($infografi);
    }

    public function destroy(Infografis $infografi)
    {
        if (is_array($infografi->dokumentasi)) {
            foreach ($infografi->dokumentasi as $doc) {
                \App\Helpers\ImageStorageHelper::deleteFile($doc, 'public');
            }
        }

        $infografi->delete();
        return response()->json(null, 204);
    }
}
