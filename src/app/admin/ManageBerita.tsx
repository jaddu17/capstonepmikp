import { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Plus, Edit, Trash2, Save, X, Eye } from "lucide-react";
import { toast } from "sonner";

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

  useEffect(() => {
    fetch('/api/beritas')
      .then(res => res.json())
      .then(data => {
        // Map data to match the frontend types (e.g. converting ID from number to string if needed)
        const formattedData = data.map((item: any) => ({
          ...item,
          id: item.id.toString(),
          published: Boolean(item.published)
        }));
        setNewsList(formattedData);
      })
      .catch(err => console.error("Error fetching beritas:", err));
  }, []);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      title: "",
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      category: "Donor Darah",
      excerpt: "",
      content: "",
      image: "",
      published: false,
    });
  };

  const handleEdit = (news: News) => {
    setEditingId(news.id);
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
    const isEdit = !!editingId;
    const url = isEdit ? `/api/beritas/${editingId}` : '/api/beritas';
    const method = isEdit ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      // Format data to match frontend requirements
      const formattedData = {
        ...data,
        id: data.id.toString(),
        published: Boolean(data.published)
      };

      if (isEdit) {
        setNewsList(newsList.map((n) => (n.id === editingId ? formattedData : n)));
        toast.success("Berita berhasil diperbarui!");
      } else {
        setNewsList([formattedData, ...newsList]);
        toast.success("Berita berhasil ditambahkan!");
      }
      
      setEditingId(null);
      setIsAdding(false);
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
    .catch(err => console.error(err));
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
      fetch(`/api/beritas/${id}`, { method: 'DELETE' })
      .then(() => {
        setNewsList(newsList.filter((n) => n.id !== id));
        toast.success("Berita berhasil dihapus!");
      })
      .catch(err => console.error(err));
    }
  };

  const togglePublish = (id: string) => {
    const news = newsList.find(n => n.id === id);
    if (!news) return;

    fetch(`/api/beritas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ ...news, published: !news.published })
    })
    .then(res => res.json())
    .then(data => {
      const formattedData = {
        ...data,
        id: data.id.toString(),
        published: Boolean(data.published)
      };
      setNewsList(newsList.map((n) => (n.id === id ? formattedData : n)));
      toast.success("Status publikasi berhasil diubah!");
    })
    .catch(err => console.error(err));
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
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
          <h1 className="text-2xl font-bold mb-2">Kelola Berita & Kegiatan</h1>
          <p className="text-muted-foreground">
            Tambah, edit, atau hapus berita dan kegiatan PMI
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
              <label className="block text-sm font-medium mb-2">Judul Berita</label>
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
                <label className="block text-sm font-medium mb-2">Tanggal</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="8 Mei 2026"
                />
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
                <label className="block text-sm font-medium mb-2">Ringkasan (Snippet)</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Tulis ringkasan singkat untuk kartu berita"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Isi Berita Lengkap</label>
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
              <div className="flex items-center gap-4">
                <div className="w-32 h-20 bg-gray-100 rounded-lg border border-border overflow-hidden flex-shrink-0">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Plus className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="relative group/upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, image: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium group-hover/upload:border-primary transition-colors">
                      <Plus className="w-4 h-4" />
                      {formData.image ? "Ganti Gambar" : "Upload Gambar Berita"}
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Format: JPG, PNG. Maksimal 2MB.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <label htmlFor="published" className="text-sm font-medium">
                Publikasikan berita
              </label>
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

      <div className="grid md:grid-cols-2 gap-6">
        {newsList.map((news) => (
          <div
            key={news.id}
            className="bg-white rounded-xl border border-border shadow-sm overflow-hidden"
          >
            <div className="aspect-video bg-gray-200">
              {news.image && (
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {news.category}
                </span>
                <span className="text-sm text-muted-foreground">{news.date}</span>
              </div>
              <h3 className="font-semibold mb-2">{news.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {news.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      news.published ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="text-xs text-muted-foreground">
                    {news.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePublish(news.id)}
                    className="text-green-600 hover:text-green-800 p-1"
                    title={news.published ? "Unpublish" : "Publish"}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(news)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(news.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
