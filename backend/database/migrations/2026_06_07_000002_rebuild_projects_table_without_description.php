<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('projects')) {
            Schema::create('projects', function (Blueprint $table) {
                $this->columns($table);
            });

            return;
        }

        Schema::create('projects_new', function (Blueprint $table) {
            $this->columns($table);
        });

        $existingProjects = DB::table('projects')->orderBy('id')->get();

        foreach ($existingProjects as $project) {
            $description = property_exists($project, 'description') ? (string) $project->description : '';
            $shortDescription = property_exists($project, 'short_description') ? (string) $project->short_description : '';
            $detailedDescription = property_exists($project, 'detailed_description') ? (string) $project->detailed_description : '';
            $status = (string) ($project->status ?? 'draft');
            $isPublished = property_exists($project, 'is_published') ? (bool) $project->is_published : $status === 'published';

            DB::table('projects_new')->insert([
                'id' => $project->id,
                'title' => $project->title,
                'category' => $project->category,
                'location' => $project->location,
                'status' => $isPublished ? 'published' : 'draft',
                'image' => $project->image ?? null,
                'short_description' => $shortDescription ?: Str::limit($description, 180, ''),
                'detailed_description' => $detailedDescription ?: $description,
                'client' => $project->client ?? null,
                'project_date' => $project->project_date ?? null,
                'estimated_budget' => $project->estimated_budget ?? null,
                'duration' => $project->duration ?? null,
                'slug' => $this->uniqueSlug((string) ($project->slug ?? $project->title), (int) $project->id),
                'meta_title' => $project->meta_title ?? null,
                'meta_description' => $project->meta_description ?? null,
                'is_published' => $isPublished,
                'created_at' => $project->created_at ?? now(),
                'updated_at' => $project->updated_at ?? now(),
            ]);
        }

        Schema::drop('projects');
        Schema::rename('projects_new', 'projects');
    }

    private function columns(Blueprint $table): void
    {
        $table->id();
        $table->string('title');
        $table->string('category')->index();
        $table->string('location');
        $table->string('status')->default('draft')->index();
        $table->string('image')->nullable();
        $table->text('short_description');
        $table->text('detailed_description');
        $table->string('client')->nullable();
        $table->date('project_date')->nullable();
        $table->string('estimated_budget')->nullable();
        $table->string('duration')->nullable();
        $table->string('slug')->unique();
        $table->string('meta_title')->nullable();
        $table->text('meta_description')->nullable();
        $table->boolean('is_published')->default(false)->index();
        $table->timestamps();
    }

    private function uniqueSlug(string $value, int $projectId): string
    {
        $base = Str::slug($value) ?: 'project';
        $slug = $base;
        $count = 2;

        while (DB::table('projects_new')->where('slug', $slug)->where('id', '!=', $projectId)->exists()) {
            $slug = "{$base}-{$count}";
            $count++;
        }

        return $slug;
    }
};
