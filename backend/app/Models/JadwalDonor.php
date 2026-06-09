<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JadwalDonor extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'day',
        'location',
        'time',
        'quota',
    ];
}
