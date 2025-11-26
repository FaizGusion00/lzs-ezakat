<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'role' => 'payer_individual',
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'phone' => $this->faker->phoneNumber(),
            'phone_verified_at' => now(),
            'mykad_ssm' => $this->faker->unique()->numerify('######-##-####'),
            'full_name' => $this->faker->name(),
            'branch_id' => null, // Set by seeder
            'profile_data' => ['address' => $this->faker->address()],
            'is_verified' => true,
            'is_active' => true,
            'last_login' => $this->faker->dateTimeThisMonth(),
            'remember_token' => Str::random(10),
        ];
    }
}
