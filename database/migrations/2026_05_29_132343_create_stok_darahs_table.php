<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stok_darahs', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // e.g. 'A+', 'B-'
            $table->integer('stock')->default(0);
            $table->string('status')->default('aman');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stok_darahs');
    }
};
