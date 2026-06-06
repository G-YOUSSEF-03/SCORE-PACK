<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Setting extends Model
{
    protected $fillable = [
        'company_name',
        'tagline',
        'email',
        'phone',
        'secondary_phone',
        'address',
        'city',
        'country',
        'working_hours',
        'facebook_url',
        'instagram_url',
        'linkedin_url',
        'youtube_url',
        'logo',
        'favicon',
    ];

    protected $appends = [
        'logo_url',
        'favicon_url',
    ];

    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo ? Storage::disk('public')->url($this->logo) : null;
    }

    public function getFaviconUrlAttribute(): ?string
    {
        return $this->favicon ? Storage::disk('public')->url($this->favicon) : null;
    }
}
