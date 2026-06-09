<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class StokDarahSeeder extends Seeder
{
    public function run(): void
    {
        $stocks = [
            ['type' => 'A',  'wb' => 6,  'prc' => 49, 'tc' => 9, 'status' => 'STOK CUKUP'],
            ['type' => 'B',  'wb' => 12, 'prc' => 7,  'tc' => 9, 'status' => 'STOK KURANG'],
            ['type' => 'O',  'wb' => 12, 'prc' => 22, 'tc' => 7, 'status' => 'STOK CUKUP'],
            ['type' => 'AB', 'wb' => 1,  'prc' => 3,  'tc' => 1, 'status' => 'STOK KURANG'],
        ];

        foreach ($stocks as $s) {
            \App\Models\StokDarah::create($s);
        }
    }
}
