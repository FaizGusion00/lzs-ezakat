<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('zakat_calculations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('zakat_type_id')->constrained('zakat_types');
            $table->decimal('amount_gross', 15, 4);
            $table->decimal('amount_deductions', 15, 4)->default(0);
            $table->decimal('amount_net', 15, 4);
            $table->decimal('zakat_due', 15, 4);
            $table->enum('status', ['wajib', 'sunat', 'tidak_wajib']);
            $table->json('params');
            $table->date('haul_start_date')->nullable();
            $table->date('haul_end_date')->nullable();
            $table->integer('haul_remaining_days')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index(['user_id', 'zakat_type_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('zakat_calculations');
    }
};
