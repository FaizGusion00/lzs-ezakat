<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Branches
        $branches = \App\Models\Branch::factory(5)->create();

        // 2. Create Zakat Types
        $zakatTypes = \App\Models\ZakatType::factory()->createMany([
            ['type' => 'pendapatan', 'name' => 'Zakat Pendapatan'],
            ['type' => 'perniagaan', 'name' => 'Zakat Perniagaan'],
            ['type' => 'emas_perak', 'name' => 'Zakat Emas & Perak'],
            ['type' => 'simpanan', 'name' => 'Zakat Simpanan'],
        ]);

        // 3. Create Users (Admin, Amil, Payers)
        $admin = User::factory()->create([
            'role' => 'admin',
            'full_name' => 'System Administrator',
            'email' => 'admin@lzs.gov.my',
            'password' => Hash::make('password'),
            'branch_id' => $branches->first()->id,
        ]);

        $amils = User::factory(5)->create([
            'role' => 'amil',
            'password' => Hash::make('password'),
            'branch_id' => $branches->random()->id,
        ]);

        $payers = User::factory(20)->create([
            'role' => 'payer_individual',
            'password' => Hash::make('password'),
            'branch_id' => $branches->random()->id,
        ]);

        // 4. Create Calculations & Payments for Payers
        foreach ($payers as $payer) {
            // Create 1-3 calculations per payer
            $calculations = \App\Models\ZakatCalculation::factory(rand(1, 3))->create([
                'user_id' => $payer->id,
                'zakat_type_id' => $zakatTypes->random()->id,
            ]);

            foreach ($calculations as $calc) {
                // 80% chance to pay
                if (rand(1, 100) <= 80) {
                    $payment = \App\Models\Payment::factory()->create([
                        'user_id' => $payer->id,
                        'zakat_calc_id' => $calc->id,
                        'zakat_type_id' => $calc->zakat_type_id,
                        'amil_id' => $amils->random()->id,
                        'amount' => $calc->zakat_due,
                    ]);

                    // Create Receipt
                    \App\Models\Receipt::factory()->create([
                        'payment_id' => $payment->id,
                    ]);

                    // Create Commission for Amil
                    if ($payment->amil_id) {
                        \App\Models\AmilCommission::factory()->create([
                            'amil_id' => $payment->amil_id,
                            'payment_id' => $payment->id,
                            'amount' => $payment->amount * 0.025,
                        ]);
                    }
                }
            }
        }
    }
}
