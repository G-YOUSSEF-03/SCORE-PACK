<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('contact_messages')) {
            return;
        }

        Schema::table('contact_messages', function (Blueprint $table) {
            if (!Schema::hasColumn('contact_messages', 'full_name')) {
                $table->string('full_name')->default('')->after('id');
            }

            if (!Schema::hasColumn('contact_messages', 'is_read')) {
                $table->boolean('is_read')->default(false)->index()->after('message');
            }
        });

        if (Schema::hasColumn('contact_messages', 'name')) {
            DB::table('contact_messages')
                ->where('full_name', '')
                ->update(['full_name' => DB::raw('name')]);
        }

        if (Schema::hasColumn('contact_messages', 'status')) {
            DB::table('contact_messages')
                ->whereIn('status', ['read', 'replied'])
                ->update(['is_read' => true]);
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('contact_messages')) {
            return;
        }

        Schema::table('contact_messages', function (Blueprint $table) {
            if (Schema::hasColumn('contact_messages', 'full_name') && !Schema::hasColumn('contact_messages', 'name')) {
                $table->string('name')->default('')->after('id');
            }
        });

        if (Schema::hasColumn('contact_messages', 'full_name') && Schema::hasColumn('contact_messages', 'name')) {
            DB::table('contact_messages')
                ->where('name', '')
                ->update(['name' => DB::raw('full_name')]);
        }
    }
};
