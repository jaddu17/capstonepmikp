<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pesan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'message',
        'date',
        'read',
        'replied',
        'reply_text',
    ];

    protected $casts = [
        'read' => 'boolean',
        'replied' => 'boolean',
    ];
}
