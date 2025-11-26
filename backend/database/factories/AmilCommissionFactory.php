<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AmilCommissionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'amil_id' => User::factory()->state(['role' => 'amil']),
            'payment_id' => Payment::factory(),
            'amount' => $this->faker->randomFloat(2, 10, 100),
            'rate' => 0.025,
            'is_paid' => false,
        ];
    }
}
