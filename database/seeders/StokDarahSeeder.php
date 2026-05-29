<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class StokDarahSeeder extends Seeder
{
    public function run(): void
    {
        $stocks = [
            ['type' => 'A+',  'stock' => 45, 'status' => 'aman'],
            ['type' => 'A-',  'stock' => 8,  'status' => 'menipis'],
            ['type' => 'B+',  'stock' => 38, 'status' => 'aman'],
            ['type' => 'B-',  'stock' => 5,  'status' => 'menipis'],
            ['type' => 'AB+', 'stock' => 22, 'status' => 'aman'],
            ['type' => 'AB-', 'stock' => 3,  'status' => 'kritis'],
            ['type' => 'O+',  'stock' => 52, 'status' => 'aman'],
            ['type' => 'O-',  'stock' => 7,  'status' => 'menipis'],
        ];

        foreach ($stocks as $s) {
            \App\Models\StokDarah::create($s);
        }
    }
}
