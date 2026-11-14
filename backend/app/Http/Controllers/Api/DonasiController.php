<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DonasiController extends Controller
{
    public function index()
    {
        return Donasi::orderBy('created_at', 'desc')->paginate(10);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'nullable|string|max:255',
            'wa' => 'nullable|string|max:20',
            'keterangan' => 'nullable|string|max:1000',
            // Publik WAJIB upload data base64 asli, dilarang inject path storage langsung (SOP Poin 1 & 6)
            'proof' => ['nullable', 'string', new \App\Rules\Base64ImageRule(allowExistingStorage: false, maxKilobytes: 2048)],
            'date' => 'required|string',
            'status' => 'nullable|string',
        ]);

        if (isset($validated['proof'])) {
            // Simpan bukti transfer ke PRIVATE STORAGE (local disk), tidak terekspos di URL publik (SOP Poin 1)
            $validated['proof'] = \App\Helpers\ImageStorageHelper::storePrivate($validated['proof'], 'donasi');
        }

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

    /**
     * Tampilkan file bukti transfer HANYA untuk Admin terotentikasi (SOP Poin 1).
     */
    public function showProof(Donasi $donasi)
    {
        if (empty($donasi->proof)) {
            abort(404, 'Bukti transfer tidak tersedia.');
        }

        // Cek di private storage (local disk)
        if (Storage::disk('local')->exists($donasi->proof)) {
            return Storage::disk('local')->response($donasi->proof);
        }

        // Backward compatibility jika file lama masih di public storage
        $cleanPath = str_replace('/storage/', '', $donasi->proof);
        if (Storage::disk('public')->exists($cleanPath)) {
            return Storage::disk('public')->response($cleanPath);
        }

        abort(404, 'File bukti transfer tidak ditemukan di server.');
    }

    public function update(Request $request, Donasi $donasi)
    {
        $validated = $request->validate([
            'nama' => 'sometimes|nullable|string|max:255',
            'wa' => 'sometimes|nullable|string|max:20',
            'keterangan' => 'nullable|string|max:1000',
            'proof' => ['nullable', 'string', new \App\Rules\Base64ImageRule(allowExistingStorage: true, maxKilobytes: 2048)],
            'date' => 'sometimes|required|string',
            'status' => 'sometimes|required|string',
        ]);

        if (isset($validated['proof'])) {
            // Jika admin mengganti bukti dengan base64 baru
            if (str_starts_with($validated['proof'], 'data:image')) {
                // Hapus file lama jika ada
                if (!empty($donasi->proof) && Storage::disk('local')->exists($donasi->proof)) {
                    Storage::disk('local')->delete($donasi->proof);
                }
                $validated['proof'] = \App\Helpers\ImageStorageHelper::storePrivate($validated['proof'], 'donasi');
            }
        }

        $donasi->update($validated);
        return response()->json($donasi);
    }

    public function destroy(Donasi $donasi)
    {
        // Hapus file bukti transfer saat record dihapus (Clean storage)
        if (!empty($donasi->proof) && Storage::disk('local')->exists($donasi->proof)) {
            Storage::disk('local')->delete($donasi->proof);
        }

        $donasi->delete();
        return response()->json(null, 204);
    }
}
