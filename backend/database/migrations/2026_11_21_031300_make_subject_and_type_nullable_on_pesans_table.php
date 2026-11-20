<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('pesans', 'subject')) {
            DB::statement("ALTER TABLE pesans MODIFY subject VARCHAR(255) NULL DEFAULT NULL");
        } else {
            Schema::table('pesans', function (Blueprint $table) {
                $table->string('subject')->nullable()->after('phone');
            });
        }

        if (Schema::hasColumn('pesans', 'type')) {
            DB::statement("ALTER TABLE pesans MODIFY type VARCHAR(255) NULL DEFAULT 'umum'");
        } else {
            Schema::table('pesans', function (Blueprint $table) {
                $table->string('type')->nullable()->default('umum')->after('phone');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('pesans', 'subject')) {
            DB::statement("ALTER TABLE pesans MODIFY subject VARCHAR(255) NOT NULL");
        }
    }
};
