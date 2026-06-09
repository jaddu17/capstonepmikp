import { CheckCircle, AlertCircle, ClipboardList, Activity, Droplet, Heart, Clock, UserCheck } from "lucide-react";

export function InfoDonorDarah() {
  const syarat = [
    {
      no: "01",
      icon: Heart,
      title: "SEHAT",
      desc: "Dalam kondisi kesehatan yang baik.",
    },
    {
      no: "02",
      icon: UserCheck,
      title: "USIA 17 - 60 TAHUN",
      desc: "Rentang usia yang diperbolehkan untuk donor.",
    },
    {
      no: "03",
      icon: Activity,
      title: "BERAT BADAN",
      desc: "Berat badan minimal 50 kg.",
    },
    {
      no: "04",
      icon: Clock,
      title: "SUDAH MAKAN,",
      desc: "Min. 3 jam setelah makan besar.",
    },
    {
      no: "05",
      icon: Activity,
      title: "TEKANAN DARAH",
      desc: "Antara 110/70 - 150/90 mmHg.",
    },
    {
      no: "06",
      icon: Droplet,
      title: "KADAR HEMOGLOBIN",
      desc: "Antara 12.5 - 17.0 gr/dL.",
    },
    {
      no: "07",
      icon: AlertCircle,
      title: "TIDAK KONSUMSI OBAT DALAM:",
      desc: "• 7 hari terakhir untuk obat antibiotik\n• 3 hari terakhir untuk obat analgetik / antipiretik\n• 4 jam setelah konsumsi obat penurun tekanan darah minimal 5 mg dan hanya satu macam obat",
    },
    {
      no: "08",
      icon: AlertCircle,
      title: "TIDAK MENGIDAP PENYAKIT",
      desc: "Jantung, Hati dan Ginjal.",
    },
    {
      no: "09",
      icon: AlertCircle,
      title: "BAGI WANITA:",
      desc: "Tidak sedang hamil / menyusui.",
    },
    {
      no: "10",
      icon: Clock,
      title: "JARAK DONOR TERAKHIR",
      desc: "Minimal 60 hari.",
    },
    {
      no: "11",
      icon: ClipboardList,
      title: "WAJIB MEMBAWA IDENTITAS",
      desc: "Wajib membawa kartu identitas berfoto (KTP/SIM/Kartu Pelajar).",
    },
  ];

  const alurPendaftaran = [
    {
      no: "01",
      icon: ClipboardList,
      title: "Mengisi Form Pendaftaran",
      color: "bg-red-500",
      desc: "pastikan membawa kartu Donor dan KTP / SIM / Passport untuk verifikasi data pendonor",
    },
    {
      no: "02",
      icon: CheckCircle,
      title: "Anamnesa Inform Consent",
      color: "bg-pink-500",
      desc: "Pengecekan riwayat Kesehatan dan Persetujuan untuk diambil darahnya dan di cek laboratorium",
    },
    {
      no: "03",
      icon: Activity,
      title: "Cek Tekanan Darah",
      color: "bg-red-600",
      desc: "Tekanan darah yang di perbolehkan minimal 100/70 mmHg - maksimal 140 / 90 mmHg",
    },
    {
      no: "04",
      icon: Droplet,
      title: "Cek Kadar Hemoglobin",
      color: "bg-pink-600",
      desc: "Hemoglobin adalah merupakan protein zat besi yang terkandung dalam sel darah merah. Batas bawah yang diperbolehkan adalah minimal 12,5 mg/dl-maksimal 17,0 mg/dL",
    },
    {
      no: "05",
      icon: Heart,
      title: "Pengambilan Darah Donor",
      color: "bg-red-500",
      desc: "Darah akan di ambil sebanyak 350 ml, waktu penyandapan kurang lebih 15-30 menit",
    },
    {
      no: "06",
      icon: Clock,
      title: "Istirahat",
      color: "bg-pink-500",
      desc: "Istirahat yang cukup untuk pemulihan pasca donor di ruang istirahat yang sudah disediakan",
    },
  ];

  return (
    <section id="info-donor" className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Syarat-syarat Donor Darah */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Syarat-Syarat Donor Darah</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pastikan Anda memenuhi persyaratan berikut sebelum melakukan donor darah
            </p>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 border border-border rounded-2xl p-8 shadow-lg">
            <div className="space-y-6">
              {syarat.map((item, idx) => (
                <div
                  key={item.no}
                  className={`flex items-start gap-4 ${idx !== syarat.length - 1 ? 'pb-6 border-b border-gray-200' : ''}`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                      {item.no}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className="w-5 h-5 text-primary" />
                      <h3 className="font-bold text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-2">Catatan Penting:</h4>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>Pastikan Anda dalam kondisi sehat dan fit</li>
                  <li>Istirahat cukup minimal 5 jam sebelum donor</li>
                  <li>Minum air putih yang cukup sebelum donor</li>
                  <li>Hindari makanan berlemak sebelum donor</li>
                  <li>Jika ada keluhan kesehatan, konsultasikan dengan petugas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Alur Pendaftaran Donor Darah */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <ClipboardList className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Alur Pendaftaran Donor Darah</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Proses donor darah yang mudah dan terstruktur untuk kenyamanan Anda
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {alurPendaftaran.map((step, index) => (
                <div key={step.no} className="relative">
                  {index !== alurPendaftaran.length - 1 && (
                    <div className="absolute left-8 top-20 bottom-0 w-1 bg-gradient-to-b from-primary to-pink-300 -translate-x-1/2"></div>
                  )}
                  <div className="bg-white border border-border rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="flex items-start gap-6">
                      <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-bold text-primary">LANGKAH {step.no}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-foreground">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-2xl mb-6 transform -rotate-6 hover:rotate-0 transition-transform">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-gray-900 tracking-tight">
            Syarat Pengadaan <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#8B1529]">Mobile Unit</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Persyaratan bagi instansi atau komunitas yang ingin mengadakan kegiatan donor darah massal.
          </p>
        </div>

          <div className="flex flex-col gap-4 mb-16 max-w-4xl mx-auto">
            {[
              {
                title: "Ruangan Representatif",
                desc: "Dalam ruangan sejuk (bukan tenda), lantai bukan cor/konblok, penerangan cukup, dan akses mudah. Wajib melampirkan foto ruangan.",
              },
              {
                title: "Fasilitas Petugas",
                desc: "Menyediakan 2 Meja dan 6 Kursi khusus untuk petugas screening donor.",
              },
              {
                title: "Fasilitas Pendonor",
                desc: "Menyediakan Meja dan Kursi secukupnya di area ruang tunggu untuk kenyamanan pendonor.",
              },
              {
                title: "Akses Parkir",
                desc: "Tersedia tempat parkir khusus untuk kendaraan Operasional PMI yang memudahkan mobilitas keluar masuk.",
              },
              {
                title: "Konsumsi Pendonor",
                desc: "Menyediakan minuman hangat untuk pendonor (Teh, Kopi, Wedang Uwuh, Wedang Jahe, dll / Bebas).",
              },
              {
                title: "Durasi Kegiatan",
                desc: "Pelaksanaan kegiatan donor darah berlangsung kurang lebih selama 4 jam.",
              },
              {
                title: "Peralatan Medis",
                desc: "Tidak perlu khawatir, semua peralatan medis untuk pengambilan darah sepenuhnya disediakan oleh PMI.",
              },
              {
                title: "Bebas Biaya",
                desc: "Seluruh proses pengadaan kegiatan Mobile Unit PMI ini tidak dipungut biaya administrasi (100% Free).",
              },
              {
                title: "Pengisian Formulir",
                desc: (
                  <>
                    Wajib mengisi link permohonan kegiatan secara online di:{" "}
                    <a href="https://bit.ly/PermohonanDonorDarahMassal" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">
                      bit.ly/PermohonanDonorDarahMassal
                    </a>
                  </>
                ),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-gray-100 rounded-[1.5rem] p-5 sm:p-6 hover:border-primary/30 hover:shadow-lg transition-all flex items-start gap-4 sm:gap-6 group relative overflow-hidden"
              >

                
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center font-black text-white transition-colors text-lg shadow-sm border border-primary/20">
                    {idx + 1}
                  </div>
                </div>
                <div className="relative z-10 flex-1 pt-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <div className="text-gray-500 text-sm sm:text-base leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Card Khusus Kontak WA */}
            <div className="bg-gradient-to-br from-primary to-[#8B1529] rounded-[2rem] p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-white mt-4 gap-6 text-center md:text-left">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-10 max-w-lg">
                <h3 className="text-2xl font-black mb-2">Punya Pertanyaan Lebih Lanjut?</h3>
                <p className="text-white/80">
                  Untuk konfirmasi lebih lanjut dan pengecekan ketersediaan jadwal Mobile Unit, silakan hubungi admin kami.
                </p>
              </div>
              <a
                href="https://wa.me/6282133403011"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg relative z-10 flex-shrink-0"
              >
                Hubungi WhatsApp (0821-3340-3011)
              </a>
            </div>
          </div>
      </div>
    </section>
  );
}
