import { useState } from "react";
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
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: "1",
      date: "12 Mei 2026",
      day: "Selasa",
      location: "Alun-Alun Wates",
      time: "08:00 - 13:00 WIB",
      quota: "100 orang",
    },
    {
      id: "2",
      date: "15 Mei 2026",
      day: "Jumat",
      location: "Kantor PMI Kulon Progo",
      time: "09:00 - 14:00 WIB",
      quota: "75 orang",
    },
    {
      id: "3",
      date: "19 Mei 2026",
      day: "Selasa",
      location: "Pasar Sentolo",
      time: "08:00 - 12:00 WIB",
      quota: "80 orang",
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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
    if (editingId) {
      setSchedules(
        schedules.map((s) =>
          s.id === editingId ? { ...formData, id: editingId } : s
        )
      );
      toast.success("Jadwal berhasil diperbarui!");
      setEditingId(null);
    } else {
      const newSchedule = {
        ...formData,
        id: Date.now().toString(),
      };
      setSchedules([...schedules, newSchedule]);
      toast.success("Jadwal berhasil ditambahkan!");
      setIsAdding(false);
    }
    setFormData({ date: "", day: "", location: "", time: "", quota: "" });
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
      setSchedules(schedules.filter((s) => s.id !== id));
      toast.success("Jadwal berhasil dihapus!");
    }
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

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Hari
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Lokasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Kuota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {schedules.map((schedule) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
