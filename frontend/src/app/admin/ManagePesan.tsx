import { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Mail, Trash2, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  replied?: boolean;
  reply_text?: string;
}

export function ManagePesan() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [replyContent, setReplyContent] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/pesans')
      .then(res => res.json())
      .then(data => {
        setMessages(data.map((item: any) => ({
          ...item,
          id: item.id.toString(),
          read: Boolean(item.read),
          replied: Boolean(item.replied),
        })));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching pesans:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      fetch(`/api/pesans/${itemToDelete}`, { method: 'DELETE' })
      .then(() => {
        const updated = messages.filter(m => m.id !== itemToDelete);
        setMessages(updated);
        if (selectedMessage?.id === itemToDelete) setSelectedMessage(null);
        toast.success("Pesan berhasil dihapus!");
      })
      .catch(err => console.error(err))
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
      fetch(`/api/pesans/${message.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ read: true }),
      })
      .then(res => res.json())
      .then(data => {
        const updated = messages.map(m => m.id === message.id ? { ...m, read: true } : m);
        setMessages(updated);
        setSelectedMessage({ ...message, read: true });
      })
      .catch(err => console.error(err));
    }
  };

  const handleSendReply = (method: "email" | "whatsapp") => {
    if (!selectedMessage) return;

    if (method === "email") {
      window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}&body=${encodeURIComponent(replyContent)}`);
    } else if (method === "whatsapp" && selectedMessage.phone) {
      window.open(`https://wa.me/${selectedMessage.phone.replace(/^0/, "62")}?text=${encodeURIComponent(replyContent)}`);
    }

    fetch(`/api/pesans/${selectedMessage.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ replied: true, reply_text: replyContent }),
    })
    .then(res => res.json())
    .then(() => {
      const updated = messages.map(m =>
        m.id === selectedMessage.id ? { ...m, replied: true, reply_text: replyContent } : m
      );
      setMessages(updated);
      setSelectedMessage({ ...selectedMessage, replied: true, reply_text: replyContent });
      toast.success("Balasan berhasil disimpan!");
    })
    .catch(err => console.error(err));
  };

  const filteredMessages = messages.filter(m => {
    if (filter === "unread") return !m.read;
    if (filter === "read") return m.read;
    return true;
  });

  const getTypeColor = (type: string) => {
    const colors: any = {
      umum: "bg-blue-100 text-blue-800",
      donor: "bg-red-100 text-red-800",
      relawan: "bg-green-100 text-green-800",
      saran: "bg-purple-100 text-purple-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Pesan Masuk</h1>
          <p className="text-gray-500 font-medium text-lg italic">Kelola interaksi dengan masyarakat</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
          <span className="font-bold text-gray-700">{messages.filter(m => !m.read).length} Pesan Baru</span>
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        {["all", "unread", "read"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${
              filter === f ? "bg-primary text-white shadow-xl shadow-primary/30" : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50"
            }`}
          >
            {f === "all" ? "Semua" : f === "unread" ? "Belum Dibaca" : "Sudah Dibaca"}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4 overflow-y-auto max-h-[calc(100vh-320px)] pr-2">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Memuat pesan...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Tidak ada pesan.</div>
          ) : filteredMessages.map(message => (
            <div
              key={message.id}
              onClick={() => handleRead(message)}
              className={`bg-white rounded-3xl border-2 p-5 cursor-pointer transition-all relative group ${
                selectedMessage?.id === message.id ? "border-primary shadow-2xl" : "border-gray-50 shadow-sm hover:border-gray-200"
              } ${!message.read ? "bg-red-50/20" : ""}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-black text-sm ${!message.read ? "text-primary" : "text-gray-800"}`}>{message.name}</span>
                    {message.replied && <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">REPLIED</span>}
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${getTypeColor(message.type)}`}>{message.type}</span>
                </div>
                <button onClick={e => { e.stopPropagation(); handleDelete(message.id); }} className="p-2 hover:bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm font-bold text-gray-600 mb-2 line-clamp-1">{message.subject}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{message.date}</div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
              <div className="p-10 bg-gray-50/30 border-b border-gray-100">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 mb-3">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-4 text-sm font-bold">
                      <span className="text-primary">{selectedMessage.name}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">{selectedMessage.email}</span>
                      {selectedMessage.phone && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500">{selectedMessage.phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${getTypeColor(selectedMessage.type)}`}>{selectedMessage.type}</span>
                    <div className="text-xs font-bold text-gray-400 mt-3">{selectedMessage.date}</div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 text-gray-700 leading-relaxed text-lg shadow-sm">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="p-10 space-y-8 flex-1">
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-4 uppercase tracking-[0.2em]">Balas Pesan Ini</label>
                  <textarea
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    rows={6}
                    placeholder="Tulis balasan profesional Anda di sini..."
                    className="w-full p-8 bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[2rem] transition-all outline-none resize-none font-medium text-gray-800"
                  />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => handleSendReply("email")} className="flex-1 flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-5 rounded-2xl font-black hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 uppercase tracking-widest text-sm">
                    <Mail className="w-5 h-5" /> Balas via Email
                  </button>
                  {selectedMessage.phone && (
                    <button onClick={() => handleSendReply("whatsapp")} className="flex-1 flex items-center justify-center gap-3 bg-green-500 text-white px-8 py-5 rounded-2xl font-black hover:bg-green-600 transition-all shadow-xl shadow-green-100 uppercase tracking-widest text-sm">
                      <MessageCircle className="w-5 h-5" /> Balas via WhatsApp
                    </button>
                  )}
                </div>
                {selectedMessage.replied && (
                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"><Send className="w-5 h-5" /></div>
                    <div>
                      <p className="font-black text-blue-900 text-sm uppercase tracking-wider">Status: Terbalas</p>
                      <p className="text-blue-700/70 text-xs font-bold mt-0.5">Balasan Anda telah disimpan ke sistem.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50/50 rounded-[2.5rem] border-4 border-dashed border-gray-100 p-32 text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"><Mail className="w-10 h-10 text-gray-200" /></div>
              <h3 className="text-2xl font-black text-gray-300 uppercase tracking-widest">Pilih Pesan</h3>
              <p className="text-gray-400 font-medium mt-3">Silakan klik salah satu pesan di daftar kiri untuk mulai membalas.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 transform transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-500 mb-6">
              Apakah Anda yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan.
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
