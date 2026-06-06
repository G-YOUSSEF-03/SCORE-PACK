<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:120'],
            'location' => ['required', 'string', 'max:120'],
            'description' => ['required', 'string'],
            'image' => ['nullable', 'image', 'max:4096'],
            'status' => ['required', Rule::in(['published', 'draft'])],
        ];
    }
}
