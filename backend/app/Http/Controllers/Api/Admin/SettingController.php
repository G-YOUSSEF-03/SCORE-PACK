<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json([
            'data' => $this->settings(),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'secondary_phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:120'],
            'country' => ['nullable', 'string', 'max:120'],
            'working_hours' => ['nullable', 'string'],
            'facebook_url' => ['nullable', 'url', 'max:255'],
            'instagram_url' => ['nullable', 'url', 'max:255'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'youtube_url' => ['nullable', 'url', 'max:255'],
            'logo' => ['nullable', 'image', 'max:4096'],
            'favicon' => ['nullable', 'image', 'max:1024'],
        ]);

        $settings = $this->settings();

        foreach (['logo', 'favicon'] as $fileField) {
            if ($request->hasFile($fileField)) {
                if ($settings->{$fileField}) {
                    Storage::disk('public')->delete($settings->{$fileField});
                }

                $data[$fileField] = $request->file($fileField)->store('settings', 'public');
            } else {
                unset($data[$fileField]);
            }
        }

        $settings->update($data);

        return response()->json([
            'message' => 'Parametres mis a jour.',
            'data' => $settings->fresh(),
        ]);
    }

    private function settings(): Setting
    {
        return Setting::firstOrCreate(
            ['id' => 1],
            [
                'company_name' => 'SCORE PACK',
                'tagline' => 'Bureau d’études des projets d’investissement',
            ],
        );
    }
}
