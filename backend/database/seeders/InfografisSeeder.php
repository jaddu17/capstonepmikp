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
            'bulan' => 'NOVEMBER',
            'tahun' => '2026',
            'kontak' => [
                'markas' => '0274 773244',
                'ambulance' => '0274 7724533',
                'whatsapp' => '0813 2886 1118'
            ],
            'stats' => [
                'pertolongan_pertama' => 9,
                'kecelakaan' => 5,
                'kebakaran' => 8,
                'bencana_alam' => 0,
                'evakuasi_jenazah' => 3,
                'home_emergency' => 7
            ],
            'dokumentasi' => [
                'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800',
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'
            ],
            'pelayanan' => ["PERTOLONGAN PERTAMA", "PELAYANAN AMBULANCE", "EVAKUASI"],
            'quote' => "Menjadi relawan bukan tentang seberapa besar bantuan yang diberi, tetapi seberapa tulus hati yang tergerak."
        ];

        \App\Models\Infografis::create($defaultData);
    }
}
