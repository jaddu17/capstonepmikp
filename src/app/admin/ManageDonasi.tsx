import { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Trash2, Calendar, User, Phone, MessageSquare, CheckCircle, Clock, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface Donation {
  id: string;
  nama: string;
  wa: string;
  keterangan: string;
  proof: string | null;
  date: string;
  status: string;
}

export function ManageDonasi() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  useEffect(() => {
    const savedDonations = localStorage.getItem("pmi_donations");
    if (savedDonations) {
      setDonations(JSON.parse(savedDonations));
    }
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data donasi ini?")) {
      const updated = donations.filter((d) => d.id !== id);
      setDonations(updated);
      localStorage.setItem("pmi_donations", JSON.stringify(updated));
      toast.success("Data berhasil dihapus!");
    }
  };

  const toggleStatus = (id: string) => {
    const updated = donations.map((d) => {
      if (d.id === id) {
        return { ...d, status: d.status === "Selesai" ? "Sudah Bayar" : "Selesai" };
      }
      return d;
    });
    setDonations(updated);
    localStorage.setItem("pmi_donations", JSON.stringify(updated));
    toast.success("Status donasi diperbarui!");
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-2">Laporan Donasi Masuk</h1>
          <p className="text-muted-foreground">
            Daftar donasi yang masuk melalui website beserta bukti transfer.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Donatur</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kontak</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Keterangan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bukti Transfer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {donations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    Belum ada data donasi masuk.
                  </td>
                </tr>
              ) : (
                donations.map((don) => (
                  <tr key={don.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" /> {don.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{don.nama || "Hamba Allah"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-blue-600 font-medium">{don.wa || "-"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600 max-w-[200px] leading-relaxed">
                        {don.keterangan || <span className="text-gray-400 italic">Tanpa pesan</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {don.proof ? (
                        <button
                          onClick={() => setSelectedProof(don.proof)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                        >
                          <Upload className="w-3 h-3" /> Lihat Bukti
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Belum Upload</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(don.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold ${
                          don.status === "Selesai" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {don.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(don.id)}
                        className="text-red-500 hover:text-red-700 p-2 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for viewing proof */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold">Bukti Transfer</h3>
              <button 
                onClick={() => setSelectedProof(null)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 bg-gray-50 flex justify-center">
              <img 
                src={selectedProof} 
                alt="Bukti Transfer" 
                className="max-h-[70vh] rounded-lg shadow-md"
              />
            </div>
            <div className="p-4 border-t border-border text-right">
              <button 
                onClick={() => setSelectedProof(null)}
                className="px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
