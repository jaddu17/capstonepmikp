import { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface Schedule {
  id: string;
  date: string;
  day: string;
  location: string;
  time: string;
  quota: string;
}

export function ManageJadwal() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jadwal-donors')
      .then(res => res.json())
      .then(data => {
        setSchedules(data.map((item: any) => ({ ...item, id: item.id.toString() })));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching jadwal:", err);
        setLoading(false);
      });
  }, []);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Schedule, "id">>({
    date: "",
    day: "",
    location: "",
    time: "",
    quota: "",
  });

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({ date: "", day: "", location: "", time: "", quota: "" });
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingId(schedule.id);
    setFormData({
      date: schedule.date,
      day: schedule.day,
      location: schedule.location,
      time: schedule.time,
      quota: schedule.quota,
    });
  };

  const handleSave = () => {
    const isEdit = !!editingId;
    const url = isEdit ? `/api/jadwal-donors/${editingId}` : '/api/jadwal-donors';
    const method = isEdit ? 'PUT' : 'POST';
    const token = localStorage.getItem("admin_token");

    fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData),
    })
    .then(async res => {
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        
        let errorMessage = errData.message || 'Gagal menyimpan data jadwal';
        if (errorMessage === "Unauthenticated.") {
          errorMessage = "Sesi Anda telah berakhir, silakan login kembali.";
        } else if (res.status === 404 || errorMessage.includes("could not be found") || errorMessage.includes("No query results")) {
          errorMessage = "Data jadwal tidak ditemukan atau sudah dihapus dari sistem.";
        }

        throw new Error(errorMessage);
      }
      return res.json();
    })
    .then(data => {
      const formatted = { ...data, id: data.id?.toString() || editingId || Date.now().toString() };
      if (isEdit) {
        setSchedules(schedules.map(s => s.id === editingId ? formatted : s));
        toast.success("Jadwal berhasil diperbarui!");
        setEditingId(null);
      } else {
        setSchedules([...schedules, formatted]);
        toast.success("Jadwal berhasil ditambahkan!");
        setIsAdding(false);
      }
      setFormData({ date: "", day: "", location: "", time: "", quota: "" });
    })
    .catch(err => {
      console.error(err);
      toast.error(err.message || "Gagal menyimpan jadwal.");
    });
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      const token = localStorage.getItem("admin_token");
      fetch(`/api/jadwal-donors/${itemToDelete}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(async res => {
        if (!res.ok) {
          throw new Error('Gagal menghapus data jadwal');
        }
        setSchedules(schedules.filter(s => s.id !== itemToDelete));
        toast.success("Jadwal berhasil dihapus!");
      })
      .catch(err => {
        console.error(err);
        toast.error(err.message || "Gagal menghapus jadwal.");
      })
      .finally(() => {
        setDeleteModalOpen(false);
        setItemToDelete(null);
      });
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ date: "", day: "", location: "", time: "", quota: "" });
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Kelola Jadwal Donor Darah</h1>
          <p className="text-muted-foreground">
            Tambah, edit, atau hapus jadwal mobile unit donor darah
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={handleAdd}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-[#C21219] transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tambah Jadwal
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 mb-6">
          <h3 className="font-semibold mb-4">
            {editingId ? "Edit Jadwal" : "Tambah Jadwal Baru"}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tanggal</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="12 Mei 2026"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hari</label>
              <input
                type="text"
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Selasa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Lokasi</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Alun-Alun Wates"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Waktu</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="08:00 - 13:00 WIB"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Kuota</label>
              <input
                type="text"
                value={formData.quota}
                onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="100 orang"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-[#C21219] transition-colors flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Simpan
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-200 text-foreground px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Batal
            </button>
          </div>
        </div>
      )}

      {!isAdding && !editingId && (
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Hari</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Lokasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Waktu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Kuota</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">Memuat data jadwal...</td></tr>
                ) : schedules.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">Belum ada jadwal donor.</td></tr>
                ) : (
                  schedules.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{schedule.date}</td>
                      <td className="px-6 py-4">{schedule.day}</td>
                      <td className="px-6 py-4">{schedule.location}</td>
                      <td className="px-6 py-4">{schedule.time}</td>
                      <td className="px-6 py-4">{schedule.quota}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(schedule)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(schedule.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 transform transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-500 mb-6">
              Apakah Anda yakin ingin menghapus jadwal ini? Tindakan ini tidak dapat dibatalkan.
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
