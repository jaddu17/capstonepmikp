<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageStorageHelper
{
    /**
     * Simpan gambar Base64 ke public storage disk dan kembalikan URL path relatifnya.
     * Jika input sudah berupa URL atau null, kembalikan nilai aslinya.
     *
     * @param string|null $imageData
     * @param string $folder
     * @return string|null
     */
    public static function storeIfBase64(?string $imageData, string $folder = 'uploads'): ?string
    {
        if (empty($imageData)) {
            return null;
        }

        // Jika bukan format data:image (sudah berupa URL atau path biasa)
        if (!preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
            return $imageData;
        }

        $extension = strtolower($type[1]);
        if ($extension === 'jpeg') {
            $extension = 'jpg';
        }

        // Bersihkan prefix data:image/...;base64,
        $cleanBase64 = substr($imageData, strpos($imageData, ',') + 1);
        $decoded = base64_decode($cleanBase64);

        if ($decoded === false) {
            return $imageData;
        }

        $filename = $folder . '/' . Str::random(20) . '_' . time() . '.' . $extension;
        Storage::disk('public')->put($filename, $decoded);

        // Kembalikan URL publik /storage/folder/file.ext
        return '/storage/' . $filename;
    }

    /**
     * Simpan file sensitif (misal: bukti transfer donasi) ke private storage disk (local),
     * sehingga TIDAK BISA diakses langsung via URL publik browser (SOP Poin 1).
     *
     * @param string|null $imageData
     * @param string $folder
     * @return string|null
     */
    public static function storePrivate(?string $imageData, string $folder = 'donasi'): ?string
    {
        if (empty($imageData)) {
            return null;
        }

        if (!preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
            return $imageData;
        }

        $extension = strtolower($type[1]);
        if ($extension === 'jpeg') {
            $extension = 'jpg';
        }

        $cleanBase64 = substr($imageData, strpos($imageData, ',') + 1);
        $decoded = base64_decode($cleanBase64);

        if ($decoded === false) {
            return $imageData;
        }

        $filename = $folder . '/' . Str::random(30) . '_' . time() . '.' . $extension;
        Storage::disk('local')->put($filename, $decoded);

        return $filename;
    }

    /**
     * Hapus file lama jika ada pergantian gambar atau penghapusan data.
     */
    public static function deleteFile(?string $path, string $disk = 'public'): void
    {
        if (empty($path)) {
            return;
        }

        $cleanPath = str_replace('/storage/', '', $path);
        if (Storage::disk($disk)->exists($cleanPath)) {
            Storage::disk($disk)->delete($cleanPath);
        }
    }
}
