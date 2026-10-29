<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Pengiriman Rekap Stok Darah Harian Otomatis ke WhatsApp & Instagram setiap jam 07:00 WIB
Schedule::command('notif:stok-harian')->dailyAt('07:00');
