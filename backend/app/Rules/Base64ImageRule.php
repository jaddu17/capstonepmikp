<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Base64ImageRule implements ValidationRule
{
    protected bool $allowExistingStorage;
    protected int $maxKilobytes;

    public function __construct(bool $allowExistingStorage = false, int $maxKilobytes = 2048)
    {
        $this->allowExistingStorage = $allowExistingStorage;
        $this->maxKilobytes = $maxKilobytes;
    }

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

        // 1. Validasi data URL base64 asli
        if (preg_match('/^data:image\/(\w+);base64,/', $value, $type)) {
            $type = strtolower($type[1]);
            if (!in_array($type, ['jpg', 'jpeg', 'png'])) {
                $fail("Ekstensi gambar harus berupa jpg, jpeg, atau png.");
                return;
            }
            // Menghitung ukuran base64 dalam bytes
            $size_in_bytes = (int) (strlen(rtrim($value, '=')) * 3 / 4);
            $maxBytes = $this->maxKilobytes * 1024;
            
            if ($size_in_bytes > $maxBytes) {
                $mb = round($this->maxKilobytes / 1024, 1);
                $fail("Ukuran file maksimal adalah {$mb}MB.");
                return;
            }
            return;
        }

        // 2. Hanya jika diizinkan untuk update record lama oleh admin
        if ($this->allowExistingStorage) {
            if (
                filter_var($value, FILTER_VALIDATE_URL) ||
                str_starts_with($value, '/images/') ||
                str_starts_with($value, 'images/') ||
                str_starts_with($value, '/storage/') ||
                str_starts_with($value, 'storage/') ||
                str_starts_with($value, 'donasi/')
            ) {
                $extension = strtolower(pathinfo(parse_url($value, PHP_URL_PATH) ?? '', PATHINFO_EXTENSION));
                if (!empty($extension) && !in_array($extension, ['jpg', 'jpeg', 'png'])) {
                    $fail("Ekstensi gambar harus berupa jpg, jpeg, atau png.");
                    return;
                }
                return;
            }
        }

        // Jika form publik mencoba kirim path sembarangan atau URL luar
        $fail("Format file tidak valid. Harap unggah file gambar asli (jpg, jpeg, png).");
    }
}
