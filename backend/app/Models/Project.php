<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'location',
        'status',
        'image',
        'short_description',
        'detailed_description',
        'client',
        'project_date',
        'estimated_budget',
        'duration',
        'slug',
        'meta_title',
        'meta_description',
        'is_published',
    ];

    protected $appends = [
        'image_url',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'project_date' => 'date',
            'is_published' => 'boolean',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image) {
            return null;
        }

        if (Str::startsWith($this->image, ['http://', 'https://'])) {
            return $this->image;
        }

        $path = ltrim($this->image, '/');
        $publicPath = Str::startsWith($path, 'storage/') ? $path : "storage/{$path}";
        $baseUrl = request()?->getSchemeAndHttpHost() ?: config('app.url');

        return rtrim($baseUrl, '/').'/'.$publicPath;
    }

    public function getDescriptionAttribute(): string
    {
        return (string) ($this->short_description ?: $this->detailed_description);
    }
}
