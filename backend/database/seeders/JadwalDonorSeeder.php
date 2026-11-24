<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class JadwalDonorSeeder extends Seeder
{
    public function run(): void
    {
        $schedules = [
            [
                'date' => '26 November 2026',
                'day' => 'Kamis',
                'location' => 'Alun-Alun Wates',
                'time' => '08:00 - 12:00 WIB',
                'quota' => '100 orang',
            ],
            [
                'date' => '28 November 2026',
                'day' => 'Sabtu',
                'location' => 'Kantor PMI Kulon Progo',
                'time' => '08:30 - 13:00 WIB',
                'quota' => '80 orang',
            ],
            [
                'date' => '12 Mei 2026',
                'day' => 'Selasa',
                'location' => 'Pasar Sentolo',
                'time' => '08:00 - 12:00 WIB',
                'quota' => '75 orang',
            ],
            [
                'date' => '15 Mei 2026',
                'day' => 'Jumat',
                'location' => 'Kapanewon Pengasih',
                'time' => '09:00 - 13:00 WIB',
                'quota' => '60 orang',
            ],
        ];

        foreach ($schedules as $s) {
            \App\Models\JadwalDonor::create($s);
        }
    }
}
