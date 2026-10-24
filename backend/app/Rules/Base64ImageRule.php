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
        if (preg_match('/^data:image\/(\w+);base64,/', $value, $type)) {
            $type = strtolower($type[1]);
            if (!in_array($type, ['jpg', 'jpeg', 'png'])) {
                $fail("Ekstensi gambar harus berupa jpg, jpeg, atau png.");
            }
            // Menghitung ukuran base64 dalam bytes
            $size_in_bytes = (int) (strlen(rtrim($value, '=')) * 3 / 4);
            
            // Maksimal 2MB (2 * 1024 * 1024 bytes = 2097152 bytes)
            if ($size_in_bytes > 2097152) {
                $fail("Ukuran file maksimal adalah 2MB.");
            }
        } elseif (!filter_var($value, FILTER_VALIDATE_URL) && $value !== '') {
            $fail("Format file tidak valid.");
        }
    }
}
