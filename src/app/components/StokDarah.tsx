import { useState, useEffect } from "react";
import { Droplet, AlertCircle, CheckCircle } from "lucide-react";

interface BloodStockItem {
  id: string;
  type: string;
  stock: number;
  status: string;
}

export function StokDarah() {
  const [bloodStock, setBloodStock] = useState<BloodStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stok-darahs')
      .then(res => res.json())
      .then(data => {
        setBloodStock(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching stok darah:", err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "aman") return "bg-green-100 text-green-800 border-green-200";
    if (status === "menipis") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getStatusIcon = (status: string) => {
    if (status === "aman") return <CheckCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <section id="stok-darah" className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Droplet className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Stok Darah Real-Time</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Informasi stok darah terkini di PMI Kulon Progo.
            Data diperbarui setiap hari maksimal tanggal 10 setiap bulan.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Memuat data stok darah...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {bloodStock.map((item) => (
              <div
                key={item.type}
                className="bg-white rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {item.type}
                  </div>
                  <div className="text-4xl font-bold mb-3">{item.stock}</div>
                  <div className="text-sm text-muted-foreground mb-3">kantong</div>
                  <div
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {getStatusIcon(item.status)}
                    <span className="capitalize">{item.status}</span>
                  </div>
                </div>
              </div>
            ))}
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
                Stok darah golongan AB-, B-, dan O- sedang menipis. Kami membutuhkan donor darah untuk golongan tersebut.
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
