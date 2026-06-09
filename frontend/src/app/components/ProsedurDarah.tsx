import { ClipboardCheck, FileText, Smartphone, Truck, MessageCircle } from "lucide-react";

export function ProsedurDarah() {
  const steps = [
    {
      icon: FileText,
      title: "Surat Pengantar",
      description: "Siapkan surat pengantar permintaan darah dari Rumah Sakit atau Dokter yang merawat.",
      color: "bg-blue-500"
    },
    {
      icon: ClipboardCheck,
      title: "Sampel Darah",
      description: "Bawa sampel darah pasien (jika diperlukan) ke Unit Donor Darah PMI Kulon Progo.",
      color: "bg-red-500"
    },
    {
      icon: Smartphone,
      title: "Verifikasi Admin",
      description: "Petugas kami akan mengecek ketersediaan stok darah sesuai kebutuhan pasien.",
      color: "bg-orange-500"
    },
    {
      icon: Truck,
      title: "Pengambilan Darah",
      description: "Darah yang telah siap dapat diambil oleh keluarga atau petugas medis rumah sakit.",
      color: "bg-green-500"
    }
  ];

  const handleWhatsApp = () => {
    const message = "Halo Admin PMI Kulon Progo, saya ingin menanyakan prosedur/permintaan stok darah untuk pasien...";
    window.open(`https://wa.me/6281328861118?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Prosedur Permintaan Darah</h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium text-lg">
            Ikuti langkah-langkah di bawah ini untuk mendapatkan layanan permintaan stok darah di PMI Kulon Progo.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative mb-16">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 transform -translate-y-12"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 ${step.color} rounded-3xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 mb-6 border-4 border-white`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-primary/20 transition-colors h-full">
                  <h3 className="font-black text-gray-900 mb-2 uppercase tracking-tight text-sm">Langkah {idx + 1}: {step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#C21219] rounded-[3rem] p-12 text-white overflow-hidden relative shadow-2xl shadow-red-900/20">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-black mb-2">Butuh Darah Mendesak?</h3>
              <p className="text-red-100 font-medium text-lg">Hubungi petugas kami langsung melalui WhatsApp untuk respon cepat 24 jam.</p>
            </div>
            <button 
              onClick={handleWhatsApp}
              className="flex items-center gap-4 bg-white text-primary px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl active:scale-95 group"
            >
              <MessageCircle className="w-8 h-8 text-green-500 group-hover:rotate-12 transition-transform" />
              KIRIM PERMINTAAN WA
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
