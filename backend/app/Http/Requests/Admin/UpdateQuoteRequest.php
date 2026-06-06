<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateQuoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'client_name' => ['sometimes', 'required', 'string', 'max:255'],
            'phone' => ['sometimes', 'required', 'string', 'max:50'],
            'email' => ['sometimes', 'required', 'email', 'max:255'],
            'project_title' => ['sometimes', 'required', 'string', 'max:255'],
            'message' => ['nullable', 'string'],
            'status' => ['sometimes', 'required', Rule::in(['new', 'in_progress', 'pending', 'processed'])],
        ];
    }
}
