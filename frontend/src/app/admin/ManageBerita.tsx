import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Plus, Edit, Trash2, Save, X, Eye, Loader2, AlertCircle, Calendar as CalendarIcon, ChevronDown, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { api, getStorageUrl } from "@/config/api";
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

interface News {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  published: boolean;
}

export function ManageBerita() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const fetchNews = (page = 1) => {
    setLoading(true);
    setFetchError("");
    api.get(`/api/beritas?page=${page}`)
      .then(res => {
        const items = res.data || (Array.isArray(res) ? res : []);
        setTotalPages(res.last_page || 1);
        setTotalItems(res.total || items.length);
        setCurrentPage(res.current_page || page);
        setNewsList(items.map((item: any) => ({
          ...item,
          id: item.id.toString(),
          published: Boolean(item.published)
        })));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching beritas:", err);
        setFetchError("Gagal memuat data berita. Silakan periksa koneksi.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNews(1);
  }, []);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteImageModalOpen, setDeleteImageModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 2MB");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFormData(prev => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const [formData, setFormData] = useState<Omit<News, "id">>({
    title: "",
    date: "",
    category: "",
    excerpt: "",
    content: "",
    image: "",
    published: false,
  });

  const categories = ["Donor Darah", "Pelatihan", "Tanggap Darurat", "Rekrutmen"];

  const handleCalendarSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = format(date, "d MMMM yyyy", { locale: id });
      setFormData(prev => ({ ...prev, date: formattedDate }));
    } else {
      setFormData(prev => ({ ...prev, date: "" }));
    }
    setCalendarOpen(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    const now = new Date();
    setSelectedDate(now);
    setCalendarOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFormData({
      title: "",
      date: format(now, "d MMMM yyyy", { locale: id }),
      category: "Donor Darah",
      excerpt: "",
      content: "",
      image: "",
      published: false,
    });
  };

  const handleEdit = (news: News) => {
    setEditingId(news.id);
    const parsed = parseIndoDateToObj(news.date);
    setSelectedDate(parsed || new Date());
    setCalendarOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFormData({
      title: news.title,
      date: news.date,
      category: news.category,
      excerpt: news.excerpt,
      content: news.content || "",
      image: news.image,
      published: news.published,
    });
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error("Judul berita wajib diisi.");
      return;
    }

    if (formData.published) {
      if (!formData.excerpt.trim()) {
        toast.error("Ringkasan berita wajib diisi sebelum dipublikasikan.");
        return;
      }
      if (!formData.content.trim()) {
        toast.error("Isi lengkap berita wajib diisi sebelum dipublikasikan.");
        return;
      }
    }

    const isEdit = !!editingId;
    const request = isEdit
      ? api.put(`/api/beritas/${editingId}`, formData)
      : api.post('/api/beritas', formData);

    request
      .then(d => d.data || d)
      .then(data => {
        // Format data to match frontend requirements
        const formattedData = {
          ...data,
          id: data.id?.toString() || "",
          published: Boolean(data.published)
        };

        if (isEdit) {
          setNewsList(newsList.map((n) => (n.id === editingId ? formattedData : n)));
          if (formattedData.published) {
            toast.success("Berita berhasil diperbarui dan dipublikasikan!");
          } else {
            toast.success("Draft berita berhasil diperbarui!");
          }
        } else {
          setNewsList([formattedData, ...newsList]);
          if (formattedData.published) {
            toast.success("Berita berhasil dipublikasikan & disinkronkan ke WhatsApp!");
          } else {
            toast.success("Draft berita berhasil disimpan (belum dipublikasikan ke publik)!");
          }
        }
        
        setEditingId(null);
        setIsAdding(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setFormData({
          title: "",
          date: "",
          category: "",
          excerpt: "",
          content: "",
          image: "",
          published: false,
        });
      })
      .catch((err: any) => {
        console.error(err);
        toast.error(err.message || "Gagal menyimpan data");
      });
  };

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      api.delete(`/api/beritas/${itemToDelete}`)
        .then(() => {
          setNewsList(newsList.filter((n) => n.id !== itemToDelete));
          toast.success("Berita berhasil dihapus!");
        })
        .catch((err: any) => {
          console.error(err);
          toast.error(err.message || "Gagal menghapus berita");
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
    setSelectedDate(new Date());
    setCalendarOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFormData({
      title: "",
      date: "",
      category: "",
      excerpt: "",
      content: "",
      image: "",
      published: false,
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Kelola Berita </h1>
          <p className="text-muted-foreground">
            Tambah, edit, atau hapus berita PMI
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={handleAdd}
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-[#C21219] transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tambah Berita
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 mb-6">
          <h3 className="font-semibold mb-4">
            {editingId ? "Edit Berita" : "Tambah Berita Baru"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Judul Berita <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Masukkan judul berita"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Tanggal Publikasi</label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-border rounded-xl text-sm font-medium text-gray-800 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-xs group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-red-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                          <CalendarIcon className="w-4 h-4" />
                        </div>
                        <span className={formData.date ? "text-gray-900 font-semibold" : "text-gray-400"}>
                          {formData.date || "Pilih tanggal berita..."}
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
                      initialFocus
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ringkasan (Snippet) {formData.published && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Tulis ringkasan singkat untuk kartu berita"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Isi Berita Lengkap {formData.published && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Tulis seluruh isi berita di sini"
                ></textarea>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gambar Berita</label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Box Preview (Murni Preview Hasil) */}
                <div className="w-36 h-24 rounded-lg border border-border bg-gray-50 flex-shrink-0 flex flex-col items-center justify-center overflow-hidden">
                  {formData.image ? (
                    <img
                      src={getStorageUrl(formData.image)}
                      alt="Preview Berita"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 p-2 text-center select-none">
                      <ImageIcon className="w-6 h-6 mb-1 text-gray-400" />
                      <span className="text-[11px] font-medium text-gray-500">Preview Foto</span>
                    </div>
                  )}
                </div>

                {/* Hidden File Input yang dikontrol ref */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Tombol Aksi & Keterangan */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border hover:border-primary text-gray-700 hover:text-primary rounded-lg text-sm font-medium shadow-sm transition-all"
                    >
                      <Upload className="w-4 h-4 text-primary" />
                      {formData.image ? "Ganti File Gambar" : "Pilih File Gambar"}
                    </button>

                    {formData.image && (
                      <button
                        type="button"
                        onClick={() => setDeleteImageModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg text-sm font-medium transition-colors"
                        title="Hapus gambar yang dipilih"
                      >
                        <Trash2 className="w-4 h-4" />
                        Hapus Foto
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Format yang didukung: <span className="font-semibold text-gray-600">JPG, PNG</span>. Maksimal ukuran: <span className="font-semibold text-gray-600">2 MB</span>.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary cursor-pointer"
                />
                <label htmlFor="published" className="text-sm font-semibold cursor-pointer text-gray-800">
                  Publikasikan berita
                </label>
              </div>
              <p className="text-xs text-muted-foreground ml-6 mt-1">
                {formData.published
                  ? "Berita akan langsung tampil di portal publik serta disiarkan ke WhatsApp PMI."
                  : "Berita disimpan sebagai draft internal (belum ditampilkan di portal publik)."}
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-[#C21219] transition-colors flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {formData.published
                ? (editingId ? "Perbarui & Publikasikan" : "Publikasikan Berita")
                : (editingId ? "Perbarui Draft" : "Simpan Draft")}
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
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-border font-semibold text-sm">
          <div className="col-span-4">Judul Berita</div>
          <div className="col-span-5">Deskripsi</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-center">Aksi</div>
        </div>
        
        {/* Table Content */}
        {loading ? (
          <div className="py-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-sm">Memuat data berita...</span>
          </div>
        ) : fetchError ? (
          <div className="py-12 px-4 text-center text-red-600 flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-6 h-6" />
            <span className="text-sm font-medium">{fetchError}</span>
            <button
              onClick={() => fetchNews(currentPage)}
              className="mt-2 text-xs bg-red-100 text-red-800 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors font-semibold"
            >
              Coba Lagi
            </button>
          </div>
        ) : newsList.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            Belum ada berita yang tersedia.
          </div>
        ) : (
          newsList.map((news, index) => (
            <div
              key={news.id}
              className={`grid grid-cols-12 gap-4 p-4 items-start ${
                index < newsList.length - 1 ? 'border-b border-border' : ''
              } hover:bg-gray-50 transition-colors`}
            >
              <div className="col-span-4">
                <h3 className="font-semibold text-sm">{news.title}</h3>
              </div>
              <div className="col-span-5">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {news.excerpt}
                </p>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      news.published ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="text-xs font-medium">
                    {news.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
              <div className="col-span-1 flex justify-center gap-1">
                <button
                  onClick={() => handleEdit(news)}
                  className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50 transition-colors"
                  title="Review / Edit berita"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(news.id)}
                  className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-50 transition-colors"
                  title="Hapus berita"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          lastPage={totalPages}
          total={totalItems}
          onPageChange={fetchNews}
        />
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 transform transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-500 mb-6">
              Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan.
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

      {/* Delete Image Confirmation Modal */}
      {deleteImageModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 transform transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Gambar</h3>
            <p className="text-sm text-gray-600 mb-6">
              Yakin ingin menghapus gambar?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteImageModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  handleRemoveImage();
                  setDeleteImageModalOpen(false);
                  toast.info("Gambar berhasil dihapus");
                }}
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