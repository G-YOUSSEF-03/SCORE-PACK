<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReplyContactMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'reply' => ['required', 'string'],
            'status' => ['nullable', Rule::in(['new', 'read', 'replied', 'pending'])],
        ];
    }
}
