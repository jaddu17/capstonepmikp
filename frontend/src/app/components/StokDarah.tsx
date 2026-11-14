import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Droplet, AlertCircle, Calendar, RefreshCw } from "lucide-react";
import { api } from "@/config/api";

interface BloodStockItem {
  id: string;
  type: string;
  wb: number;
  prc: number;
  tc: number;
  status: string;
}

export function StokDarah() {
  const [bloodStock, setBloodStock] = useState<BloodStockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBloodStock = useCallback((isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    api.get('/api/stok-darahs')
      .then(d => d.data || d)
      .then(data => {
        const rawList = Array.isArray(data) ? data : (data?.data || []);
        // Filter hanya tipe darah A, B, O, AB
        const filtered = rawList.filter((item: any) => ['A', 'B', 'O', 'AB'].includes(item.type));
        setBloodStock(filtered);

        // Ambil waktu pembaruan terakhir yang valid dari data database
        let latestDate: Date | null = null;
        for (const item of filtered) {
          const timestamp = item.updated_at || item.created_at;
          if (timestamp) {
            const itemDate = new Date(timestamp);
            if (!latestDate || itemDate > latestDate) {
              latestDate = itemDate;
            }
          }
        }
        if (latestDate) {
          setLastUpdated(latestDate);
        }
      })
      .catch(err => {
        console.error("Error fetching stok darah:", err);
      })
      .finally(() => {
        if (isInitial) setLoading(false);
        setIsRefreshing(false);
      });
  }, []);

  useEffect(() => {
    fetchBloodStock(true);

    // Polling setiap 60 detik (SOP Poin 5: efisiensi request dan tidak membebani database)
    const interval = setInterval(() => {
      // Hentikan polling jika tab browser sedang tidak dibuka oleh pengguna
      if (document.visibilityState === 'visible') {
        fetchBloodStock(false);
      }
    }, 60000);

    // Saat pengguna kembali fokus ke tab ini, refresh data terkini
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchBloodStock(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchBloodStock]);

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'A': return "bg-[#ffcc00] text-black border-2 border-white";
      case 'B': return "bg-[#cc0000] text-white border-2 border-white";
      case 'O': return "bg-[#3366ff] text-white border-2 border-white";
      case 'AB': return "bg-white text-black border-2 border-white";
      default: return "bg-white text-black";
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "STOK CUKUP") return "text-green-600 font-bold";
    return "text-red-600 font-bold";
  };

  return (
    <section id="stok-darah" className="py-16 bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Droplet className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Informasi Stok Darah</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stok darah terkini di PMI Kulon Progo. Data diperbarui secara otomatis dan real-time.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Memuat data stok darah...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-border mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-red-50 border-b border-red-100 gap-4">
              <div className="flex items-center gap-2 text-red-800 font-bold text-xs sm:text-sm">
                <Calendar className="w-4 h-4 text-red-700" />
                <span>Terakhir Diperbarui: {lastUpdated.toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric"
                }).toUpperCase()} | {lastUpdated.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB</span>
              </div>

              {/* Badge Indikator Real-Time */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100/90 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300 shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                  <span>LIVE REAL-TIME</span>
                </div>
                <button
                  type="button"
                  onClick={() => fetchBloodStock(false)}
                  title="Perbarui data sekarang"
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-700 transition-colors p-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-red-600' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-hidden rounded-b-xl border-x border-b border-gray-200">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-[#e31837] text-white">
                    <th className="py-4 px-4 font-bold border-r border-white border-b-2 align-middle w-1/5">GOLONGAN<br/>DARAH</th>
                    <th className="py-4 px-4 font-bold border-r border-white border-b-2 align-middle w-1/5">WB</th>
                    <th className="py-4 px-4 font-bold border-r border-white border-b-2 align-middle w-1/5">PRC</th>
                    <th className="py-4 px-4 font-bold border-r border-white border-b-2 align-middle w-1/5">TC</th>
                    <th className="py-4 px-4 font-bold border-b-2 align-middle w-1/5">KETERANGAN</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-100">
                  {bloodStock.map((item) => (
                    <tr key={item.id} className="bg-white">
                      <td className={`py-3 px-4 font-black text-2xl border border-gray-300 shadow-inner ${getTypeStyle(item.type)}`}>
                        {item.type}
                      </td>
                      <td className="py-3 px-4 font-bold text-2xl border border-gray-300 bg-white text-gray-800">
                        {item.wb}
                      </td>
                      <td className="py-3 px-4 font-bold text-2xl border border-gray-300 bg-white text-gray-800">
                        {item.prc}
                      </td>
                      <td className="py-3 px-4 font-bold text-2xl border border-gray-300 bg-white text-gray-800">
                        {item.tc}
                      </td>
                      <td className={`py-3 px-4 font-extrabold text-lg border border-gray-300 bg-white tracking-wide ${getStatusColor(item.status)}`}>
                        {item.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 text-sm text-gray-600 border-t border-border">
              <p className="italic mb-2 text-xs">*Stok darah dapat berubah sewaktu-waktu</p>
              <ul className="space-y-1">
                <li><strong>WB</strong> : Whole Blood (Darah Lengkap)</li>
                <li><strong>PRC</strong> : Packed Red Cell (Sel Darah Merah)</li>
                <li><strong>TC</strong> : Thrombocyte Concentrate (Trombosit)</li>
              </ul>
            </div>
          </div>
        )}

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">
                Dibutuhkan Donor Darah Segera!
              </h3>
              <p className="text-red-800 mb-4">
                Beberapa stok darah sedang menipis (Stok Kurang). Kami sangat membutuhkan partisipasi donor Anda untuk membantu sesama.
              </p>
              <Link
                to="/info-donor"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Lihat Syarat & Cara Donor
                <AlertCircle className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
