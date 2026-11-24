import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, CalendarCheck, History, MessageCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/config/api";
import { SITE_CONFIG } from "@/config/site";
import { getScheduleStatus, parseJadwalDate } from "@/utils/jadwalHelper";

interface Schedule {
  id: string;
  date: string;
  day: string;
  location: string;
  time: string;
  quota: string;
}

export function JadwalDonor() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  useEffect(() => {
    setLoading(true);
    api.get('/api/jadwal-donors?all=true')
      .then(d => d.data || d)
      .then(data => {
        const rawList = Array.isArray(data) ? data : (data?.data ? data.data : []);
        setSchedules(rawList);
      })
      .catch(err => {
        console.error("Error fetching jadwal donors:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Pisahkan jadwal otomatis: Mendatang & Hari Ini vs Riwayat Selesai
  const upcomingSchedules = schedules.filter(s => getScheduleStatus(s.date) !== 'past');
  upcomingSchedules.sort((a, b) => (parseJadwalDate(a.date)?.getTime() || 0) - (parseJadwalDate(b.date)?.getTime() || 0));

  const historySchedules = schedules.filter(s => getScheduleStatus(s.date) === 'past');
  historySchedules.sort((a, b) => (parseJadwalDate(b.date)?.getTime() || 0) - (parseJadwalDate(a.date)?.getTime() || 0));

  const displayedSchedules = activeTab === 'upcoming' ? upcomingSchedules : historySchedules;

  const renderDateBox = (dateStr: string, dayStr: string, isPast: boolean, isToday: boolean) => {
    const parsed = parseJadwalDate(dateStr);
    let dayNum = dateStr.split(" ")[0] || "";
    let monthYear = `${dateStr.split(" ")[1] || ""} ${dateStr.split(" ")[2] || ""}`.trim();

    if (parsed) {
      dayNum = String(parsed.getDate());
      monthYear = parsed.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
    }

    const bgClass = isToday
      ? "bg-gradient-to-br from-[#C41E3A] to-amber-600 text-white shadow-md shadow-amber-500/20"
      : isPast
      ? "bg-gray-600 text-white"
      : "bg-primary text-white";

    return (
      <div className={`${bgClass} rounded-2xl p-4 text-center min-w-[110px] flex flex-col justify-center transition-all`}>
        <div className="text-3xl font-black tracking-tight leading-none mb-1">{dayNum}</div>
        <div className="text-xs font-bold uppercase tracking-wider opacity-90">{monthYear}</div>
        <div className="text-[11px] font-semibold opacity-80 mt-1 border-t border-white/20 pt-1">{dayStr}</div>
      </div>
    );
  };

  return (
    <section id="jadwal" className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 shadow-sm">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">
            Jadwal Mobile Unit Donor Darah
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Kunjungan mobile unit PMI Kulon Progo untuk pelayanan donor darah masal langsung di tengah masyarakat.
          </p>
        </div>

        {/* Tab Toggle: Jadwal Mendatang vs Riwayat Selesai */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Jadwal Mendatang</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'upcoming' ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-700'
              }`}>
                {upcomingSchedules.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat Kegiatan</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'history' ? 'bg-gray-200 text-gray-900' : 'bg-gray-200 text-gray-700'
              }`}>
                {historySchedules.length}
              </span>
            </button>
          </div>
        </div>

        {/* Daftar Jadwal */}
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-medium">Memuat jadwal donor...</p>
          </div>
        ) : displayedSchedules.length === 0 ? (
          activeTab === 'upcoming' ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
              <div className="w-14 h-14 bg-red-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Belum Ada Jadwal Mobile Unit Mendatang</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Agenda kunjungan mobile unit berikutnya sedang dipersiapkan. Untuk donor darah rutin, Anda tetap dapat langsung mengunjungi <strong>Markas PMI Kulon Progo</strong> setiap hari.
              </p>
              <a
                href={SITE_CONFIG.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#C21219] transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hubungi WhatsApp PMI</span>
              </a>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center text-muted-foreground text-sm max-w-xl mx-auto">
              Belum ada riwayat kegiatan donor darah yang selesai.
            </div>
          )
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {displayedSchedules.map((schedule) => {
              const status = getScheduleStatus(schedule.date);
              const isToday = status === 'today';
              const isPast = status === 'past';

              return (
                <div
                  key={schedule.id}
                  className={`bg-white border rounded-2xl p-6 transition-all hover:shadow-md ${
                    isToday
                      ? "border-amber-300 ring-2 ring-amber-400/20 shadow-sm"
                      : isPast
                      ? "border-gray-200 opacity-85 hover:opacity-100"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-5">
                    {/* Kotak Tanggal */}
                    <div className="flex-shrink-0">
                      {renderDateBox(schedule.date, schedule.day, isPast, isToday)}
                    </div>

                    {/* Informasi Lokasi & Waktu */}
                    <div className="flex-1 space-y-2.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        {isToday && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white rounded-full text-[11px] font-black uppercase tracking-wider shadow-xs">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            Berlangsung Hari Ini
                          </span>
                        )}
                        {isPast && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold border border-gray-200">
                            Kegiatan Selesai
                          </span>
                        )}
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-snug">
                          {schedule.location}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-muted-foreground font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{schedule.time}</span>
                        </div>
                        {schedule.quota && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span>Target: {schedule.quota}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex-shrink-0 pt-2 md:pt-0">
                      {isPast ? (
                        <div className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold border border-gray-200">
                          <CheckCircle2 className="w-4 h-4 text-gray-400" />
                          <span>Selesai Terlaksana</span>
                        </div>
                      ) : (
                        <a
                          href={`https://wa.me/${SITE_CONFIG.whatsappRaw}?text=${encodeURIComponent(
                            `Halo Admin PMI Kulon Progo, saya ingin mendaftar donor darah untuk jadwal di ${schedule.location} (${schedule.day}, ${schedule.date}).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#C21219] transition-all shadow-sm shadow-primary/20 hover:shadow-md hover:scale-[1.02] w-full md:w-auto"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Daftar via WA</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Panduan & Syarat Donor */}
        <div className="mt-14 bg-blue-50/70 border border-blue-200 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-xs">
          <h3 className="font-bold text-blue-950 text-base sm:text-lg mb-3 flex items-center gap-2">
            <span>Syarat & Prosedur Donor Darah:</span>
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-blue-900 leading-relaxed font-medium">
            <li>Datang langsung ke lokasi mobile unit sesuai jam operasional di atas.</li>
            <li>Membawa kartu identitas resmi (KTP / SIM / Kartu Pendonor PMI).</li>
            <li>Berusia 17–60 tahun dengan berat badan minimal 45 kg.</li>
            <li>Pemeriksaan kesehatan singkat di lokasi (cek tekanan darah dan kadar hemoglobin/Hb).</li>
            <li>Proses pengambilan darah hanya berlangsung sekitar 10–15 menit.</li>
            <li>Istirahat sejenak dan nikmati nutrisi pemulihan yang telah disiapkan tim PMI.</li>
          </ol>
          <p className="mt-4 text-xs text-blue-700 bg-white/60 p-3 rounded-xl border border-blue-100">
            💡 <strong>Tips:</strong> Pastikan Anda telah tidur cukup minimal 5 jam dan sudah makan sebelum menuju ke lokasi donor.
          </p>
        </div>
      </div>
    </section>
  );
}
