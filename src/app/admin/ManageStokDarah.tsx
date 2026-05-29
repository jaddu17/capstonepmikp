import { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface BloodStock {
  id: string;
  type: string;
  stock: number;
  status: string;
}

export function ManageStokDarah() {
  const [bloodStock, setBloodStock] = useState<BloodStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stok-darahs')
      .then(res => res.json())
      .then(data => {
        setBloodStock(data.map((item: any) => ({
          ...item,
          id: item.id.toString(),
        })));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching stok darah:", err);
        setLoading(false);
      });
  }, []);

  const updateStock = (index: number, value: number) => {
    const newStock = [...bloodStock];
    newStock[index].stock = value;

    if (value >= 20) {
      newStock[index].status = "aman";
    } else if (value >= 10) {
      newStock[index].status = "menipis";
    } else {
      newStock[index].status = "kritis";
    }

    setBloodStock(newStock);
  };

  const handleSave = () => {
    const updates = bloodStock.map(item => ({
      id: parseInt(item.id),
      stock: item.stock,
      status: item.status,
    }));

    fetch('/api/stok-darahs/bulk-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(updates),
    })
    .then(res => res.json())
    .then(data => {
      setBloodStock(data.map((item: any) => ({ ...item, id: item.id.toString() })));
      toast.success("Stok darah berhasil diperbarui!");
    })
    .catch(err => {
      console.error(err);
      toast.error("Gagal menyimpan stok darah.");
    });
  };

  const getStatusColor = (status: string) => {
    if (status === "aman") return "bg-green-100 text-green-800 border-green-200";
    if (status === "menipis") return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Kelola Stok Darah</h1>
        <p className="text-muted-foreground">
          Update stok darah untuk ditampilkan di website
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-yellow-800">
          <strong>Catatan:</strong> Data stok darah harus diupdate maksimal tanggal 10 setiap bulan.
          Status otomatis berubah berdasarkan jumlah: Aman (&ge;20), Menipis (10-19), Kritis (&lt;10).
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Memuat data stok darah...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bloodStock.map((item, index) => (
                <div
                  key={item.id}
                  className="border border-border rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {item.type}
                    </div>
                    <div
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Jumlah Kantong
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={item.stock}
                      onChange={(e) => updateStock(index, parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-border rounded-lg text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border p-6 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Terakhir diupdate: {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <button
              onClick={handleSave}
              className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-[#C21219] transition-colors flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
