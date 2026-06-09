<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StokDarah extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'wb',
        'prc',
        'tc',
        'status',
    ];
}
