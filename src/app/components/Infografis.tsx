import { useState, useEffect } from "react";
import { Phone, MessageCircle, Activity, Shield, Flame, Wind, Heart, Home, Camera, Info } from "lucide-react";
import logo from "../../assets/logo_pmi.png";

export function Infografis() {
  const [infografisList, setInfografisList] = useState<any[]>([]);
  const [activeData, setActiveData] = useState<any>(null);

  useEffect(() => {
    const savedList = localStorage.getItem("pmi_infografis_list");
    const savedSingle = localStorage.getItem("pmi_infografis_data");
    
    if (savedList) {
      const parsed = JSON.parse(savedList);
      setInfografisList(parsed);
      // Automatically show the first one (usually the latest)
      if (parsed.length > 0) setActiveData(parsed[0]);
    } else if (savedSingle) {
      const parsed = JSON.parse(savedSingle);
      setActiveData(parsed);
      setInfografisList([parsed]);
    }
  }, []);

  if (!activeData) return null;

  return (
    <section id="infografis" className="py-20 bg-[#F8F9FA] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1.5 bg-[#C21219]/10 text-[#C21219] rounded-full text-xs font-black uppercase tracking-[0.2em]">
            Transparansi & Akuntabilitas
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#C21219] tracking-tight">
            INFOGRAFIS PMI KABUPATEN KULON PROGO
          </h2>
          
          <div className="flex flex-col items-center gap-4 mt-6">
            <div className="text-xl font-bold text-gray-500 uppercase tracking-widest">
              Laporan Kinerja Bulan:
            </div>
            <select 
              value={activeData.id || ""}
              onChange={(e) => {
                const selected = infografisList.find(d => d.id === e.target.value);
                if (selected) setActiveData(selected);
              }}
              className="px-8 py-3 bg-white border-2 border-[#C21219] rounded-2xl text-2xl font-black text-gray-900 shadow-xl focus:ring-4 focus:ring-[#C21219]/10 outline-none appearance-none cursor-pointer hover:bg-gray-50 transition-all text-center"
            >
              {infografisList.map(item => (
                <option key={item.id} value={item.id}>
                  {item.bulan} {item.tahun}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          {/* Left Column: Contacts & Stats */}
          <div className="space-y-10">
            {/* Contacts Card */}
            <div className="relative p-8 bg-white border-2 border-[#C21219] rounded-[2.5rem] shadow-2xl overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#C21219]/5 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:scale-110"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                <div className="flex-1 space-y-5 w-full">
                  <h4 className="text-sm font-black text-[#C21219] uppercase tracking-widest mb-2">Layanan Darurat 24 Jam</h4>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group/item hover:border-[#C21219]/30 transition-all">
                    <div className="w-12 h-12 bg-[#C21219] text-white rounded-xl flex items-center justify-center shadow-lg group-hover/item:rotate-12 transition-transform">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase">Markas</div>
                      <div className="text-xl font-black text-gray-900">{activeData.kontak.markas}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group/item hover:border-[#C21219]/30 transition-all">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg group-hover/item:rotate-12 transition-transform">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase">Ambulance</div>
                      <div className="text-xl font-black text-gray-900">{activeData.kontak.ambulance}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group/item hover:border-[#C21219]/30 transition-all">
                    <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg group-hover/item:rotate-12 transition-transform">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase">WhatsApp</div>
                      <div className="text-xl font-black text-gray-900">{activeData.kontak.whatsapp}</div>
                    </div>
                  </div>
                </div>
                <div className="w-48 h-48 flex-shrink-0 bg-red-50 rounded-[2.5rem] flex items-center justify-center border-4 border-dashed border-[#C21219]/20 overflow-hidden group-hover:border-[#C21219]/40 transition-colors">
                  <Shield className="w-24 h-24 text-[#C21219] opacity-10 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <img src={logo} className="w-full h-full object-contain opacity-90" alt="Logo PMI" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="bg-[#FFEBEC] border-4 border-white rounded-[3rem] p-10 relative shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#C21219]"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-6">
                {[
                  { label: "PERTOLONGAN PERTAMA", value: activeData.stats.pertolongan_pertama, icon: Heart, color: "text-red-600" },
                  { label: "KECELAKAAN", value: activeData.stats.kecelakaan, icon: Activity, color: "text-orange-600" },
                  { label: "KEBAKARAN", value: activeData.stats.kebakaran, icon: Flame, color: "text-amber-600" },
                  { label: "BENCANA ALAM", value: activeData.stats.bencana_alam, icon: Wind, color: "text-blue-600" },
                  { label: "EVAKUASI JENAZAH", value: activeData.stats.evakuasi_jenazah, icon: Shield, color: "text-slate-700" },
                  { label: "HOME EMERGENCY", value: activeData.stats.home_emergency, icon: Home, color: "text-emerald-600" },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center group">
                    <div className="text-[10px] font-black text-gray-500 leading-tight mb-3 h-8 flex items-center justify-center uppercase tracking-widest px-2">
                      {stat.label}
                    </div>
                    <div className={`text-5xl font-black ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm`}>
                      {stat.value}
                    </div>
                    <div className="flex justify-center">
                      <stat.icon className={`w-5 h-5 ${stat.color} opacity-20`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Documentation & Pelayanan */}
          <div className="bg-white border-2 border-gray-100 rounded-[3rem] p-10 relative shadow-2xl flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8">
              <Camera className="w-6 h-6 text-[#C21219]" />
              <h3 className="text-2xl font-black tracking-widest text-gray-900 uppercase">DOKUMENTASI</h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
              {activeData.dokumentasi.map((img, idx) => (
                <div key={idx} className="aspect-square bg-gray-50 rounded-3xl overflow-hidden group border-2 border-transparent hover:border-[#C21219] transition-all relative">
                  {img ? (
                    <img 
                      src={img} 
                      alt={`Dokumentasi ${idx + 1}`} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                      <Camera className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-10 border-t-2 border-gray-50">
              <div className="flex items-center gap-3 mb-6">
                <Info className="w-6 h-6 text-[#C21219]" />
                <h3 className="text-xl font-black text-gray-900 uppercase">PELAYANAN TERPADU</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeData.pelayanan.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl font-bold text-gray-700 hover:bg-[#C21219] hover:text-white transition-all cursor-default group/pel">
                    <div className="w-2 h-2 bg-[#C21219] rounded-full group-hover/pel:bg-white transition-colors"></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Quote */}
        <div className="mt-16 text-center">
          <div className="max-w-4xl mx-auto p-12 bg-[#C21219] rounded-[3rem] shadow-2xl shadow-[#C21219]/20 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="relative z-10">
              <div className="text-white/40 text-6xl font-serif absolute -top-4 -left-2">"</div>
              <p className="text-2xl md:text-3xl font-bold italic text-white leading-relaxed px-6">
                {activeData.quote}
              </p>
              <div className="text-white/40 text-6xl font-serif absolute -bottom-12 -right-2 rotate-180">"</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

