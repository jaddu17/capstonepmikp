<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class PesanSeeder extends Seeder
{
    public function run(): void
    {
        $messages = [
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@example.com',
                'phone' => '08123456789',
                'type' => 'donor',
                'subject' => 'Pertanyaan tentang syarat donor darah',
                'message' => 'Selamat pagi, saya ingin menanyakan apakah penderita hipertensi terkontrol bisa donor darah? Terima kasih.',
                'date' => '10 Mei 2026, 09:30',
                'read' => false,
                'replied' => false,
            ],
            [
                'name' => 'Siti Aminah',
                'email' => 'siti@example.com',
                'phone' => '08987654321',
                'type' => 'relawan',
                'subject' => 'Pendaftaran menjadi relawan PMI',
                'message' => 'Halo, saya tertarik untuk menjadi relawan PMI Kulon Progo. Bagaimana prosedur pendaftarannya?',
                'date' => '9 Mei 2026, 14:15',
                'read' => true,
                'replied' => true,
                'reply_text' => 'Halo Siti, pendaftaran relawan bisa dilakukan dengan mengisi formulir di markas kami.',
            ],
            [
                'name' => 'Ahmad Rifai',
                'email' => 'ahmad@example.com',
                'phone' => '08567891234',
                'type' => 'saran',
                'subject' => 'Saran untuk website PMI',
                'message' => 'Website sudah bagus, tapi mungkin bisa ditambahkan fitur notifikasi WA ketika stok darah menipis.',
                'date' => '8 Mei 2026, 16:45',
                'read' => false,
                'replied' => false,
            ],
        ];

        foreach ($messages as $m) {
            \App\Models\Pesan::create($m);
        }
    }
}
