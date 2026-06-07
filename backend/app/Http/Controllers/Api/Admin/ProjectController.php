<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectRequest;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Project::latest()->paginate(15),
        ]);
    }

    public function store(ProjectRequest $request): JsonResponse
    {
        $data = $request->validated();
        unset($data['project_image']);

        $data['slug'] = $this->uniqueSlug($data['slug']);
        $data['status'] = $data['is_published'] ? 'published' : 'draft';

        if ($request->hasFile('project_image')) {
            $data['image'] = $request->file('project_image')->store('projects', 'public');
        }

        $project = Project::create($data);

        return response()->json([
            'message' => 'Projet cree avec succes.',
            'data' => $project,
        ], 201);
    }

    public function show(Project $project): JsonResponse
    {
        return response()->json([
            'data' => $project,
        ]);
    }

    public function update(ProjectRequest $request, Project $project): JsonResponse
    {
        $data = $request->validated();
        unset($data['project_image']);

        $data['slug'] = $this->uniqueSlug($data['slug'], $project->id);
        $data['status'] = $data['is_published'] ? 'published' : 'draft';

        if ($request->hasFile('project_image')) {
            $oldImage = $project->image;
            $data['image'] = $request->file('project_image')->store('projects', 'public');

            if ($oldImage) {
                Storage::disk('public')->delete($this->storagePath($oldImage));
            }
        }

        $project->update($data);

        return response()->json([
            'message' => 'Projet mis a jour.',
            'data' => $project,
        ]);
    }

    public function destroy(Project $project): JsonResponse
    {
        if ($project->image) {
            Storage::disk('public')->delete($this->storagePath($project->image));
        }

        $project->delete();

        return response()->json([
            'message' => 'Projet supprime.',
        ]);
    }

    private function uniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value) ?: 'project';
        $slug = $base;
        $count = 2;

        while (Project::where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = "{$base}-{$count}";
            $count++;
        }

        return $slug;
    }

    private function storagePath(string $image): string
    {
        $path = ltrim($image, '/');

        return Str::startsWith($path, 'storage/') ? Str::after($path, 'storage/') : $path;
    }
}
