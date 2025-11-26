<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => 'system',
            'title' => $this->faker->sentence(),
            'message' => $this->faker->paragraph(),
            'channel' => 'system',
            'is_sent' => true,
            'is_read' => false,
            'sent_at' => now(),
        ];
    }
}
