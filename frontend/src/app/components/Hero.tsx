import { useState, useEffect } from "react";
import { Heart, Droplet, Users, TrendingUp, PhoneCall, ChevronLeft, ChevronRight } from "lucide-react";
import { CuacaBadge } from "./CuacaBadge";
import { SITE_CONFIG } from "@/config/site";
import { api, getStorageUrl } from "@/config/api";

const DEFAULT_HERO_SLIDES = [
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1600",
];

// In-memory cache agar status slide dan nomor urut bertahan saat berpindah halaman (misal ke Stok Darah lalu kembali)
let cachedSlides: string[] | null = null;
let cachedCurrentIndex: number = 0;
let cachedKontak: { telepon: string; teleponRaw: string; whatsapp: string; whatsappLink: string } | null = null;

export function resetHeroSlidesCache() {
  cachedSlides = null;
}

export function Hero() {
  const [slides, setSlides] = useState<string[]>(() => cachedSlides || DEFAULT_HERO_SLIDES);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(() => cachedCurrentIndex || 0);
  const [isSliding, setIsSliding] = useState(false);
  const [kontak, setKontak] = useState(() => cachedKontak || {
    telepon: "(0274) 773244",
    teleponRaw: "0274773244",
    whatsapp: SITE_CONFIG.whatsapp,
    whatsappLink: SITE_CONFIG.whatsappLink,
  });

  const stats = [
    { icon: Droplet, label: "Kantong Darah/Bulan", value: "1,200+" },
    { icon: Users, label: "Pendonor Aktif", value: "5,000+" },
    { icon: Heart, label: "Layanan/Bulan", value: "150+" },
    { icon: TrendingUp, label: "Tahun Melayani", value: "25+" },
  ];

  // Helper untuk navigasi slide manual
  const changeSlide = (newIndex: number) => {
    if (newIndex === currentSlideIndex || isSliding) return;
    setIsSliding(true);
    setCurrentSlideIndex(newIndex);
    cachedCurrentIndex = newIndex;
    setTimeout(() => {
      setIsSliding(false);
    }, 700);
  };

  const nextSlide = () => {
    changeSlide((currentSlideIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    changeSlide((currentSlideIndex - 1 + slides.length) % slides.length);
  };

  // Preload gambar agar tidak ada network abort saat navigasi dan pergantian slide selalu instan
  useEffect(() => {
    slides.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [slides]);

  // Fungsi sinkronisasi data infografis & foto slider dengan server
  const fetchHeroData = () => {
    api.get('/api/infografis')
      .then(d => d.data || d)
      .then(data => {
        const rawList = Array.isArray(data) ? data : (data?.data ? data.data : [data]);
        if (Array.isArray(rawList) && rawList.length > 0) {
          const list = rawList.map((d: any) => {
            let dok = d.dokumentasi;
            if (typeof dok === 'string') {
              try { dok = JSON.parse(dok); } catch { dok = []; }
            }
            let k = d.kontak;
            if (typeof k === 'string') {
              try { k = JSON.parse(k); } catch { k = {}; }
            }
            return {
              ...d,
              dokumentasi: Array.isArray(dok) ? dok.filter((img: string) => img && img.trim() !== '') : [],
              kontak: k || {},
            };
          });

          // Prioritas 1 & 2: Cari laporan terbaru yang memiliki foto dokumentasi
          const reportWithPhotos = list.find((item: any) => item.dokumentasi.length > 0);
          if (reportWithPhotos && reportWithPhotos.dokumentasi.length > 0) {
            const resolvedUrls = reportWithPhotos.dokumentasi.map((path: string) => getStorageUrl(path));
            const hasChanged = !cachedSlides || JSON.stringify(cachedSlides) !== JSON.stringify(resolvedUrls);
            if (hasChanged) {
              cachedSlides = resolvedUrls;
              setSlides(resolvedUrls);
              setCurrentSlideIndex(prev => (prev >= resolvedUrls.length ? 0 : prev));
            }
          }

          // Sinkronisasi kontak darurat dengan laporan terbaru
          const latestReport = list[0];
          if (latestReport && latestReport.kontak) {
            const tel = latestReport.kontak.markas || latestReport.kontak.ambulance;
            const wa = latestReport.kontak.whatsapp;
            const newKontak = {
              telepon: tel || "(0274) 773244",
              teleponRaw: tel ? tel.replace(/[^0-9]/g, "") : "0274773244",
              whatsapp: wa || SITE_CONFIG.whatsapp,
              whatsappLink: wa ? `https://wa.me/62${wa.replace(/^0+/, "").replace(/[^0-9]/g, "")}` : SITE_CONFIG.whatsappLink,
            };
            cachedKontak = newKontak;
            setKontak(newKontak);
          }
        }
      })
      .catch(err => {
        console.warn("Hero fallback to default slides:", err);
      });
  };

  // Ambil foto dokumentasi dan sinkronkan secara realtime saat admin mengupdate data atau tab aktif
  useEffect(() => {
    fetchHeroData();

    const handleSync = () => fetchHeroData();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'pmi_infografis_last_updated') {
        fetchHeroData();
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchHeroData();
      }
    };

    window.addEventListener('focus', handleSync);
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('pmi-infografis-updated', handleSync);

    return () => {
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('pmi-infografis-updated', handleSync);
    };
  }, []);

  // Timer auto-slide berganti setiap 5 detik dengan efek memanjang hanya saat geser
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIsSliding(true);
      setCurrentSlideIndex((prev) => {
        const next = (prev + 1) % slides.length;
        cachedCurrentIndex = next;
        return next;
      });
      setTimeout(() => {
        setIsSliding(false);
      }, 700);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section id="beranda" className="relative text-white overflow-hidden min-h-[580px] flex flex-col justify-between">
      <CuacaBadge />

      {/* Background Hero Slider with Smooth Cross-Fade */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {slides.map((slideUrl, idx) => (
          <div
            key={slideUrl}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlideIndex ? "opacity-100 z-0" : "opacity-0 -z-10 pointer-events-none"
            }`}
          >
            <img
              src={slideUrl}
              alt={`Dokumentasi PMI ${idx + 1}`}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000 ease-out"
              loading="eager"
            />
          </div>
        ))}
      </div>

      {/* Red & Dark Overlay for Optimal Readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C21219]/85 via-[#9E1424]/90 to-[#6E0B19]/95 mix-blend-multiply pointer-events-none"></div>
      <div className="absolute inset-0 bg-black/25 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#8B1529] via-transparent to-black/30 pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16 flex flex-col items-center justify-center flex-1">
        <div className="text-center w-full max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-md">
            PMI Kulon Progo
          </h1>
          <p className="text-xl sm:text-2xl mb-6 text-white/95 font-semibold drop-shadow-sm">
            Palang Merah Indonesia Cabang Kulon Progo
          </p>
          <p className="text-base sm:text-lg mb-10 text-white/85 max-w-2xl mx-auto drop-shadow-sm leading-relaxed">
            Berkomitmen untuk kemanusiaan melalui donor darah, tanggap darurat,
            dan layanan sosial untuk masyarakat Kulon Progo
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            {/* Panggilan Darurat */}
            <a
              href={`tel:${kontak.teleponRaw}`}
              className="bg-white text-[#C21219] px-6 py-3.5 rounded-2xl font-black shadow-xl hover:scale-105 hover:bg-red-50 transition-all flex items-center gap-3 border-b-4 border-red-200 group animate-in slide-in-from-bottom-4"
            >
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <PhoneCall className="w-5 h-5 text-[#C21219] animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Panggilan Darurat</div>
                <div className="text-xl leading-none">{kontak.telepon}</div>
              </div>
            </a>
            
            {/* WhatsApp */}
            <a
              href={kontak.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#C21219] px-6 py-3.5 rounded-2xl font-black shadow-xl hover:scale-105 hover:bg-red-50 transition-all flex items-center gap-3 border-b-4 border-red-200 group animate-in slide-in-from-bottom-4 delay-75"
            >
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <PhoneCall className="w-5 h-5 text-[#C21219]" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">WhatsApp Admin</div>
                <div className="text-xl leading-none">{kontak.whatsapp}</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Tombol Navigasi Panah Kiri & Kanan (Floating Minimalis) */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/25 hover:bg-black/50 text-white/80 hover:text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg cursor-pointer"
            title="Foto Sebelumnya"
            aria-label="Foto Sebelumnya"
          >
            <ChevronLeft className="w-6 h-6 -translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/25 hover:bg-black/50 text-white/80 hover:text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg cursor-pointer"
            title="Foto Berikutnya"
            aria-label="Foto Berikutnya"
          >
            <ChevronRight className="w-6 h-6 translate-x-0.5" />
          </button>
        </>
      )}

      {/* Stats Section */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 border-t border-white/10 pt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-xs">
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