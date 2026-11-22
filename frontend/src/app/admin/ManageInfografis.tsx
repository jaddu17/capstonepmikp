import { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Save, RefreshCw, Plus, Trash2, Loader2, Image as ImageIcon, ChevronDown, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Phone, MessageSquare, Ambulance, Quote, Sparkles, Shuffle, Eye } from "lucide-react";
import { toast } from "sonner";
import { api, getStorageUrl } from "@/config/api";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { compressImage } from "@/utils/imageCompressor";

const MONTHS = [
  { full: "JANUARI", short: "JAN" },
  { full: "FEBRUARI", short: "FEB" },
  { full: "MARET", short: "MAR" },
  { full: "APRIL", short: "APR" },
  { full: "MEI", short: "MEI" },
  { full: "JUNI", short: "JUN" },
  { full: "JULI", short: "JUL" },
  { full: "AGUSTUS", short: "AGU" },
  { full: "SEPTEMBER", short: "SEP" },
  { full: "OKTOBER", short: "OKT" },
  { full: "NOVEMBER", short: "NOV" },
  { full: "DESEMBER", short: "DES" },
];

const QUOTE_INSPIRATIONS = [
  "Menjadi relawan bukan tentang seberapa besar bantuan yang diberi, tetapi seberapa tulus hati yang tergerak.",
  "Setetes darah Anda adalah nyawa bagi sesama. Mari tebarkan kepedulian tanpa batas.",
  "Kemanusiaan melampaui segala perbedaan. Bergerak bersama untuk mereka yang membutuhkan.",
  "Tiap aksi kecil kebaikan memiliki kekuatan besar untuk menyelamatkan kehidupan.",
  "Kesiapsiagaan hari ini adalah penyelamat di masa bencana esok hari.",
  "Bekerja dengan keikhlasan, mengabdi demi kemanusiaan, hadir kapan pun dibutuhkan sesama.",
  "Palang Merah hadir untuk meringankan penderitaan sesama manusia dengan tulus dan netral.",
  "Satu tindakan peduli hari ini membawa secercah harapan bagi kehidupan esok hari.",
];

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
  const [isSaving, setIsSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState<number>(new Date().getFullYear());
  const [savedSnapshot, setSavedSnapshot] = useState<string>("");
  const [monthSwitchModalOpen, setMonthSwitchModalOpen] = useState(false);
  const [pendingMonthId, setPendingMonthId] = useState<string | null>(null);
  const [deletePhotoModalOpen, setDeletePhotoModalOpen] = useState(false);
  const [photoIndexToDelete, setPhotoIndexToDelete] = useState<number | null>(null);
  const [quotePopoverOpen, setQuotePopoverOpen] = useState(false);

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
    api.get('/api/infografis')
      .then(d => d.data || d)
      .then(data => {
        if (!Array.isArray(data)) {
          console.error("Data is not an array:", data);
          return;
        }
        if (data.length > 0) {
          const formatted = data.map((d: any) => ({
            ...d,
            id: d.id.toString(),
            kontak: d.kontak ? (typeof d.kontak === 'string' ? JSON.parse(d.kontak) : d.kontak) : defaultData.kontak,
            stats: d.stats ? (typeof d.stats === 'string' ? JSON.parse(d.stats) : d.stats) : defaultData.stats,
            dokumentasi: d.dokumentasi ? (typeof d.dokumentasi === 'string' ? JSON.parse(d.dokumentasi) : d.dokumentasi) : defaultData.dokumentasi,
            pelayanan: d.pelayanan ? (typeof d.pelayanan === 'string' ? JSON.parse(d.pelayanan) : d.pelayanan) : defaultData.pelayanan
          }));
          setInfografisList(formatted);
          setActiveId(formatted[0].id);
          setSavedSnapshot(JSON.stringify(formatted));
        } else {
          // If completely empty, use default data
          const initial = [{ ...defaultData, id: Date.now().toString() }];
          setInfografisList(initial);
          setActiveId(initial[0].id);
          setSavedSnapshot(JSON.stringify(initial));
        }
      })
      .catch(err => console.error("Error fetching infografis:", err));
  }, []);

  const activeData = infografisList.find(d => d.id === activeId) || defaultData;
  const isDirty = savedSnapshot !== "" && JSON.stringify(infografisList) !== savedSnapshot;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (activeData?.tahun) {
      const parsedYear = parseInt(activeData.tahun, 10);
      if (!isNaN(parsedYear)) {
        setPickerYear(parsedYear);
      }
    }
  }, [activeData?.tahun, activeId]);

  const handleSave = () => {
    // Validasi agar tidak ada dua laporan untuk bulan dan tahun yang sama
    const duplicate = infografisList.find(item => 
      item.id !== activeId && 
      item.bulan.toUpperCase() === activeData.bulan.toUpperCase() && 
      item.tahun === activeData.tahun
    );
    if (duplicate) {
      toast.error(`Laporan infografis untuk ${activeData.bulan} ${activeData.tahun} sudah terdaftar. Silakan pilih bulan lain.`);
      return;
    }

    const getDigitCount = (str: string) => (str || "").replace(/\D/g, "").length;

    if (activeData.kontak.markas && getDigitCount(activeData.kontak.markas) < 7) {
      toast.error("Nomor Telepon Markas minimal 7 digit angka.");
      return;
    }

    if (activeData.kontak.ambulance && getDigitCount(activeData.kontak.ambulance) < 7) {
      toast.error("Nomor Unit Ambulance minimal 7 digit angka.");
      return;
    }

    if (activeData.kontak.whatsapp && getDigitCount(activeData.kontak.whatsapp) < 10) {
      toast.error("Nomor WhatsApp minimal 10 digit angka.");
      return;
    }

    const payloadToSave = {
      ...activeData,
      pelayanan: activeData.pelayanan.map(p => p.trim().toUpperCase()).filter(Boolean),
    };

    setIsSaving(true);
    const isNew = activeId.startsWith("new-");
    const request = isNew
      ? api.post('/api/infografis', payloadToSave)
      : api.put(`/api/infografis/${activeId}`, payloadToSave);

    request
      .then(d => d.data || d)
      .then(data => {
        const formatted = {
          ...data,
          id: data.id?.toString() || "",
          kontak: data.kontak ? (typeof data.kontak === 'string' ? JSON.parse(data.kontak) : data.kontak) : defaultData.kontak,
          stats: data.stats ? (typeof data.stats === 'string' ? JSON.parse(data.stats) : data.stats) : defaultData.stats,
          dokumentasi: data.dokumentasi ? (typeof data.dokumentasi === 'string' ? JSON.parse(data.dokumentasi) : data.dokumentasi) : defaultData.dokumentasi,
          pelayanan: data.pelayanan ? (typeof data.pelayanan === 'string' ? JSON.parse(data.pelayanan) : data.pelayanan) : defaultData.pelayanan
        };
        const updatedList = infografisList.map(d => d.id === activeId ? formatted : d);
        setInfografisList(updatedList);
        setSavedSnapshot(JSON.stringify(updatedList));
        const isNewRecord = activeId.startsWith("new-");
        if (isNewRecord) {
          setActiveId(formatted.id);
          toast.success("Data infografis baru berhasil disimpan & disinkronkan ke WhatsApp!");
        } else {
          toast.success("Data infografis berhasil diperbarui!");
        }
      })
      .catch((err: any) => {
        console.error(err);
        toast.error(err.message || "Gagal menyimpan data.");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleAddNew = () => {
    const newId = `new-${Date.now()}`;
    const now = new Date();
    const currentMonth = MONTHS[now.getMonth()].full;
    const currentYear = now.getFullYear().toString();
    const newData = { ...defaultData, id: newId, bulan: currentMonth, tahun: currentYear };
    setInfografisList([newData, ...infografisList]);
    setActiveId(newId);
    toast.success("Laporan bulan baru ditambahkan. Silakan atur angka lalu klik Simpan Semua!");
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
        setSavedSnapshot(JSON.stringify(updated));
        toast.success("Data berhasil dihapus!");
        setDeleteModalOpen(false);
        setItemToDelete(null);
      } else {
        api.delete(`/api/infografis/${itemToDelete}`)
          .then(() => {
            const updated = infografisList.filter(d => d.id !== itemToDelete);
            setInfografisList(updated);
            setActiveId(updated[0].id);
            setSavedSnapshot(JSON.stringify(updated));
            toast.success("Data berhasil dihapus dari database!");
          })
          .catch((err: any) => {
            console.error(err);
            toast.error(err.message || "Gagal menghapus data.");
          })
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
    // Bersihkan karakter non-angka dan hapus leading zero (contoh: "023" -> "23", "05" -> "5")
    const digitsOnly = value.replace(/[^0-9]/g, "");
    const cleanValue = digitsOnly.replace(/^0+(?=\d)/, "");

    updateActiveData({
      stats: {
        ...activeData.stats,
        [key]: cleanValue === "" ? 0 : Math.max(0, parseInt(cleanValue, 10))
      }
    });
  };

  const updateKontak = (key: keyof InfografisData["kontak"], value: string) => {
    // Hanya perbolehkan karakter angka, spasi, tanda tambah (+), dan tanda strip (-)
    const sanitized = value.replace(/[^0-9\s\-+]/g, "");
    updateActiveData({
      kontak: {
        ...activeData.kontak,
        [key]: sanitized
      }
    });
  };

  const handleAddPelayanan = () => {
    updateActiveData({
      pelayanan: [...activeData.pelayanan, ""]
    });
  };

  const handleRemovePelayanan = (index: number) => {
    updateActiveData({
      pelayanan: activeData.pelayanan.filter((_, i) => i !== index)
    });
  };

  const handleUpdatePelayanan = (index: number, value: string) => {
    const newPelayanan = [...activeData.pelayanan];
    newPelayanan[index] = value.toUpperCase();
    updateActiveData({ pelayanan: newPelayanan });
  };

  const handleUpdateDokumentasi = (index: number, value: string) => {
    const newDok = [...activeData.dokumentasi];
    if (newDok[index]) {
      // Ganti foto yang sudah ada di slot ini
      newDok[index] = value;
    } else {
      // Tambah foto ke slot kosong pertama yang tersedia agar urutan selalu rapat
      const firstEmptyIdx = newDok.findIndex(item => !item);
      const targetIdx = firstEmptyIdx !== -1 ? firstEmptyIdx : index;
      newDok[targetIdx] = value;
    }
    updateActiveData({ dokumentasi: newDok });
  };

  const handleRemoveDokumentasi = (index: number) => {
    // Ambil semua foto kecuali yang dihapus, geser foto berikutnya naik ke atas
    const remaining = activeData.dokumentasi.filter((item, i) => i !== index && Boolean(item));
    while (remaining.length < 6) {
      remaining.push("");
    }
    updateActiveData({ dokumentasi: remaining });
  };

  const handleRandomQuote = () => {
    const candidates = QUOTE_INSPIRATIONS.filter((q) => q !== activeData.quote);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)] || QUOTE_INSPIRATIONS[0];
    updateActiveData({ quote: chosen });
    toast.success("Quote inspirasi acak berhasil dipilih!");
  };

  return (
    <DashboardLayout isDirty={isDirty}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold">Kelola Infografis</h1>
            {isDirty && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 shadow-2xs animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Belum Disimpan
              </span>
            )}
          </div>
          <div className="relative">
            <select 
              value={activeId}
              onChange={(e) => {
                const nextId = e.target.value;
                if (isDirty) {
                  setPendingMonthId(nextId);
                  setMonthSwitchModalOpen(true);
                } else {
                  setActiveId(nextId);
                }
              }}
              className="appearance-none pl-3.5 pr-9 py-2 bg-white border border-border rounded-xl font-semibold text-gray-800 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none shadow-xs cursor-pointer hover:border-gray-300 transition-all"
            >
              {infografisList.map(item => (
                <option key={item.id} value={item.id}>
                  {item.bulan} {item.tahun}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-border hover:border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4 text-primary" />
            Bulan Baru
          </button>
          <button
            type="button"
            onClick={() => handleDelete(activeId)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-sm font-semibold transition-colors"
            title="Hapus laporan bulan ini"
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white hover:bg-[#C21219] rounded-xl text-sm font-semibold transition-all shadow-sm shadow-primary/20 hover:shadow-md disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Semua</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Basic Info & Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <h3 className="font-bold mb-4 text-lg border-b pb-2">Informasi Umum</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Periode Laporan (Bulan & Tahun)
              </label>
              <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-border rounded-xl text-sm font-semibold text-gray-800 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-xs group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <CalendarIcon className="w-4 h-4" />
                      </div>
                      <span className="text-base font-bold text-gray-900 tracking-wide">
                        {activeData.bulan} {activeData.tahun}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-3.5 bg-white border border-gray-200 rounded-2xl shadow-xl z-50" align="start">
                  {/* Year Navigator */}
                  {(() => {
                    const now = new Date();
                    const currentYear = now.getFullYear();
                    const currentMonthIdx = now.getMonth();
                    const isNextYearDisabled = pickerYear >= currentYear;

                    return (
                      <>
                        <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100">
                          <button
                            type="button"
                            onClick={() => setPickerYear(prev => prev - 1)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                            title="Tahun Sebelumnya"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-base text-gray-900">
                            {pickerYear}
                          </span>
                          <button
                            type="button"
                            disabled={isNextYearDisabled}
                            onClick={() => setPickerYear(prev => prev + 1)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isNextYearDisabled
                                ? "opacity-25 cursor-not-allowed text-gray-300"
                                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                            }`}
                            title={isNextYearDisabled ? "Tahun berikutnya belum tersedia" : "Tahun Berikutnya"}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* 12 Months Grid */}
                        <div className="grid grid-cols-3 gap-1.5">
                          {MONTHS.map((m, idx) => {
                            const isSelected = activeData.bulan === m.full && activeData.tahun === pickerYear.toString();
                            const isFuture = pickerYear > currentYear || (pickerYear === currentYear && idx > currentMonthIdx);

                            return (
                              <button
                                key={m.full}
                                type="button"
                                disabled={isFuture}
                                title={isFuture ? "Bulan mendatang belum dapat dilaporkan" : undefined}
                                onClick={() => {
                                  if (isFuture) return;
                                  updateActiveData({
                                    bulan: m.full,
                                    tahun: pickerYear.toString(),
                                  });
                                  setPickerOpen(false);
                                }}
                                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                                  isFuture
                                    ? "opacity-30 cursor-not-allowed text-gray-400 bg-gray-50/50 hover:bg-gray-50/50 hover:text-gray-400 select-none"
                                    : isSelected
                                      ? "bg-primary text-white shadow-sm shadow-primary/30"
                                      : "text-gray-700 hover:bg-red-50 hover:text-primary"
                                }`}
                              >
                                {m.short}
                              </button>
                            );
                          })}
                        </div>

                        {/* Quick Shortcut */}
                        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-muted-foreground px-1">
                          <span>Maks: {MONTHS[currentMonthIdx].short} {currentYear}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const currentMonth = MONTHS[currentMonthIdx].full;
                              setPickerYear(currentYear);
                              updateActiveData({ bulan: currentMonth, tahun: currentYear.toString() });
                              setPickerOpen(false);
                            }}
                            className="text-primary hover:underline font-semibold"
                          >
                            Bulan Ini
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground mt-2">
                Hanya periode bulan berjalan dan bulan yang telah lewat yang dapat dipilih untuk laporan akuntabilitas.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <h3 className="font-bold mb-4 text-lg border-b pb-2">Kontak Markas</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Telepon Markas
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    inputMode="tel"
                    maxLength={20}
                    value={activeData.kontak.markas}
                    onChange={(e) => updateKontak("markas", e.target.value)}
                    placeholder="Contoh: 0274 773244"
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                  <Ambulance className="w-4 h-4 text-blue-600" />
                  Unit Ambulance
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    inputMode="tel"
                    maxLength={20}
                    value={activeData.kontak.ambulance}
                    onChange={(e) => updateKontak("ambulance", e.target.value)}
                    placeholder="Contoh: 0274 7724533"
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Nomor WhatsApp
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    inputMode="tel"
                    maxLength={20}
                    value={activeData.kontak.whatsapp}
                    onChange={(e) => updateKontak("whatsapp", e.target.value)}
                    placeholder="Contoh: 0813 2886 1118"
                    className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                Hanya menerima angka, spasi, (+) dan (-). Maks. 20 karakter.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <h3 className="font-bold text-lg">Statistik Layanan</h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-primary border border-red-100">
                Total: {Object.values(activeData.stats).reduce((a, b) => a + (Number(b) || 0), 0)} Layanan
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(activeData.stats).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-bold mb-2 uppercase text-gray-500">
                    {key.replace(/_/g, " ")}
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={value === 0 ? "" : value}
                    placeholder="0"
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => updateStat(key as any, e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Documentation & Pelayanan */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <h3 className="font-bold text-lg">Dokumentasi (Upload Gambar)</h3>
              <span className="text-xs text-muted-foreground">Maks 6 foto (Otomatis dioptimasi & dikompres)</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {activeData.dokumentasi.slice(0, 6).map((url, idx) => (
                <div key={idx} className="relative group/doc">
                  <div className={`aspect-video rounded-xl border-2 overflow-hidden relative transition-all ${
                    url 
                      ? "border-border bg-gray-100" 
                      : "border-dashed border-gray-300 hover:border-primary/50 bg-gray-50 hover:bg-gray-100"
                  }`}>
                    {url ? (
                      <>
                        <img src={getStorageUrl(url)} alt={`Dokumentasi ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/doc:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="text-white text-xs font-semibold bg-black/60 px-3 py-1 rounded-full">
                            Ganti Foto
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 group-hover/doc:text-primary transition-colors p-2 text-center">
                        <ImageIcon className="w-6 h-6 mb-1 text-gray-400 group-hover/doc:text-primary transition-colors" />
                        <span className="text-xs font-medium">Foto {idx + 1}</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const compressed = await compressImage(file, 1400, 0.82, 700);
                            handleUpdateDokumentasi(idx, compressed);
                            toast.success(`Foto ${idx + 1} berhasil dipilih & dioptimasi.`);
                          } catch (err: any) {
                            console.error(err);
                            toast.error(err.message || "Gagal memproses gambar.");
                          }
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      title={url ? "Klik untuk mengganti foto" : "Klik untuk memilih foto"}
                    />
                  </div>
                  {url && (
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhotoIndexToDelete(idx);
                        setDeletePhotoModalOpen(true);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-lg shadow-sm transition-all z-20 hover:scale-105"
                      title={`Hapus foto ${idx + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
                type="button"
                onClick={handleAddPelayanan}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-border rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-primary" />
                Tambah Layanan
              </button>
            </div>

            {/* Input List */}
            <div className="space-y-2.5">
              {activeData.pelayanan.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 w-5 text-right">{idx + 1}.</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleUpdatePelayanan(idx, e.target.value)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-bold uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="CONTOH: PERTOLONGAN PERTAMA"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePelayanan(idx)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus baris ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {activeData.pelayanan.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl text-xs text-muted-foreground">
                  Belum ada layanan yang ditambahkan. Klik tombol "+ Tambah Layanan" di atas.
                </div>
              )}
            </div>
          </div>

          {/* Kata-kata Hari Ini (Quote) */}
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#C41E3A] flex items-center justify-center">
                  <Quote className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">Kata-kata Hari Ini (Quote)</h3>
                  <p className="text-xs text-muted-foreground">Pesan inspiratif kemanusiaan yang tampil di Beranda publik</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Popover Inspirasi */}
                <Popover open={quotePopoverOpen} onOpenChange={setQuotePopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-[#C41E3A] hover:bg-red-100 transition-colors border border-red-200 shadow-2xs cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Pilih Inspirasi
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 sm:w-96 p-3 z-50 bg-white shadow-xl rounded-xl border border-gray-200" align="end">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b">
                      <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C41E3A]" />
                        Inspirasi Quote PMI
                      </span>
                      <span className="text-[10px] text-muted-foreground">Klik untuk memasang</span>
                    </div>
                    <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                      {QUOTE_INSPIRATIONS.map((quote, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            updateActiveData({ quote });
                            setQuotePopoverOpen(false);
                            toast.success("Quote inspirasi berhasil dipasang!");
                          }}
                          className="w-full text-left p-2.5 rounded-lg text-xs text-gray-700 hover:bg-red-50 hover:text-[#C41E3A] transition-colors border border-transparent hover:border-red-200 group flex items-start gap-2 cursor-pointer"
                        >
                          <span className="text-[#C41E3A] font-bold text-sm leading-none mt-0.5">“</span>
                          <span className="flex-1 italic leading-relaxed">{quote}</span>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Tombol Acak */}
                <button
                  type="button"
                  onClick={handleRandomQuote}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors shadow-2xs cursor-pointer"
                  title="Pilih quote acak dari daftar inspirasi"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  Acak
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={activeData.quote}
                onChange={(e) => {
                  if (e.target.value.length <= 250) {
                    updateActiveData({ quote: e.target.value });
                  }
                }}
                maxLength={250}
                rows={3}
                className="w-full px-4 py-3 border border-border rounded-xl text-sm italic focus:ring-2 focus:ring-[#C41E3A]/20 focus:border-[#C41E3A] transition-all resize-none bg-gray-50/50"
                placeholder="Tulis kata-kata motivasi atau pesan kemanusiaan hari ini..."
              />
              <div className="flex items-center justify-between mt-1.5 px-1">
                <span className="text-[11px] text-muted-foreground hidden sm:inline">
                  Gunakan kalimat ringkas & menyentuh hati.
                </span>
                <span className={`text-[11px] font-medium ml-auto ${activeData.quote.length >= 230 ? 'text-amber-600 font-bold' : 'text-muted-foreground'}`}>
                  {activeData.quote.length} / 250 karakter
                </span>
              </div>
            </div>

            {/* Live Mini Preview di Beranda */}
            <div className="mt-5 pt-4 border-t border-dashed border-gray-200">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                  <Eye className="w-3.5 h-3.5 text-[#C41E3A]" />
                  <span>Live Mini-Preview di Beranda:</span>
                </div>
                <span className="text-[10px] font-bold tracking-wide uppercase bg-red-50 text-[#C41E3A] px-2 py-0.5 rounded-full border border-red-200">
                  Tampilan Publik
                </span>
              </div>

              <div className="bg-[#C41E3A] text-white rounded-2xl p-6 relative overflow-hidden shadow-md text-center">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="text-white/30 text-4xl font-serif absolute -top-3 left-1 select-none">“</div>
                  <p className="text-sm md:text-base font-bold italic text-white leading-relaxed px-6 min-h-[1.5rem]">
                    {activeData.quote.trim() ? activeData.quote : <span className="opacity-40 font-normal">Kutipan kata-kata inspirasi akan tampil di sini...</span>}
                  </p>
                  <div className="text-white/30 text-4xl font-serif absolute -bottom-5 right-1 rotate-180 select-none">“</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 transform transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Hapus</h3>
            <p className="text-sm text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus data bulan ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Month Switch Confirmation Modal */}
      {monthSwitchModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-gray-900 mb-1.5">Perubahan Belum Disimpan</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Anda memiliki data pada bulan ini yang telah diubah tetapi belum disimpan. Jika berpindah bulan, perubahan tersebut akan hilang.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setMonthSwitchModalOpen(false);
                  setPendingMonthId(null);
                }}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Tetap di Bulan Ini
              </button>
              <button
                type="button"
                onClick={() => {
                  setMonthSwitchModalOpen(false);
                  if (pendingMonthId) {
                    setActiveId(pendingMonthId);
                    if (savedSnapshot) {
                      try {
                        setInfografisList(JSON.parse(savedSnapshot));
                      } catch {}
                    }
                    setPendingMonthId(null);
                  }
                }}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-sm"
              >
                Ya, Ganti Bulan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Photo Confirmation Modal */}
      {deletePhotoModalOpen && photoIndexToDelete !== null && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Foto</h3>
            <p className="text-sm text-gray-600 mb-6">
              Yakin ingin menghapus Foto {photoIndexToDelete + 1}?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeletePhotoModalOpen(false);
                  setPhotoIndexToDelete(null);
                }}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  handleRemoveDokumentasi(photoIndexToDelete);
                  setDeletePhotoModalOpen(false);
                  setPhotoIndexToDelete(null);
                  toast.success(`Foto ${photoIndexToDelete + 1} berhasil dihapus.`);
                }}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
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
