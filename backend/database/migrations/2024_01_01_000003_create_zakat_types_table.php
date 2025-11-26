<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('zakat_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('type', [
                'pendapatan', 'perniagaan', 'emas_perak', 'simpanan',
                'saham', 'takaful', 'pertanian', 'ternakan', 'lain'
            ])->unique();
            $table->string('name');
            $table->string('name_en')->nullable();
            $table->text('description')->nullable();
            $table->decimal('nisab', 15, 4)->nullable();
            $table->integer('haul_days')->default(355);
            $table->decimal('rate', 5, 4)->default(0.0250);
            $table->json('formula')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();

            $table->index('is_active');
            $table->index('type');
            $table->index('display_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('zakat_types');
    }
};
