<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\ZakatCalculation;
use App\Models\ZakatType;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'amil_id' => null,
            'zakat_calc_id' => ZakatCalculation::factory(),
            'zakat_type_id' => ZakatType::factory(),
            'amount' => $this->faker->randomFloat(2, 50, 5000),
            'status' => 'success',
            'method' => $this->faker->randomElement(['fpx', 'card', 'ewallet']),
            'ref_no' => $this->faker->unique()->uuid(),
            'payment_year' => 2024,
            'payment_month' => $this->faker->numberBetween(1, 12),
            'year_month' => function (array $attributes) {
                return $attributes['payment_year'] . '-' . str_pad($attributes['payment_month'], 2, '0', STR_PAD_LEFT);
            },
            'paid_at' => $this->faker->dateTimeThisYear(),
        ];
    }
}
