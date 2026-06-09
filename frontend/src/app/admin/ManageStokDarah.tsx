import { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface BloodStock {
  id: string;
  type: string;
  wb: number;
  prc: number;
  tc: number;
  status: string;
}

export function ManageStokDarah() {
  const [bloodStock, setBloodStock] = useState<BloodStock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stok-darahs')
      .then(res => res.json())
      .then(data => {
        // Filter hanya tipe darah A, B, O, AB
        const filtered = data.filter((item: any) => ['A', 'B', 'O', 'AB'].includes(item.type));
        setBloodStock(filtered.map((item: any) => ({
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

  const updateStock = (index: number, field: 'wb' | 'prc' | 'tc', value: number) => {
    const newStock = [...bloodStock];
    newStock[index][field] = value;

    const { type, wb, prc } = newStock[index];
    const total = wb + prc;

    if (type === 'AB') {
      newStock[index].status = total <= 10 ? "STOK KURANG" : "STOK CUKUP";
    } else {
      newStock[index].status = total <= 30 ? "STOK KURANG" : "STOK CUKUP";
    }

    setBloodStock(newStock);
  };

  const handleSave = () => {
    const updates = bloodStock.map(item => ({
      id: parseInt(item.id),
      wb: item.wb,
      prc: item.prc,
      tc: item.tc,
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
    if (status === "STOK CUKUP") return "bg-green-100 text-green-800 border-green-200";
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
          <strong>Catatan Otomatis:</strong> Data stok darah harus diupdate maksimal tanggal 10 setiap bulan.
          Status otomatis berubah berdasarkan jumlah WB + PRC: 
          <strong> Golongan A, B, O </strong>(&le;30 = Menipis/Kurang), 
          <strong> Golongan AB </strong>(&le;10 = Menipis/Kurang).
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
                  className="border border-border rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {item.type}
                    </div>
                    <div
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}
                    >
                      {item.status}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-sm font-medium w-12 text-muted-foreground">WB</label>
                      <input
                        type="number"
                        min="0"
                        value={item.wb}
                        onChange={(e) => updateStock(index, 'wb', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-border rounded-lg text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-sm font-medium w-12 text-muted-foreground">PRC</label>
                      <input
                        type="number"
                        min="0"
                        value={item.prc}
                        onChange={(e) => updateStock(index, 'prc', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-border rounded-lg text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <label className="text-sm font-medium w-12 text-muted-foreground">TC</label>
                      <input
                        type="number"
                        min="0"
                        value={item.tc}
                        onChange={(e) => updateStock(index, 'tc', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-border rounded-lg text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
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
