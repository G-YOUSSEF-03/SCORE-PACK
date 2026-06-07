<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use App\Models\Project;
use App\Models\Service;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class PublicController extends Controller
{
    public function services(): JsonResponse
    {
        return response()->json([
            'data' => Service::active()->orderBy('order')->get(),
        ]);
    }

    public function serviceDetails(string $slug): JsonResponse
    {
        $service = Service::active()->where('slug', $slug)->firstOrFail();

        return response()->json([
            'data' => $service,
        ]);
    }

    public function projects(): JsonResponse
    {
        return response()->json([
            'data' => Project::published()->latest()->paginate(12),
        ]);
    }

    public function news(): JsonResponse
    {
        return response()->json([
            'data' => News::published()->latest('published_at')->paginate(12),
        ]);
    }

    public function newsDetails(string $slug): JsonResponse
    {
        $news = News::published()->where('slug', $slug)->firstOrFail();

        return response()->json([
            'data' => $news,
        ]);
    }

    public function settings(): JsonResponse
    {
        return response()->json([
            'data' => Setting::first(),
        ]);
    }

}
