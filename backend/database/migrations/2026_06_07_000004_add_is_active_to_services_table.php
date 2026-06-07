<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('services')) {
            Schema::create('services', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->text('description');
                $table->string('icon')->nullable();
                $table->unsignedInteger('order')->default(0)->index();
                $table->boolean('is_active')->default(true)->index();
                $table->timestamps();
            });

            return;
        }

        Schema::table('services', function (Blueprint $table) {
            if (! Schema::hasColumn('services', 'is_active')) {
                $table->boolean('is_active')->default(true)->index()->after('icon');
            }
        });

        if (Schema::hasColumn('services', 'status')) {
            DB::table('services')->where('status', 'inactive')->update(['is_active' => false]);
            DB::table('services')->where('status', 'active')->update(['is_active' => true]);
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('services') || ! Schema::hasColumn('services', 'is_active')) {
            return;
        }

        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('is_active');
        });
    }
};
