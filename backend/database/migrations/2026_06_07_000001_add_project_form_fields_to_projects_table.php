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
            return;
        }

        Schema::table('projects', function (Blueprint $table) {
            if (! Schema::hasColumn('projects', 'short_description')) {
                $table->text('short_description')->nullable()->after('image');
            }

            if (! Schema::hasColumn('projects', 'detailed_description')) {
                $table->text('detailed_description')->nullable()->after('short_description');
            }

            if (! Schema::hasColumn('projects', 'client')) {
                $table->string('client')->nullable()->after('detailed_description');
            }

            if (! Schema::hasColumn('projects', 'project_date')) {
                $table->date('project_date')->nullable()->after('client');
            }

            if (! Schema::hasColumn('projects', 'estimated_budget')) {
                $table->string('estimated_budget')->nullable()->after('project_date');
            }

            if (! Schema::hasColumn('projects', 'duration')) {
                $table->string('duration')->nullable()->after('estimated_budget');
            }

            if (! Schema::hasColumn('projects', 'slug')) {
                $table->string('slug')->nullable()->after('duration');
            }

            if (! Schema::hasColumn('projects', 'meta_title')) {
                $table->string('meta_title')->nullable()->after('slug');
            }

            if (! Schema::hasColumn('projects', 'meta_description')) {
                $table->text('meta_description')->nullable()->after('meta_title');
            }

            if (! Schema::hasColumn('projects', 'is_published')) {
                $table->boolean('is_published')->default(false)->index()->after('meta_description');
            }
        });

        DB::table('projects')->orderBy('id')->get()->each(function (object $project): void {
            $updates = [];

            if (property_exists($project, 'description')) {
                $updates['short_description'] = $project->short_description ?: Str::limit((string) $project->description, 180, '');
                $updates['detailed_description'] = $project->detailed_description ?: (string) $project->description;
            }

            $updates['is_published'] = ($project->status ?? 'draft') === 'published';
            $updates['slug'] = $this->uniqueSlug((string) ($project->slug ?: $project->title), (int) $project->id);

            DB::table('projects')->where('id', $project->id)->update($updates);
        });
    }

    private function uniqueSlug(string $value, int $projectId): string
    {
        $base = Str::slug($value) ?: 'project';
        $slug = $base;
        $count = 2;

        while (DB::table('projects')->where('slug', $slug)->where('id', '!=', $projectId)->exists()) {
            $slug = "{$base}-{$count}";
            $count++;
        }

        return $slug;
    }
};
