import { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Plus, Edit, Trash2, Save, X, Loader2, AlertCircle, Calendar as CalendarIcon, ChevronDown, Check, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/config/api";
import { Pagination } from "../components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const parseIndoDateToObj = (indoDateStr: string): Date | undefined => {
  if (!indoDateStr) return undefined;
  const MONTH_NAMES = [
    "januari", "februari", "maret", "april", "mei", "juni",
    "juli", "agustus", "september", "oktober", "november", "desember"
  ];
  const parts = indoDateStr.trim().split(/\s+/);
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const monthIndex = MONTH_NAMES.indexOf(parts[1].toLowerCase());
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
      return new Date(year, monthIndex, day);
    }
  }
  const fallback = new Date(indoDateStr);
  return isNaN(fallback.getTime()) ? undefined : fallback;
};

interface Schedule {
  id: string;
  date: string;
  day: string;
  location: string;
  time: string;
  quota: string;
}

function TimePickerPopover({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hour, minute] = value && value.includes(":") ? value.split(":") : ["08", "00"];
  const [currentHour, setCurrentHour] = useState(hour || "08");

  useEffect(() => {
    if (value && value.includes(":")) {
      const [h] = value.split(":");
      setCurrentHour(h);
    }
  }, [value]);

  const hours = [
    "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"
  ];
  const minutes = [
    "00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"
  ];

  const handleHourClick = (h: string) => {
    setCurrentHour(h);
    onChange(`${h}:${minute || "00"}`);
  };

  const handleMinuteClick = (m: string) => {
    onChange(`${currentHour}:${m}`);
    setOpen(false); // Otomatis menutup seketika saat menit diklik!
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm font-semibold text-gray-800 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-xs group"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
            <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-lg border border-gray-200">
              {value || "08:00"}
            </span>
          </div>
          <Clock className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3 bg-white border border-border rounded-2xl shadow-xl z-50" align="start">
        <div className="text-xs font-semibold text-gray-500 mb-2 px-1 flex justify-between">
          <span>Pilih Jam</span>
          <span>Pilih Menit</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* Kolom Jam (Scroll Mandiri) */}
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {hours.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => handleHourClick(h)}
                className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  currentHour === h
                    ? "bg-primary text-white shadow-xs"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {h}
              </button>
            ))}
          </div>

          {/* Kolom Menit (Scroll Mandiri) */}
          <div className="space-y-1 border-l border-border pl-2 max-h-48 overflow-y-auto pr-1">
            {minutes.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleMinuteClick(m)}
                className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  minute === m
                    ? "bg-primary text-white shadow-xs"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-border text-[10px] text-muted-foreground text-center italic">
          *Klik menit untuk langsung menutup
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ManageJadwal() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchSchedules = (page = 1) => {
    setLoading(true);
    setFetchError("");
    api.get(`/api/jadwal-donors?page=${page}`)
      .then(res => {
        const items = res.data || (Array.isArray(res) ? res : []);
        setTotalPages(res.last_page || 1);
        setTotalItems(res.total || items.length);
        setCurrentPage(res.current_page || page);
        setSchedules(items.map((item: any) => ({ ...item, id: item.id.toString() })));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching jadwal:", err);
        setFetchError("Gagal memuat jadwal donor. Silakan periksa koneksi.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSchedules(1);
  }, []);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("12:00");
  const [quotaCount, setQuotaCount] = useState("100");

  const [formData, setFormData] = useState<Omit<Schedule, "id">>({
    date: "",
    day: "",
    location: "",
    time: "08:00 - 12:00 WIB",
    quota: "100 orang",
  });

  const handleCalendarSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (!date) {
      setFormData(prev => ({ ...prev, date: "", day: "" }));
      return;
    }
    const formattedDay = format(date, "EEEE", { locale: id });
    const formattedDate = format(date, "d MMMM yyyy", { locale: id });
    setFormData(prev => ({
      ...prev,
      day: formattedDay,
      date: formattedDate
    }));
    setCalendarOpen(false);
  };

  const handleTimeChange = (start: string, end: string) => {
    setStartTime(start);
    setEndTime(end);
    if (start && end) {
      setFormData(prev => ({ ...prev, time: `${start} - ${end} WIB` }));
    } else if (start) {
      setFormData(prev => ({ ...prev, time: `${start} WIB` }));
    }
  };

  const handleQuotaChange = (val: string) => {
    setQuotaCount(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setFormData(prev => ({ ...prev, quota: `${num} orang` }));
    } else {
      setFormData(prev => ({ ...prev, quota: "" }));
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setSelectedDate(undefined);
    setCalendarOpen(false);
    setStartTime("08:00");
    setEndTime("12:00");
    setQuotaCount("100");
    setFormData({
      date: "",
      day: "",
      location: "",
      time: "08:00 - 12:00 WIB",
      quota: "100 orang"
    });
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingId(schedule.id);
    const parsed = parseIndoDateToObj(schedule.date);
    setSelectedDate(parsed);
    setCalendarOpen(false);

    // Parse waktu jam mulai & jam selesai
    const matchTime = schedule.time ? schedule.time.match(/(\d{1,2}[:.]\d{2})\s*-\s*(\d{1,2}[:.]\d{2})/) : null;
    if (matchTime) {
      setStartTime(matchTime[1].replace(".", ":").padStart(5, "0"));
      setEndTime(matchTime[2].replace(".", ":").padStart(5, "0"));
    } else {
      setStartTime("08:00");
      setEndTime("12:00");
    }

    // Parse jumlah kuota
    const matchQuota = schedule.quota ? schedule.quota.match(/\d+/) : null;
    setQuotaCount(matchQuota ? matchQuota[0] : "100");

    setFormData({
      date: schedule.date,
      day: schedule.day,
      location: schedule.location,
      time: schedule.time || "08:00 - 12:00 WIB",
      quota: schedule.quota || "100 orang",
    });
  };

  const handleSave = () => {
    if (!formData.date || !formData.day) {
      toast.error("Silakan pilih tanggal kegiatan terlebih dahulu.");
      return;
    }
    if (!formData.location.trim()) {
      toast.error("Lokasi kegiatan wajib diisi.");
      return;
    }
    if (!formData.time.trim()) {
      toast.error("Waktu kegiatan wajib diisi.");
      return;
    }

    const isEdit = !!editingId;
    const request = isEdit
      ? api.put(`/api/jadwal-donors/${editingId}`, formData)
      : api.post('/api/jadwal-donors', formData);

    request
      .then(d => d.data || d)
      .then(data => {
        const formatted = { ...data, id: data.id?.toString() || editingId || Date.now().toString() };
        if (isEdit) {
          setSchedules(schedules.map(s => s.id === editingId ? formatted : s));
          toast.success("Jadwal berhasil diperbarui!");
          setEditingId(null);
        } else {
          setSchedules([...schedules, formatted]);
          toast.success("Jadwal berhasil ditambahkan & disinkronkan ke WhatsApp & Instagram!");
          setIsAdding(false);
        }
        setSelectedDate(undefined);
        setCalendarOpen(false);
        setFormData({ date: "", day: "", location: "", time: "", quota: "" });
      })
      .catch((err: any) => {
        console.error(err);
        let errorMessage = err.message || 'Gagal menyimpan data jadwal';
        if (errorMessage === "Unauthenticated.") {
          errorMessage = "Sesi Anda telah berakhir, silakan login kembali.";
        }
        toast.error(errorMessage);
      });
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      api.delete(`/api/jadwal-donors/${itemToDelete}`)
        .then(() => {
          setSchedules(schedules.filter(s => s.id !== itemToDelete));
          toast.success("Jadwal berhasil dihapus!");
        })
        .catch((err: any) => {
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
    setSelectedDate(undefined);
    setCalendarOpen(false);
    setStartTime("08:00");
    setEndTime("12:00");
    setQuotaCount("100");
    setFormData({ date: "", day: "", location: "", time: "08:00 - 12:00 WIB", quota: "100 orang" });
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
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Pilih Tanggal Kegiatan
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full sm:w-auto min-w-[280px] px-4 py-2.5 bg-white border border-gray-300 rounded-xl shadow-xs text-left font-medium text-sm hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                          <CalendarIcon className="w-4 h-4" />
                        </div>
                        <span className={formData.date ? "text-gray-900 font-semibold" : "text-gray-400"}>
                          {formData.date && formData.day ? `${formData.day}, ${formData.date}` : "Pilih tanggal di kalender..."}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white border border-gray-200 rounded-2xl shadow-xl z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleCalendarSelect}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>

                {formData.date && formData.day && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold shadow-xs">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Terpilih: {formData.day}, {formData.date}</span>
                  </div>
                )}
              </div>
              {(!formData.date || !formData.day) && (
                <p className="text-xs text-muted-foreground mt-1.5">
                  *Klik tombol kalender di atas untuk memilih tanggal. Tanggal sebelum hari ini otomatis dinonaktifkan.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Lokasi Kegiatan</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white font-medium text-sm"
                placeholder="Contoh: Alun-Alun Wates"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Target Kuota Pendonor</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={quotaCount}
                  onChange={(e) => handleQuotaChange(e.target.value)}
                  className="w-full px-4 py-2.5 pr-16 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white font-medium text-sm"
                  placeholder="100"
                />
                <div className="absolute right-4 top-2.5 text-sm font-semibold text-muted-foreground pointer-events-none">
                  orang
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Waktu Pelaksanaan (WIB)
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex-1">
                    <TimePickerPopover
                      label="Mulai"
                      value={startTime}
                      onChange={(val) => handleTimeChange(val, endTime)}
                    />
                  </div>
                  <span className="text-gray-400 font-bold px-1">s/d</span>
                  <div className="flex-1">
                    <TimePickerPopover
                      label="Selesai"
                      value={endTime}
                      onChange={(val) => handleTimeChange(startTime, val)}
                    />
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Format: <strong>{formData.time || "08:00 - 12:00 WIB"}</strong></span>
                </div>
              </div>
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
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span className="text-sm">Memuat data jadwal...</span>
                      </div>
                    </td>
                  </tr>
                ) : fetchError ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-red-600">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-6 h-6" />
                        <span className="text-sm font-medium">{fetchError}</span>
                        <button
                          onClick={() => fetchSchedules(currentPage)}
                          className="mt-2 text-xs bg-red-100 text-red-800 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors font-semibold"
                        >
                          Coba Lagi
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : schedules.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground text-sm">Belum ada jadwal donor.</td></tr>
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

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              lastPage={totalPages}
              total={totalItems}
              onPageChange={fetchSchedules}
            />
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
