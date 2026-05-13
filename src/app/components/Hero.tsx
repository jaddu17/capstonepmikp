import { Heart, Droplet, Users, TrendingUp } from "lucide-react";

export function Hero() {
  const stats = [
    { icon: Droplet, label: "Kantong Darah/Bulan", value: "1,200+" },
    { icon: Users, label: "Pendonor Aktif", value: "5,000+" },
    { icon: Heart, label: "Layanan/Bulan", value: "150+" },
    { icon: TrendingUp, label: "Tahun Melayani", value: "25+" },
  ];

  return (
    <section id="beranda" className="bg-gradient-to-br from-primary to-[#C21219] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            PMI Kulon Progo
          </h1>
          <p className="text-xl sm:text-2xl mb-4 text-white/90">
            Palang Merah Indonesia Cabang Kulon Progo
          </p>
          <p className="text-lg mb-8 text-white/80 max-w-2xl mx-auto">
            Berkomitmen untuk kemanusiaan melalui donor darah, tanggap darurat,
            dan layanan sosial untuk masyarakat Kulon Progo
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#stok-darah"
              className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Cek Stok Darah
            </a>
            <a
              href="#jadwal"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Jadwal Donor
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
