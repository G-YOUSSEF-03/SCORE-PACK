<?php

namespace App\Http\Requests\PublicApi;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'regex:/^\+?[0-9\s().-]{7,20}$/'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'full_name' => $this->clean('full_name'),
            'phone' => $this->clean('phone'),
            'email' => mb_strtolower($this->clean('email')),
            'subject' => $this->clean('subject'),
            'message' => $this->clean('message'),
        ]);
    }

    private function clean(string $key): string
    {
        return trim(strip_tags((string) $this->input($key, '')));
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'Le nom complet est obligatoire.',
            'phone.required' => 'Le numero de telephone est obligatoire.',
            'phone.regex' => 'Le numero de telephone est invalide.',
            'email.required' => 'L email est obligatoire.',
            'email.email' => 'L email est invalide.',
            'subject.required' => 'Le sujet est obligatoire.',
            'message.required' => 'Le message est obligatoire.',
        ];
    }
}
