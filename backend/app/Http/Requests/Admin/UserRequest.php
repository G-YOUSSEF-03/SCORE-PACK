<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        $userId = $this->route('user')?->id;
        $passwordRules = $this->isMethod('post') ? ['required', 'string', 'min:8'] : ['nullable', 'string', 'min:8'];

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'phone' => ['nullable', 'string', 'max:50'],
            'role' => ['required', 'string', 'max:50'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'password' => $passwordRules,
        ];
    }
}
