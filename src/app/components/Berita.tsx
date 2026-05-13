import { useState, useEffect } from "react";
import { Calendar, ArrowRight, X, Clock, Tag, Share2 } from "lucide-react";

interface NewsItem {
  id?: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  published: boolean;
}

export function Berita() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    const savedNews = localStorage.getItem("pmi_news_data");
    if (savedNews) {
      const parsed = JSON.parse(savedNews);
      // Filter only published news for public view
      setNewsList(parsed.filter((n: any) => n.published !== false));
    } else {
      // Default data if none in localStorage
      const defaultNews = [
        {
          title: "PMI Kulon Progo Berhasil Kumpulkan 250 Kantong Darah",
          date: "8 Mei 2026",
          category: "Donor Darah",
          excerpt: "Kegiatan donor darah masal di Alun-Alun Wates berhasil mengumpulkan 250 kantong darah dari masyarakat Kulon Progo.",
          content: "PMI Kulon Progo melaksanakan kegiatan donor darah masal di Alun-Alun Wates pada hari Sabtu lalu. Antusiasme masyarakat sangat tinggi, terlihat dari banyaknya warga yang datang sejak pagi hari. Tim medis PMI bekerja keras melayani para pendonor dengan tetap menjaga protokol kesehatan. Total 250 kantong darah berhasil dikumpulkan untuk menambah stok darah di Kulon Progo.",
          image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&h=500&fit=crop",
          published: true,
        },
        {
          title: "Pelatihan Pertolongan Pertama untuk Relawan PMI",
          date: "5 Mei 2026",
          category: "Pelatihan",
          excerpt: "50 relawan PMI mengikuti pelatihan pertolongan pertama pada kecelakaan (P3K) yang diselenggarakan di kantor PMI Kulon Progo.",
          content: "Pusat Pendidikan dan Pelatihan PMI Kulon Progo menyelenggarakan pelatihan P3K intensif selama tiga hari. Relawan diajarkan teknik-teknik dasar penyelamatan nyawa, penanganan luka, hingga evakuasi korban. Pelatihan ini bertujuan untuk meningkatkan kesiapsiagaan relawan dalam menghadapi situasi darurat di lapangan.",
          image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop",
          published: true,
        }
      ];
      setNewsList(defaultNews);
    }
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Donor Darah": "bg-red-100 text-red-800",
      Pelatihan: "bg-blue-100 text-blue-800",
      "Tanggap Darurat": "bg-orange-100 text-orange-800",
      Rekrutmen: "bg-green-100 text-green-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <section id="berita" className="py-20 bg-gray-50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold mb-4 uppercase tracking-widest">
            Update Terbaru
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Berita & Kegiatan Terkini</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Ikuti perkembangan terbaru mengenai program kemanusiaan dan aksi relawan PMI Kulon Progo.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {newsList.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="aspect-[16/10] bg-gray-200 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-lg ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-4 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3 leading-relaxed">
                  {item.excerpt}
                </p>
                <button 
                  onClick={() => setSelectedNews(item)}
                  className="w-full py-3.5 bg-gray-50 text-gray-900 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white transition-all shadow-sm"
                >
                  Baca Selengkapnya
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Content Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-gray-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedNews(null)}
              className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/90 hover:bg-white text-gray-900 rounded-full flex items-center justify-center shadow-xl transition-all hover:rotate-90 group"
            >
              <X className="w-6 h-6 group-hover:scale-110" />
            </button>

            <div className="overflow-y-auto custom-scrollbar">
              <div className="aspect-[21/9] w-full overflow-hidden">
                <img 
                  src={selectedNews.image} 
                  alt={selectedNews.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-8 md:p-16">
                <div className="flex flex-wrap items-center gap-6 mb-8">
                  <div className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/5 px-4 py-2 rounded-full">
                    <Tag className="w-4 h-4" />
                    {selectedNews.category}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {selectedNews.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    5 Menit Baca
                  </div>
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-10 leading-[1.1] tracking-tight">
                  {selectedNews.title}
                </h2>

                <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-6">
                  {selectedNews.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="text-xl">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      PMI
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Admin PMI Kulon Progo</div>
                      <div className="text-sm text-muted-foreground">Departemen Humas & Komunikasi</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-2xl font-bold text-sm transition-all">
                      <Share2 className="w-4 h-4" />
                      Bagikan
                    </button>
                    <button 
                      onClick={() => setSelectedNews(null)}
                      className="px-10 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-[#C21219] transition-all shadow-lg hover:shadow-primary/20"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

