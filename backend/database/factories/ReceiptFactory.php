<?php

namespace Database\Factories;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReceiptFactory extends Factory
{
    public function definition(): array
    {
        return [
            'payment_id' => Payment::factory(),
            'receipt_no' => 'LZS-' . $this->faker->unique()->numerify('2024######'),
            'is_printed' => false,
            'valid_until' => now()->addYears(7),
        ];
    }
}
