<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('title');
            $table->text('short_description')->nullable()->after('description');
            $table->longText('full_description')->nullable()->after('short_description');
            $table->string('image')->nullable()->after('full_description');
            $table->json('advantages')->nullable()->after('image');
            $table->json('process_steps')->nullable()->after('advantages');
            $table->json('deliverables')->nullable()->after('process_steps');
            $table->string('cta_title')->nullable()->after('deliverables');
            $table->text('cta_description')->nullable()->after('cta_title');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn([
                'slug',
                'short_description',
                'full_description',
                'image',
                'advantages',
                'process_steps',
                'deliverables',
                'cta_title',
                'cta_description',
            ]);
        });
    }
};
