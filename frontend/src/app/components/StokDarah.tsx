import { useState, useEffect } from "react";
import { Droplet, AlertCircle, Calendar } from "lucide-react";

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

  useEffect(() => {
    fetch('/api/stok-darahs')
      .then(res => res.json())
      .then(data => {
        // Filter hanya tipe darah A, B, O, AB
        const filtered = data.filter((item: any) => ['A', 'B', 'O', 'AB'].includes(item.type));
        setBloodStock(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching stok darah:", err);
        setLoading(false);
      });
  }, []);

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
            Stok darah terkini di PMI Kulon Progo. Data diperbarui secara real-time.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Memuat data stok darah...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-border mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-red-50 border-b border-red-100 gap-4">
              <div className="flex items-center gap-2 text-red-800 font-bold">
                <Calendar className="w-5 h-5" />
                {new Date().toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric"
                }).toUpperCase()} | {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
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
              <a
                href="#info-donor"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Lihat Syarat & Cara Donor
                <AlertCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
