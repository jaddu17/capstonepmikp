import { useState } from "react";
import { Wallet, CreditCard, Landmark, ArrowRight, Heart, User, Phone, MessageSquare, CheckCircle2, Upload, FileText } from "lucide-react";
import { toast } from "sonner";

export function Donasi() {
  const [step, setStep] = useState(1);
  const [currentDonationId, setCurrentDonationId] = useState("");
  const [formData, setFormData] = useState({
    nama: "",
    wa: "",
    keterangan: ""
  });
  const [proofFile, setProofFile] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/donasis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          proof: null,
          date: new Date().toLocaleString("id-ID"),
          status: "Menunggu Pembayaran",
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan data donasi');
      }

      const donasi = await response.json();
      setCurrentDonationId(donasi.id.toString());
      setStep(2);
      toast.success("Informasi donasi telah dicatat!");
    } catch (error) {
      console.error("Error saving donasi:", error);
      toast.error("Gagal menyimpan data donasi. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File terlalu besar (Maks 2MB)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProofFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmPayment = async () => {
    if (!proofFile) {
      toast.error("Silakan unggah bukti transfer terlebih dahulu");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/donasis/${currentDonationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          proof: proofFile,
          status: "Sudah Bayar",
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal mengupload bukti transfer');
      }

      setStep(3);
      toast.success("Terima kasih! Bukti transfer telah terkirim.");
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("Gagal mengirim bukti transfer. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="donasi" className="py-20 bg-[#F8F9FA] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Heart className="w-8 h-8 text-primary fill-primary animate-pulse" />
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Salurkan Kebaikan Anda
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bantu sesama melalui donasi kemanusiaan PMI Kulon Progo.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {step === 1 ? (
            <div className="bg-white border border-border rounded-[2.5rem] shadow-xl overflow-hidden p-8 md:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Form Donasi</h3>
                <p className="text-sm text-muted-foreground italic">"Setetes darah Anda nyawa bagi sesama, sepaket bantuan Anda asa bagi mereka."</p>
              </div>
              
              <form onSubmit={handleSubmitForm} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <User className="w-4 h-4 text-primary" /> Nama (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    placeholder="Nama Lengkap"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 text-primary" /> No. WhatsApp (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.wa}
                    onChange={(e) => setFormData({ ...formData, wa: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none"
                    placeholder="0812xxxx"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 text-primary" /> Keterangan (Opsional)
                  </label>
                  <textarea
                    value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none h-24 resize-none"
                    placeholder="Pesan atau doa Anda..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/20 hover:bg-[#C21219] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Mengirim..." : <>Lanjut ke Pembayaran QRIS <ArrowRight className="w-5 h-5" /></>}
                </button>
              </form>
            </div>
          ) : step === 2 ? (
            <div className="bg-white border-2 border-primary rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
              
              <div className="mb-8">
                <h3 className="text-3xl font-black text-gray-900 mb-2">Scan QRIS</h3>
                <p className="text-muted-foreground font-medium px-4">Silakan scan kode di bawah ini, lalu unggah bukti transfernya.</p>
              </div>

              <div className="max-w-sm mx-auto p-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] mb-8 group transition-all hover:border-primary/30">
                <div className="bg-white rounded-2xl flex flex-col items-center justify-center border-4 border-white shadow-lg overflow-hidden mb-4">
                  <img src="/images/qris-pmi-kulonprogo.jpg" alt="QRIS PMI Kulon Progo" className="w-full h-auto rounded-xl" />
                </div>

                <div className="text-left">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Unggah Bukti Transfer</label>
                  <div className="relative group/upload">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed transition-all ${
                      proofFile ? "bg-green-50 border-green-200 text-green-700" : "bg-white border-gray-200 text-gray-400 group-hover/upload:border-primary/30"
                    }`}>
                      {proofFile ? <CheckCircle2 className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                      <span className="text-sm font-bold truncate">
                        {proofFile ? "Bukti Terpilih" : "Klik untuk Pilih Foto"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <button 
                  onClick={handleConfirmPayment}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg hover:bg-[#C21219] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Mengirim..." : <><CheckCircle2 className="w-5 h-5" /> Konfirmasi Pembayaran</>}
                </button>
                <button 
                  onClick={() => setStep(1)}
                  className="w-full py-2 text-gray-500 font-bold hover:text-primary transition-colors text-sm"
                >
                  Kembali ke Form
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-green-500 rounded-[2.5rem] shadow-2xl p-12 text-center relative overflow-hidden animate-in zoom-in duration-300">
              <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
              
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              
              <h3 className="text-3xl font-black text-gray-900 mb-4">Terima Kasih, {formData.nama || "Dermawan"}!</h3>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Bukti transfer Anda telah kami terima dan akan segera divalidasi oleh petugas kami. 
                Semoga kebaikan Anda dibalas berlipat ganda.
              </p>

              <button 
                onClick={() => window.location.reload()}
                className="px-12 py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg hover:bg-black transition-all"
              >
                Kembali ke Beranda
              </button>
            </div>
          )}
        </div>

        <div className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 rounded-[2.5rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="max-w-2xl">
              <h3 className="text-3xl font-bold mb-4">Donasi Barang atau Logistik?</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Kami juga menerima bantuan berupa barang, logistik, atau peralatan medis. 
                Silakan hubungi markas kami untuk koordinasi lebih lanjut.
              </p>
            </div>
            <a 
              href="/kontak"
              className="bg-primary text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-[#C21219] transition-all shadow-lg hover:shadow-primary/20 whitespace-nowrap"
            >
              Hubungi Markas
            </a>
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-110"></div>
        </div>
      </div>
    </section>
  );
}

