<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuoteRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'phone',
        'email',
        'project_type',
        'budget',
        'project_title',
        'message',
        'status',
        'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];
}
