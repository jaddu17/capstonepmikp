<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Base64ImageRule implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (empty($value)) {
            return;
        }

        // 1. Jika data URL base64: periksa ekstensi dan ukuran maksimal 2MB
        if (preg_match('/^data:image\/(\w+);base64,/', $value, $type)) {
            $type = strtolower($type[1]);
            if (!in_array($type, ['jpg', 'jpeg', 'png'])) {
                $fail("Ekstensi gambar harus berupa jpg, jpeg, atau png.");
                return;
            }
            // Menghitung ukuran base64 dalam bytes
            $size_in_bytes = (int) (strlen(rtrim($value, '=')) * 3 / 4);
            
            // Maksimal 2MB (2 * 1024 * 1024 bytes = 2097152 bytes)
            if ($size_in_bytes > 2097152) {
                $fail("Ukuran file maksimal adalah 2MB.");
                return;
            }
            return;
        }

        // 2. Jika path file storage internal / lokal (misal: /storage/..., storage/..., /images/...)
        if (str_starts_with($value, '/storage/') || str_starts_with($value, 'storage/') || str_starts_with($value, '/images/') || str_starts_with($value, 'images/')) {
            $extension = strtolower(pathinfo(parse_url($value, PHP_URL_PATH), PATHINFO_EXTENSION));
            if (!empty($extension) && !in_array($extension, ['jpg', 'jpeg', 'png', 'svg', 'webp'])) {
                $fail("Ekstensi gambar harus berupa jpg, jpeg, atau png.");
            }
            return;
        }

        // 3. Jika URL eksternal valid (http:// atau https://)
        if (filter_var($value, FILTER_VALIDATE_URL)) {
            return;
        }

        $fail("Format file tidak valid.");
    }
}
