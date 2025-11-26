<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('amil_commissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('amil_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('payment_id')->constrained('payments')->cascadeOnDelete();
            $table->decimal('amount', 15, 4);
            $table->decimal('rate', 5, 4);
            $table->boolean('is_paid')->default(false);
            $table->timestamp('paid_at')->nullable();
            $table->uuid('paid_by')->nullable();
            $table->string('payment_method', 50)->nullable();
            $table->string('payment_ref', 100)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('is_paid');
            $table->index(['amil_id', 'created_at']);
            $table->index(['amil_id', 'is_paid', 'paid_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('amil_commissions');
    }
};
