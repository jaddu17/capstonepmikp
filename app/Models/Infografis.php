<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Infografis extends Model
{
    use HasFactory;

    protected $fillable = [
        'bulan',
        'tahun',
        'kontak',
        'stats',
        'dokumentasi',
        'pelayanan',
        'quote',
    ];

    protected $casts = [
        'kontak' => 'array',
        'stats' => 'array',
        'dokumentasi' => 'array',
        'pelayanan' => 'array',
    ];
}
