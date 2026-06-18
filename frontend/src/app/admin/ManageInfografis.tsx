import { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Save, RefreshCw, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface InfografisData {
  id: string;
  bulan: string;
  tahun: string;
  kontak: {
    markas: string;
    ambulance: string;
    whatsapp: string;
  };
  stats: {
    pertolongan_pertama: number;
    kecelakaan: number;
    kebakaran: number;
    bencana_alam: number;
    evakuasi_jenazah: number;
    home_emergency: number;
  };
  dokumentasi: string[];
  pelayanan: string[];
  quote: string;
}

export function ManageInfografis() {
  const [infografisList, setInfografisList] = useState<InfografisData[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const defaultData: InfografisData = {
    id: "default",
    bulan: "MEI",
    tahun: "2026",
    kontak: {
      markas: "0274 773244",
      ambulance: "0274 7724533",
      whatsapp: "0813 2886 1118"
    },
    stats: {
      pertolongan_pertama: 0,
      kecelakaan: 0,
      kebakaran: 0,
      bencana_alam: 0,
      evakuasi_jenazah: 0,
      home_emergency: 0
    },
    dokumentasi: ["", "", "", "", "", ""],
    pelayanan: ["PERTOLONGAN PERTAMA", "PELAYANAN AMBULANCE"],
    quote: "Menjadi relawan bukan tentang seberapa besar bantuan yang diberi, tetapi seberapa tulus hati yang tergerak."
  };

  useEffect(() => {
    fetch('/api/infografis')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const formatted = data.map((d: any) => ({
            ...d,
            id: d.id.toString(),
            kontak: typeof d.kontak === 'string' ? JSON.parse(d.kontak) : d.kontak,
            stats: typeof d.stats === 'string' ? JSON.parse(d.stats) : d.stats,
            dokumentasi: typeof d.dokumentasi === 'string' ? JSON.parse(d.dokumentasi) : d.dokumentasi,
            pelayanan: typeof d.pelayanan === 'string' ? JSON.parse(d.pelayanan) : d.pelayanan
          }));
          setInfografisList(formatted);
          setActiveId(formatted[0].id);
        } else {
          // If completely empty, use default data
          const initial = [{ ...defaultData, id: Date.now().toString() }];
          setInfografisList(initial);
          setActiveId(initial[0].id);
        }
      })
      .catch(err => console.error("Error fetching infografis:", err));
  }, []);

  const activeData = infografisList.find(d => d.id === activeId) || defaultData;

  const handleSave = () => {
    const url = activeId.startsWith("new-") ? '/api/infografis' : `/api/infografis/${activeId}`;
    const method = activeId.startsWith("new-") ? 'POST' : 'PUT';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(activeData)
    })
    .then(res => res.json())
    .then(data => {
      const formatted = {
        ...data,
        id: data.id.toString(),
        kontak: typeof data.kontak === 'string' ? JSON.parse(data.kontak) : data.kontak,
        stats: typeof data.stats === 'string' ? JSON.parse(data.stats) : data.stats,
        dokumentasi: typeof data.dokumentasi === 'string' ? JSON.parse(data.dokumentasi) : data.dokumentasi,
        pelayanan: typeof data.pelayanan === 'string' ? JSON.parse(data.pelayanan) : data.pelayanan
      };
      setInfografisList(infografisList.map(d => d.id === activeId ? formatted : d));
      if (activeId.startsWith("new-")) {
        setActiveId(formatted.id);
      }
      toast.success("Data infografis berhasil disimpan!");
    })
    .catch(err => {
      console.error(err);
      toast.error("Gagal menyimpan data.");
    });
  };

  const handleAddNew = () => {
    const newId = `new-${Date.now()}`;
    const newData = { ...defaultData, id: newId, bulan: "BARU", tahun: new Date().getFullYear().toString() };
    setInfografisList([newData, ...infografisList]);
    setActiveId(newId);
    toast.success("Data bulan baru ditambahkan, jangan lupa Simpan Semua!");
  };

  const handleDelete = (id: string) => {
    if (infografisList.length <= 1) {
      toast.error("Minimal harus ada satu data infografis.");
      return;
    }
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.startsWith("new-")) {
        const updated = infografisList.filter(d => d.id !== itemToDelete);
        setInfografisList(updated);
        setActiveId(updated[0].id);
        toast.success("Data berhasil dihapus!");
        setDeleteModalOpen(false);
        setItemToDelete(null);
      } else {
        fetch(`/api/infografis/${itemToDelete}`, { method: 'DELETE' })
        .then(() => {
          const updated = infografisList.filter(d => d.id !== itemToDelete);
          setInfografisList(updated);
          setActiveId(updated[0].id);
          toast.success("Data berhasil dihapus dari database!");
        })
        .catch(err => console.error(err))
        .finally(() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        });
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const updateActiveData = (newData: Partial<InfografisData>) => {
    setInfografisList(infografisList.map(d => 
      d.id === activeId ? { ...d, ...newData } : d
    ));
  };

  const updateStat = (key: keyof InfografisData["stats"], value: string) => {
    updateActiveData({
      stats: {
        ...activeData.stats,
        [key]: parseInt(value) || 0
      }
    });
  };

  const updateKontak = (key: keyof InfografisData["kontak"], value: string) => {
    updateActiveData({
      kontak: {
        ...activeData.kontak,
        [key]: value
      }
    });
  };

  const handleAddPelayanan = () => {
    updateActiveData({
      pelayanan: [...activeData.pelayanan, "Pelayanan Baru"]
    });
  };

  const handleRemovePelayanan = (index: number) => {
    updateActiveData({
      pelayanan: activeData.pelayanan.filter((_, i) => i !== index)
    });
  };

  const handleUpdatePelayanan = (index: number, value: string) => {
    const newPelayanan = [...activeData.pelayanan];
    newPelayanan[index] = value;
    updateActiveData({ pelayanan: newPelayanan });
  };

  const handleUpdateDokumentasi = (index: number, value: string) => {
    const newDok = [...activeData.dokumentasi];
    newDok[index] = value;
    updateActiveData({ dokumentasi: newDok });
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Kelola Infografis</h1>
          <select 
            value={activeId}
            onChange={(e) => setActiveId(e.target.value)}
            className="px-4 py-2 bg-white border border-border rounded-lg font-bold text-primary focus:ring-2 focus:ring-primary/20 outline-none shadow-sm"
          >
            {infografisList.map(item => (
              <option key={item.id} value={item.id}>
                {item.bulan} {item.tahun}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddNew}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Bulan Baru
          </button>
          <button
            onClick={() => handleDelete(activeId)}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Hapus
          </button>
          <button
            onClick={handleSave}
            className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-[#C21219] transition-all shadow-lg hover:shadow-primary/20 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Simpan Semua
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Basic Info & Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <h3 className="font-bold mb-4 text-lg border-b pb-2">Informasi Umum</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bulan</label>
                <input
                  type="text"
                  value={activeData.bulan}
                  onChange={(e) => updateActiveData({ bulan: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tahun</label>
                <input
                  type="text"
                  value={activeData.tahun}
                  onChange={(e) => updateActiveData({ tahun: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <h3 className="font-bold mb-4 text-lg border-b pb-2">Kontak Markas</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Markas</label>
                <input
                  type="text"
                  value={activeData.kontak.markas}
                  onChange={(e) => updateKontak("markas", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Unit Ambulance</label>
                <input
                  type="text"
                  value={activeData.kontak.ambulance}
                  onChange={(e) => updateKontak("ambulance", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Whatsapp</label>
                <input
                  type="text"
                  value={activeData.kontak.whatsapp}
                  onChange={(e) => updateKontak("whatsapp", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <h3 className="font-bold mb-4 text-lg border-b pb-2">Statistik Layanan</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(activeData.stats).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-bold mb-2 uppercase text-gray-500">
                    {key.replace(/_/g, " ")}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => updateStat(key as any, e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Documentation & Pelayanan */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <h3 className="font-bold mb-4 text-lg border-b pb-2">Dokumentasi (Upload Gambar)</h3>
            <div className="grid grid-cols-2 gap-4">
              {activeData.dokumentasi.map((url, idx) => (
                <div key={idx} className="relative group/doc">
                  <div className="aspect-video bg-gray-100 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden relative">
                    {url ? (
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <Plus className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-bold">Upload Foto {idx + 1}</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            handleUpdateDokumentasi(idx, reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                  </div>
                  {url && (
                    <button 
                      onClick={() => handleUpdateDokumentasi(idx, "")}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/doc:opacity-100 transition-opacity z-20"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="font-bold text-lg">Daftar Pelayanan</h3>
              <button
                onClick={handleAddPelayanan}
                className="text-primary hover:text-[#C21219] p-1"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              {activeData.pelayanan.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleUpdatePelayanan(idx, e.target.value)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg"
                  />
                  <button
                    onClick={() => handleRemovePelayanan(idx)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <h3 className="font-bold mb-4 text-lg border-b pb-2">Kata-kata Hari Ini (Quote)</h3>
            <textarea
              value={activeData.quote}
              onChange={(e) => updateActiveData({ quote: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-border rounded-lg resize-none"
              placeholder="Tulis kata-kata motivasi atau info penting hari ini..."
            />
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 transform transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-500 mb-6">
              Apakah Anda yakin ingin menghapus data bulan ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
