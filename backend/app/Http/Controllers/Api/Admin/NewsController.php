<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\NewsRequest;
use App\Models\News;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => News::latest()->paginate(15),
        ]);
    }

    public function store(NewsRequest $request): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('news', 'public');
        }

        $news = News::create($data);

        return response()->json([
            'message' => 'Actualite creee.',
            'data' => $news,
        ], 201);
    }

    public function show(News $news): JsonResponse
    {
        return response()->json(['data' => $news]);
    }

    public function update(NewsRequest $request, News $news): JsonResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($news->image) {
                Storage::disk('public')->delete($news->image);
            }

            $data['image'] = $request->file('image')->store('news', 'public');
        } else {
            unset($data['image']);
        }

        $news->update($data);

        return response()->json([
            'message' => 'Actualite mise a jour.',
            'data' => $news,
        ]);
    }

    public function destroy(News $news): JsonResponse
    {
        if ($news->image) {
            Storage::disk('public')->delete($news->image);
        }

        $news->delete();

        return response()->json(['message' => 'Actualite supprimee.']);
    }
}
