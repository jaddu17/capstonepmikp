<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InfografisSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultData = [
            'bulan' => 'MEI',
            'tahun' => '2026',
            'kontak' => [
                'markas' => '0274 773244',
                'ambulance' => '0274 7724533',
                'whatsapp' => '0813 2886 1118'
            ],
            'stats' => [
                'pertolongan_pertama' => 0,
                'kecelakaan' => 0,
                'kebakaran' => 0,
                'bencana_alam' => 0,
                'evakuasi_jenazah' => 0,
                'home_emergency' => 0
            ],
            'dokumentasi' => ["", "", "", "", "", ""],
            'pelayanan' => ["PERTOLONGAN PERTAMA", "PELAYANAN AMBULANCE"],
            'quote' => "Menjadi relawan bukan tentang seberapa besar bantuan yang diberi, tetapi seberapa tulus hati yang tergerak."
        ];

        \App\Models\Infografis::create($defaultData);
    }
}
