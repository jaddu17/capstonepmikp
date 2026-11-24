<?php

namespace App\Console\Commands;

use App\Models\StokDarah;
use App\Services\FonnteService;
use Illuminate\Console\Command;

class SendDailyStokNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notif:stok-harian';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Kirim rekap stok darah harian PMI Kulon Progo ke WhatsApp Group';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Mengambil data stok darah terkini...');

        $stokList = StokDarah::all();
        if ($stokList->isEmpty()) {
            $this->warn('Data stok darah masih kosong.');
            return Command::SUCCESS;
        }

        $tanggal = now()->locale('id')->isoFormat('dddd, D MMMM Y');

        // Format Pesan WhatsApp
        $waMessage = "🩸 *REKAP STOK DARAH HARIAN PMI KULON PROGO* 🩸\n"
            . "📅 _{$tanggal}_\n\n"
            . "Berikut informasi ketersediaan kantong darah di UDD PMI Kab. Kulon Progo hari ini:\n\n";

        foreach ($stokList as $stok) {
            $total = ($stok->wb ?? 0) + ($stok->prc ?? 0) + ($stok->tc ?? 0);
            $statusEmoji = ($stok->status === 'Aman' || $total >= 20) ? '🟢' : '🟡';
            $waMessage .= "{$statusEmoji} *Golongan {$stok->type}* (Total: {$total} Kantong)\n"
                . "   • WB  : {$stok->wb} kantong\n"
                . "   • PRC : {$stok->prc} kantong\n"
                . "   • TC  : {$stok->tc} kantong\n"
                . "   • Status: {$stok->status}\n\n";
        }

        $waMessage .= "ℹ️ _Bagi masyarakat yang ingin berdonor darah, silakan datang langsung ke Gedung UDD PMI Kulon Progo atau ikuti Mobile Unit kami._\n\n"
            . "📞 Emergency Call: (0274) 773456\n"
            . "🌐 Website: https://pmikulonprogo.or.id";

        $this->info('Mengirim notifikasi ke WhatsApp Group PMI...');
        $waResult = FonnteService::send($waMessage);
        $waOk = !empty($waResult['status']);
        if ($waOk) {
            $this->info('✓ [WhatsApp] Notifikasi rekap stok berhasil terkirim ke WhatsApp Group PMI.');
            $this->info('Notifikasi harian stok darah berhasil dijalankan.');
            return Command::SUCCESS;
        } else {
            $waErrMsg = $waResult['error'] ?? $waResult['message'] ?? 'Gagal mengirim pesan via WhatsApp Gateway';
            $this->error("✗ [WhatsApp] Pengiriman gagal: {$waErrMsg}");
            $this->warn('Notifikasi harian selesai dengan sebagian peringatan.');
            return Command::SUCCESS;
        }
    }
}
