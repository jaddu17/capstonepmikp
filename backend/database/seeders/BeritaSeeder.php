<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BeritaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultNews = [
            [
                'title' => 'PMI Kulon Progo Berhasil Kumpulkan 250 Kantong Darah',
                'date' => '8 Mei 2026',
                'category' => 'Donor Darah',
                'excerpt' => 'Kegiatan donor darah masal di Alun-Alun Wates berhasil mengumpulkan 250 kantong darah dari masyarakat Kulon Progo.',
                'content' => 'PMI Kulon Progo melaksanakan kegiatan donor darah masal di Alun-Alun Wates pada hari Sabtu lalu. Antusiasme masyarakat sangat tinggi, terlihat dari banyaknya warga yang datang sejak pagi hari. Tim medis PMI bekerja keras melayani para pendonor dengan tetap menjaga protokol kesehatan. Total 250 kantong darah berhasil dikumpulkan untuk menambah stok darah di Kulon Progo.',
                'image' => 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&h=500&fit=crop',
                'published' => true,
            ],
            [
                'title' => 'Pelatihan Pertolongan Pertama untuk Relawan PMI',
                'date' => '5 Mei 2026',
                'category' => 'Pelatihan',
                'excerpt' => '50 relawan PMI mengikuti pelatihan pertolongan pertama pada kecelakaan (P3K) yang diselenggarakan di kantor PMI Kulon Progo.',
                'content' => 'Pusat Pendidikan dan Pelatihan PMI Kulon Progo menyelenggarakan pelatihan P3K intensif selama tiga hari. Relawan diajarkan teknik-teknik dasar penyelamatan nyawa, penanganan luka, hingga evakuasi korban. Pelatihan ini bertujuan untuk meningkatkan kesiapsiagaan relawan dalam menghadapi situasi darurat di lapangan.',
                'image' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop',
                'published' => true,
            ],
        ];

        foreach ($defaultNews as $news) {
            \App\Models\Berita::create($news);
        }
    }
}
