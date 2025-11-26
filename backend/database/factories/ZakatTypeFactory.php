<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ZakatTypeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'type' => $this->faker->unique()->word(),
            'name' => $this->faker->words(2, true),
            'name_en' => $this->faker->words(2, true),
            'description' => $this->faker->sentence(),
            'nisab' => 20000.00,
            'haul_days' => 355,
            'rate' => 0.0250,
            'formula' => ['default' => 'amount * 0.025'],
            'is_active' => true,
            'display_order' => $this->faker->numberBetween(1, 10),
        ];
    }
}
