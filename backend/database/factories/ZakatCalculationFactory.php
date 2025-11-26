<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\ZakatType;
use Illuminate\Database\Eloquent\Factories\Factory;

class ZakatCalculationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'zakat_type_id' => ZakatType::factory(),
            'amount_gross' => $this->faker->randomFloat(2, 1000, 100000),
            'amount_deductions' => $this->faker->randomFloat(2, 0, 5000),
            'amount_net' => function (array $attributes) {
                return $attributes['amount_gross'] - $attributes['amount_deductions'];
            },
            'zakat_due' => function (array $attributes) {
                return $attributes['amount_net'] * 0.025;
            },
            'status' => $this->faker->randomElement(['wajib', 'sunat', 'tidak_wajib']),
            'params' => ['year' => 2024],
            'haul_start_date' => $this->faker->date(),
            'haul_end_date' => $this->faker->date(),
            'haul_remaining_days' => 0,
        ];
    }
}
