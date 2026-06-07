<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
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
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
