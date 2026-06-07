<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('quote_requests')) {
            Schema::create('quote_requests', function (Blueprint $table) {
                $table->id();
                $table->string('full_name');
                $table->string('phone');
                $table->string('email');
                $table->string('project_type');
                $table->string('budget');
                $table->string('project_title');
                $table->text('message');
                $table->string('status')->default('new')->index();
                $table->boolean('is_read')->default(false)->index();
                $table->timestamps();
            });

            return;
        }

        Schema::table('quote_requests', function (Blueprint $table) {
            if (! Schema::hasColumn('quote_requests', 'full_name')) {
                $table->string('full_name')->nullable()->after('id');
            }
            if (! Schema::hasColumn('quote_requests', 'project_type')) {
                $table->string('project_type')->nullable()->after('email');
            }
            if (! Schema::hasColumn('quote_requests', 'budget')) {
                $table->string('budget')->nullable()->after('project_type');
            }
            if (! Schema::hasColumn('quote_requests', 'is_read')) {
                $table->boolean('is_read')->default(false)->index()->after('status');
            }
        });

        if (Schema::hasColumn('quote_requests', 'client_name')) {
            DB::table('quote_requests')
                ->whereNull('full_name')
                ->update(['full_name' => DB::raw('client_name')]);
        }

        DB::table('quote_requests')->whereNull('project_type')->update(['project_type' => 'Non precise']);
        DB::table('quote_requests')->whereNull('budget')->update(['budget' => 'Non precise']);
        DB::table('quote_requests')->where('status', 'processed')->update(['status' => 'treated']);
        DB::table('quote_requests')->where('status', 'pending')->update(['status' => 'new']);

        Schema::table('quote_requests', function (Blueprint $table) {
            if (Schema::hasColumn('quote_requests', 'client_name')) {
                $table->dropColumn('client_name');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('quote_requests')) {
            return;
        }

        Schema::table('quote_requests', function (Blueprint $table) {
            if (! Schema::hasColumn('quote_requests', 'client_name')) {
                $table->string('client_name')->nullable()->after('id');
            }
        });

        if (Schema::hasColumn('quote_requests', 'full_name')) {
            DB::table('quote_requests')
                ->whereNull('client_name')
                ->update(['client_name' => DB::raw('full_name')]);
        }

        Schema::table('quote_requests', function (Blueprint $table) {
            foreach (['full_name', 'project_type', 'budget', 'is_read'] as $column) {
                if (Schema::hasColumn('quote_requests', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
