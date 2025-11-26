<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users');
            $table->foreignUuid('amil_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('zakat_calc_id')->nullable()->constrained('zakat_calculations')->nullOnDelete();
            $table->foreignUuid('zakat_type_id')->constrained('zakat_types');
            $table->decimal('amount', 15, 4);
            $table->enum('status', ['pending', 'processing', 'success', 'failed', 'refunded', 'cancelled'])->default('pending');
            $table->enum('method', ['fpx', 'jompay', 'ewallet', 'card', 'qr', 'cash', 'bank_transfer']);
            $table->string('ref_no', 100)->unique();
            $table->string('gateway_ref')->nullable();
            $table->json('gateway_response')->nullable();
            $table->integer('payment_year');
            $table->tinyInteger('payment_month');
            $table->string('year_month', 7);
            $table->timestamp('paid_at')->nullable();
            $table->text('failed_reason')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('method');
            $table->index('year_month');
            $table->index(['user_id', 'status', 'created_at']);
            $table->index(['payment_year', 'payment_month', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
