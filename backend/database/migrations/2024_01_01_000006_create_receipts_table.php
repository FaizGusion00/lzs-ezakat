<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receipts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('payment_id')->unique()->constrained('payments')->cascadeOnDelete();
            $table->string('receipt_no', 50)->unique();
            $table->string('pdf_path', 500)->nullable();
            $table->text('pdf_url')->nullable();
            $table->text('qr_code')->nullable();
            $table->timestamp('valid_until')->nullable();
            $table->boolean('is_printed')->default(false);
            $table->integer('print_count')->default(0);
            $table->timestamps();

            $table->index('receipt_no');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receipts');
    }
};
