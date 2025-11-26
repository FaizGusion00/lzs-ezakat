<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('type', 50);
            $table->string('title')->nullable();
            $table->text('message');
            $table->enum('channel', ['whatsapp', 'email', 'sms', 'push', 'system']);
            $table->boolean('is_sent')->default(false);
            $table->boolean('is_read')->default(false);
            $table->json('metadata')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->text('failed_reason')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index('type');
            $table->index('channel');
            $table->index('is_sent');
            $table->index('scheduled_at');
            $table->index(['user_id', 'is_sent']);
            $table->index(['user_id', 'is_read']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
