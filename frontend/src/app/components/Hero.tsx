import { Heart, Droplet, Users, TrendingUp, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import { CuacaBadge } from "./CuacaBadge";

export function Hero() {
  const stats = [
    { icon: Droplet, label: "Kantong Darah/Bulan", value: "1,200+" },
    { icon: Users, label: "Pendonor Aktif", value: "5,000+" },
    { icon: Heart, label: "Layanan/Bulan", value: "150+" },
    { icon: TrendingUp, label: "Tahun Melayani", value: "25+" },
  ];

  return (
    <section id="beranda" className="relative text-white overflow-hidden">
      <CuacaBadge />
      {/* Background Grid Images */}
      <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-1 opacity-40 pointer-events-none">
        <img src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=400" alt="bg1" className="w-full h-full object-cover" />
        <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400" alt="bg2" className="w-full h-full object-cover" />
        <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=400" alt="bg3" className="w-full h-full object-cover" />
        <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400" alt="bg4" className="w-full h-full object-cover" />
        <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400" alt="bg5" className="w-full h-full object-cover hidden md:block" />
        <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400" alt="bg6" className="w-full h-full object-cover" />
        <img src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400" alt="bg7" className="w-full h-full object-cover" />
        <img src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=400" alt="bg8" className="w-full h-full object-cover" />
        <img src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=400" alt="bg9" className="w-full h-full object-cover" />
        <img src="https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?auto=format&fit=crop&q=80&w=400" alt="bg10" className="w-full h-full object-cover hidden md:block" />
      </div>

      {/* Red Transparent Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C21219]/90 to-[#8B1529]/95 mix-blend-multiply"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#8B1529]/80 to-transparent"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center justify-center">
        <div className="text-center w-full max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-md">
            PMI Kulon Progo
          </h1>
          <p className="text-xl sm:text-2xl mb-6 text-white/90 font-semibold drop-shadow-sm">
            Palang Merah Indonesia Cabang Kulon Progo
          </p>
          <p className="text-lg mb-10 text-white/80 max-w-2xl mx-auto drop-shadow-sm">
            Berkomitmen untuk kemanusiaan melalui donor darah, tanggap darurat,
            dan layanan sosial untuk masyarakat Kulon Progo
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Panggilan Darurat */}
            <a
              href="tel:0274773244"
              className="bg-white text-[#C21219] px-6 py-3.5 rounded-2xl font-black shadow-xl hover:scale-105 hover:bg-red-50 transition-all flex items-center gap-3 border-b-4 border-red-200 group animate-in slide-in-from-bottom-4"
            >
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <PhoneCall className="w-5 h-5 text-[#C21219] animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Panggilan Darurat</div>
                <div className="text-xl leading-none">(0274) 773244</div>
              </div>
            </a>
            
            {/* WhatsApp */}
            <a
              href="https://wa.me/6282133403011"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#C21219] px-6 py-3.5 rounded-2xl font-black shadow-xl hover:scale-105 hover:bg-red-50 transition-all flex items-center gap-3 border-b-4 border-red-200 group animate-in slide-in-from-bottom-4 delay-75"
            >
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <PhoneCall className="w-5 h-5 text-[#C21219]" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">WhatsApp Admin</div>
                <div className="text-xl leading-none">0821-3340-3011</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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