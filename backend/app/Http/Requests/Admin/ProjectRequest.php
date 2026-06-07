<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class ProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        $imageRule = $this->isMethod('post') ? 'required' : 'nullable';

        return [
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:120'],
            'location' => ['required', 'string', 'max:120'],
            'status' => ['required', 'in:published,draft'],
            'project_image' => [$imageRule, 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'short_description' => ['required', 'string', 'max:500'],
            'detailed_description' => ['required', 'string'],
            'client' => ['required', 'string', 'max:255'],
            'project_date' => ['required', 'date'],
            'estimated_budget' => ['required', 'string', 'max:120'],
            'duration' => ['required', 'string', 'max:120'],
            'slug' => ['required', 'string', 'max:255'],
            'meta_title' => ['required', 'string', 'max:255'],
            'meta_description' => ['required', 'string', 'max:500'],
            'is_published' => ['required', 'boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $isPublished = filter_var($this->input('is_published', false), FILTER_VALIDATE_BOOLEAN);
        $title = trim((string) $this->input('title', ''));
        $slug = trim((string) $this->input('slug', ''));

        $this->merge([
            'title' => $title,
            'category' => trim((string) $this->input('category', '')),
            'location' => trim((string) $this->input('location', '')),
            'status' => $isPublished ? 'published' : 'draft',
            'slug' => Str::slug($slug ?: $title),
            'is_published' => $isPublished,
            'short_description' => trim((string) $this->input('short_description', '')),
            'detailed_description' => trim((string) $this->input('detailed_description', '')),
            'client' => trim((string) $this->input('client', '')),
            'estimated_budget' => trim((string) $this->input('estimated_budget', '')),
            'duration' => trim((string) $this->input('duration', '')),
            'meta_title' => trim((string) $this->input('meta_title', '')),
            'meta_description' => trim((string) $this->input('meta_description', '')),
        ]);
    }
}
