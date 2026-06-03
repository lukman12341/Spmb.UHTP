<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Jalankan MasterDataSeeder
        $this->call(MasterDataSeeder::class);

        // Seeding Administrator SPMB
        User::updateOrCreate(
            ['email' => 'admin@uhtp.ac.id'],
            [
                'name' => 'Administrator SPMB',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        // Seeding Administrator CBT
        User::updateOrCreate(
            ['email' => 'admincbt@uhtp.ac.id'],
            [
                'name' => 'Administrator CBT',
                'password' => Hash::make('admincbt123'),
                'role' => 'admin_cbt',
            ]
        );
    }
}
