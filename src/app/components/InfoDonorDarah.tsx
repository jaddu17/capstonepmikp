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
      icon: Clock,
      title: "SUDAH MAKAN,",
      desc: "Min. 3 jam setelah makan besar.",
    },
    {
      no: "04",
      icon: Activity,
      title: "TEKANAN DARAH",
      desc: "Antara 110/70 - 150/90 mmHg.",
    },
    {
      no: "05",
      icon: Droplet,
      title: "KADAR HEMOGLOBIN",
      desc: "Antara 12.5 - 17.0 gr/dL.",
    },
    {
      no: "06",
      icon: AlertCircle,
      title: "TIDAK KONSUMSI OBAT DALAM:",
      desc: "• 7 hari terakhir untuk obat antibiotik\n• 3 hari terakhir untuk obat analgetik / antipiretik\n• 4 jam setelah konsumsi obat penurun tekanan darah minimal 5 mg dan hanya satu macam obat",
    },
    {
      no: "07",
      icon: AlertCircle,
      title: "TIDAK MENGIDAP PENYAKIT",
      desc: "Jantung, Hati dan Ginjal.",
    },
    {
      no: "08",
      icon: AlertCircle,
      title: "BAGI WANITA:",
      desc: "Tidak sedang hamil / menyusui.",
    },
    {
      no: "09",
      icon: Clock,
      title: "JARAK DONOR TERAKHIR",
      desc: "Minimal 60 hari.",
    },
    {
      no: "10",
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

          <div className="mt-12 bg-gradient-to-br from-primary to-[#C21219] text-white rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Siap Menjadi Pendonor?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Satu kantong darah Anda dapat menyelamatkan hingga 3 nyawa. Mari berbagi kehidupan
              melalui donor darah!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#jadwal"
                className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
              >
                Lihat Jadwal Donor
              </a>
              <a
                href="#kontak"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors inline-block"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
