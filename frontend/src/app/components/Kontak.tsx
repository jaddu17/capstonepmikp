import { Phone, Mail, MapPin, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Kontak() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    type: "umum",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/pesans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          date: new Date().toLocaleString("id-ID"),
          read: false,
          replied: false,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Gagal mengirim pesan");
      }

      toast.success("Terima kasih! Pesan Anda telah terkirim. Tim kami akan segera menghubungi Anda.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "", type: "umum" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contacts = [
    {
      icon: Phone,
      title: "Telepon",
      value: "(0274) 773456",
      link: "tel:0274773456",
    },
    {
      icon: Mail,
      title: "Email",
      value: "pmi.kulonprogo@gmail.com",
      link: "mailto:pmi.kulonprogo@gmail.com",
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      value: "0812-3456-7890",
      link: "https://wa.me/6281234567890",
    },
    {
      icon: MapPin,
      title: "Alamat",
      value: "Jl. Bhayangkara, Serut, Pengasih, Kec. Pengasih, Kabupaten Kulon Progo, Daerah Istimewa Yogyakarta 55652",
      link: "#",
    },
  ];

  return (
    <section id="kontak" className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Hubungi Kami</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ada pertanyaan atau ingin berpartisipasi? Hubungi kami melalui kontak di bawah ini
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-6">Informasi Kontak</h3>
            <div className="space-y-4 mb-8">
              {contacts.map((contact, index) => (
                <a
                  key={index}
                  href={contact.link}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <contact.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-sm text-muted-foreground mb-1">
                      {contact.title}
                    </div>
                    <div className="text-foreground">{contact.value}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-blue-900 mb-3">
                Jam Operasional
              </h4>
              <div className="space-y-2 text-blue-800">
                <div className="flex justify-between">
                  <span>Senin - Jumat</span>
                  <span className="font-medium">08:00 - 16:00 WIB</span>
                </div>
                <div className="flex justify-between">
                  <span>Sabtu</span>
                  <span className="font-medium">08:00 - 12:00 WIB</span>
                </div>
                <div className="flex justify-between">
                  <span>Minggu & Libur</span>
                  <span className="font-medium">Tutup</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-8 shadow-sm">
            <h3 className="font-semibold mb-6">Kirim Pesan</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Masukkan nama Anda"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Nomor WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Contoh: 08123456789"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Tipe Pesan</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="umum">Pertanyaan Umum</option>
                  <option value="donor">Donor Darah</option>
                  <option value="relawan">Pendaftaran Relawan</option>
                  <option value="saran">Saran & Masukan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Subjek</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Subjek pesan"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Pesan</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Tulis pesan Anda di sini..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-[#C21219] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}