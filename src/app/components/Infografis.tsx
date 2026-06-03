import { useState, useEffect } from "react";
import { Phone, MessageCircle, Activity, Shield, Flame, Wind, Heart, Home, Camera, Info } from "lucide-react";
export function Infografis() {
  const [infografisList, setInfografisList] = useState<any[]>([]);
  const [activeData, setActiveData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/infografis')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setInfografisList(data);
          setActiveData(data[0]);
        } else if (data && !Array.isArray(data)) {
          setInfografisList([data]);
          setActiveData(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching infografis:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-12 text-white">Memuat Infografis...</div>;
  if (!activeData) return null;

  return (
    <section id="infografis" className="py-20 bg-gradient-to-br from-[#C41E3A] to-[#8B1529] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-4 py-1.5 bg-white/20 text-white rounded-full text-xs font-black uppercase tracking-[0.2em]">
            Transparansi & Akuntabilitas
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            INFOGRAFIS PMI KABUPATEN KULON PROGO
          </h2>
          
          <div className="flex flex-col items-center gap-4 mt-6">
            <div className="text-xl font-bold text-white/80 uppercase tracking-widest">
              Laporan Kinerja Bulan:
            </div>
            <select 
              value={activeData.id || ""}
              onChange={(e) => {
                const selected = infografisList.find(d => d.id === e.target.value);
                if (selected) setActiveData(selected);
              }}
              className="px-8 py-3 bg-white border-2 border-white rounded-2xl text-2xl font-black text-[#C41E3A] shadow-xl focus:ring-4 focus:ring-white/30 outline-none appearance-none cursor-pointer hover:bg-gray-50 transition-all text-center"
            >
              {infografisList.map(item => (
                <option key={item.id} value={item.id}>
                  {item.bulan} {item.tahun}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-[3rem] p-8 md:p-12 shadow-2xl flex flex-col h-full relative z-10">
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {[
              { label: "PERTOLONGAN PERTAMA", value: activeData.stats?.pertolongan_pertama || 0, icon: Heart, color: "text-red-600" },
              { label: "KECELAKAAN", value: activeData.stats?.kecelakaan || 0, icon: Activity, color: "text-orange-600" },
              { label: "KEBAKARAN", value: activeData.stats?.kebakaran || 0, icon: Flame, color: "text-amber-600" },
              { label: "BENCANA ALAM", value: activeData.stats?.bencana_alam || 0, icon: Wind, color: "text-blue-600" },
              { label: "EVAKUASI JENAZAH", value: activeData.stats?.evakuasi_jenazah || 0, icon: Shield, color: "text-slate-700" },
              { label: "HOME EMERGENCY", value: activeData.stats?.home_emergency || 0, icon: Home, color: "text-emerald-600" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center group p-4 bg-gray-50 rounded-2xl hover:bg-red-50 transition-colors border border-gray-100">
                <div className="text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest">{stat.label}</div>
                <div className={`text-4xl font-black ${stat.color} mb-2`}>{stat.value}</div>
                <div className="flex justify-center">
                  <stat.icon className={`w-5 h-5 ${stat.color} opacity-30`} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Pelayanan & Kontak */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Info className="w-6 h-6 text-[#C41E3A]" />
                  <h3 className="text-xl font-black text-gray-900 uppercase">PELAYANAN TERPADU</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeData.pelayanan?.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl font-bold text-gray-700 hover:bg-[#C41E3A] hover:text-white transition-all">
                      <div className="w-2 h-2 bg-[#C41E3A] rounded-full"></div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black text-[#C41E3A] uppercase tracking-widest mb-4">Layanan Darurat 24 Jam</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-[#C41E3A] text-white rounded-xl flex items-center justify-center shadow-lg"><Phone className="w-5 h-5" /></div>
                    <div className="text-xs font-bold text-gray-400 uppercase">Markas</div>
                    <div className="text-lg font-black text-gray-900">{activeData.kontak?.markas || '-'}</div>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg"><Activity className="w-5 h-5" /></div>
                    <div className="text-xs font-bold text-gray-400 uppercase">Ambulance</div>
                    <div className="text-lg font-black text-gray-900">{activeData.kontak?.ambulance || '-'}</div>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg"><MessageCircle className="w-5 h-5" /></div>
                    <div className="text-xs font-bold text-gray-400 uppercase">WhatsApp</div>
                    <div className="text-lg font-black text-gray-900">{activeData.kontak?.whatsapp || '-'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Dokumentasi */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Camera className="w-6 h-6 text-[#C41E3A]" />
                <h3 className="text-xl font-black text-gray-900 uppercase">DOKUMENTASI</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {activeData.dokumentasi?.filter((img: string | null) => img).map((img: string, idx: number) => (
                  <div key={idx} className="aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden group relative shadow-md border border-gray-200">
                    <img 
                      src={img} 
                      alt={`Dokumentasi ${idx + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ))}
              </div>
              {(!activeData.dokumentasi || activeData.dokumentasi.filter((img: string | null) => img).length === 0) && (
                <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                  Belum ada dokumentasi
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Quote */}
        <div className="mt-16 text-center">
          <div className="max-w-4xl mx-auto p-12 bg-[#C41E3A] rounded-[3rem] shadow-2xl shadow-[#C41E3A]/20 relative overflow-hidden group">
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

