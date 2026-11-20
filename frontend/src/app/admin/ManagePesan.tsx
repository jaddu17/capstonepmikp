import { useState, useEffect, useCallback, useRef } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Mail, Trash2, MessageCircle, Send, Loader2, AlertCircle, RefreshCw, Search, X, CheckCircle2, Phone, Calendar } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/config/api";
import { Pagination } from "../components/ui/pagination";

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  date?: string;
  created_at?: string;
  read: boolean;
  replied?: boolean;
  reply_text?: string;
}

export function ManagePesan() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalUnread, setTotalUnread] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const isFetchingRef = useRef(false);
  const selectedIdRef = useRef<string | null>(null);
  selectedIdRef.current = selectedMessage?.id || null;

  // Debounce search agar tidak membebani server pada setiap ketikan
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchMessages = useCallback((page = 1, isSilent = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (!isSilent) {
      setLoading(true);
      setFetchError("");
    } else {
      setIsRefreshing(true);
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      filter: filter,
      ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    });

    api.get(`/api/pesans?${queryParams.toString()}`)
      .then(res => {
        const items = res.data || (Array.isArray(res) ? res : []);
        setTotalPages(res.last_page || 1);
        setTotalItems(res.total || items.length);
        setCurrentPage(res.current_page || page);

        if (typeof res.unread_count === "number") {
          setTotalUnread(res.unread_count);
        } else {
          setTotalUnread(items.filter((item: any) => !item.read).length);
        }

        const mapped: Message[] = items.map((item: any) => ({
          ...item,
          id: item.id.toString(),
          read: Boolean(item.read),
          replied: Boolean(item.replied),
        }));
        setMessages(mapped);

        // Keep selected message updated without triggering infinite loop
        if (selectedIdRef.current) {
          const match = mapped.find(m => m.id === selectedIdRef.current);
          if (match) {
            setSelectedMessage(prev => prev ? { ...prev, ...match } : null);
          }
        }
      })
      .catch(err => {
        console.error("Error fetching pesans:", err);
        if (!isSilent) {
          setFetchError("Gagal memuat pesan masuk. Silakan periksa koneksi.");
        }
      })
      .finally(() => {
        isFetchingRef.current = false;
        setLoading(false);
        setIsRefreshing(false);
      });
  }, [filter, debouncedSearch]);

  // Initial load & when page/filter/search changes
  useEffect(() => {
    fetchMessages(currentPage, false);
  }, [fetchMessages, currentPage]);

  // Polling realtime teratur setiap 30 detik
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchMessages(currentPage, true);
      }
    }, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchMessages(currentPage, true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchMessages, currentPage]);

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      api.delete(`/api/pesans/${itemToDelete}`)
        .then(() => {
          const updated = messages.filter(m => m.id !== itemToDelete);
          setMessages(updated);
          if (selectedMessage?.id === itemToDelete) setSelectedMessage(null);
          toast.success("Pesan berhasil dihapus!");
          // Refresh count
          fetchMessages(currentPage, true);
        })
        .catch((err: any) => {
          console.error(err);
          toast.error(err.message || "Gagal menghapus pesan");
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

  const handleRead = (message: Message) => {
    setSelectedMessage(message);
    setReplyContent(message.reply_text || "");
    if (!message.read) {
      api.put(`/api/pesans/${message.id}`, { read: true })
        .then(d => d.data || d)
        .then(() => {
          const updated = messages.map(m => m.id === message.id ? { ...m, read: true } : m);
          setMessages(updated);
          setSelectedMessage({ ...message, read: true });
          setTotalUnread(prev => Math.max(0, prev - 1));
        })
        .catch(err => console.error(err));
    }
  };

  const handleSendReply = (method: "email" | "whatsapp") => {
    if (!selectedMessage) return;

    if (!replyContent.trim()) {
      toast.error("Tulis pesan balasan terlebih dahulu sebelum mengirim.");
      return;
    }

    if (method === "email") {
      const subject = encodeURIComponent("Tanggapan: Pertanyaan Anda ke PMI Kulon Progo");
      const body = encodeURIComponent(replyContent);
      window.open(`mailto:${selectedMessage.email}?subject=${subject}&body=${body}`);
    } else if (method === "whatsapp" && selectedMessage.phone) {
      const cleanPhone = selectedMessage.phone.replace(/[^0-9]/g, "").replace(/^0/, "62");
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(replyContent)}`);
    }

    api.put(`/api/pesans/${selectedMessage.id}`, { replied: true, reply_text: replyContent })
      .then(d => d.data || d)
      .then(() => {
        const updated = messages.map(m =>
          m.id === selectedMessage.id ? { ...m, replied: true, reply_text: replyContent } : m
        );
        setMessages(updated);
        setSelectedMessage({ ...selectedMessage, replied: true, reply_text: replyContent });
        toast.success("Balasan berhasil disimpan dan dialihkan ke aplikasi!");
      })
      .catch((err: any) => {
        console.error(err);
        toast.error(err.message || "Gagal menyimpan status balasan");
      });
  };

  const formatMessageDate = (msg: Message) => {
    if (msg.date) return msg.date;
    if (msg.created_at) {
      try {
        const d = new Date(msg.created_at);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
        }
      } catch {
        // Fallback
      }
    }
    return "-";
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Pesan Masuk</h1>
          <p className="text-muted-foreground text-sm">
            Kelola pertanyaan dan saran dari masyarakat melalui formulir kontak
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-3.5 py-2 rounded-xl border border-border shadow-xs flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${totalUnread > 0 ? "bg-primary animate-pulse" : "bg-gray-300"}`}></div>
            <span className="font-semibold text-sm text-gray-800">{totalUnread} Pesan Baru</span>
          </div>
          <button
            onClick={() => fetchMessages(currentPage, false)}
            disabled={loading || isRefreshing}
            className="px-3.5 py-2 rounded-xl border border-border bg-white hover:bg-gray-50 text-gray-700 hover:text-primary transition-all flex items-center gap-2 text-sm font-semibold shadow-xs disabled:opacity-50"
            title="Segarkan pesan masuk"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "Semua" },
            { id: "unread", label: "Belum Dibaca" },
            { id: "read", label: "Sudah Dibaca" }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                setFilter(f.id as any);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-white text-gray-600 border border-border hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari pengirim, email, atau isi pesan..."
            className="w-full pl-10 pr-9 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content Layout: Left Message List, Right Message Detail */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: List of Messages */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
            {loading ? (
              <div className="text-center py-16 text-muted-foreground flex flex-col items-center justify-center gap-2 bg-white rounded-xl border border-border">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-sm">Memuat pesan masuk...</span>
              </div>
            ) : fetchError ? (
              <div className="text-center py-12 text-red-600 flex flex-col items-center justify-center gap-2 bg-white rounded-xl border border-red-200 p-4">
                <AlertCircle className="w-6 h-6" />
                <span className="text-sm font-medium">{fetchError}</span>
                <button
                  onClick={() => fetchMessages(currentPage, false)}
                  className="mt-2 text-xs bg-red-100 text-red-800 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors font-semibold"
                >
                  Coba Lagi
                </button>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm bg-white rounded-xl border border-border p-6">
                {searchTerm ? "Tidak ada pesan yang sesuai dengan pencarian." : "Belum ada pesan masuk."}
              </div>
            ) : (
              messages.map(message => {
                const isSelected = selectedMessage?.id === message.id;
                return (
                  <div
                    key={message.id}
                    onClick={() => handleRead(message)}
                    className={`bg-white rounded-xl border p-4 cursor-pointer transition-all relative group shadow-xs ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/10 shadow-sm"
                        : "border-border hover:border-gray-300 hover:shadow-sm"
                    } ${!message.read ? "bg-red-50/25" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span className={`text-sm font-semibold truncate ${!message.read ? "text-primary font-bold" : "text-gray-900"}`}>
                          {message.name}
                        </span>
                        {!message.read && (
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" title="Belum dibaca"></span>
                        )}
                        {message.replied && (
                          <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Terbalas
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message.id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Hapus pesan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 mb-2.5 leading-relaxed">
                      {message.message}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-gray-100">
                      <span className="truncate max-w-[150px]">{message.email}</span>
                      <span className="flex-shrink-0">{formatMessageDate(message)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              lastPage={totalPages}
              total={totalItems}
              onPageChange={(p) => fetchMessages(p, false)}
            />
          )}
        </div>

        {/* Right Column: Message Detail & Reply */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="bg-white rounded-xl border border-border shadow-sm flex flex-col min-h-[550px] overflow-hidden">
              {/* Sender Details Header */}
              <div className="p-6 bg-gray-50/50 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-gray-900">{selectedMessage.name}</h2>
                      {selectedMessage.replied && (
                        <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-md font-medium inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Terbalas
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 text-gray-700">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <a href={`mailto:${selectedMessage.email}`} className="hover:underline hover:text-primary">
                          {selectedMessage.email}
                        </a>
                      </span>
                      {selectedMessage.phone && (
                        <>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 text-gray-700">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {selectedMessage.phone}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-white px-2.5 py-1 rounded-md border border-border self-start">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{formatMessageDate(selectedMessage)}</span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="bg-white p-4 sm:p-5 rounded-lg border border-border text-gray-800 text-sm leading-relaxed whitespace-pre-wrap shadow-xs">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Reply Section */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Balas Pesan Ini
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {replyContent.length > 0 ? `${replyContent.length} karakter` : ""}
                    </span>
                  </div>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={5}
                    placeholder="Tulis balasan Anda di sini, lalu pilih metode pengiriman..."
                    className="w-full p-3.5 bg-gray-50 border border-border focus:border-primary/40 focus:bg-white rounded-lg transition-all outline-none resize-none text-sm text-gray-800 focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleSendReply("email")}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-xs"
                    >
                      <Mail className="w-4 h-4" /> Balas via Email
                    </button>
                    {selectedMessage.phone && (
                      <button
                        onClick={() => handleSendReply("whatsapp")}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4" /> Balas via WhatsApp
                      </button>
                    )}
                  </div>

                  {selectedMessage.replied && selectedMessage.reply_text && (
                    <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-lg flex items-start gap-3 text-xs text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Riwayat Balasan Terakhir Disimpan:</p>
                        <p className="text-emerald-800 mt-1 italic">"{selectedMessage.reply_text}"</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50/70 rounded-xl border border-dashed border-gray-300 p-16 text-center h-full min-h-[450px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-xs border border-gray-100">
                <Mail className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-base font-semibold text-gray-700">Pilih Pesan Masuk</h3>
              <p className="text-xs text-muted-foreground mt-1.5 max-w-xs">
                Pilih salah satu pesan di daftar sebelah kiri untuk membaca detail lengkap dan mengirimkan balasan.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 transform transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hapus Pesan</h3>
            <p className="text-sm text-gray-600 mb-6">
              Yakin ingin menghapus pesan ini? Pesan yang dihapus tidak dapat dipulihkan.
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
