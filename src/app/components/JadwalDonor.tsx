import { Calendar, MapPin, Clock } from "lucide-react";

export function JadwalDonor() {
  const schedules = [
    {
      date: "12 Mei 2026",
      day: "Selasa",
      location: "Alun-Alun Wates",
      time: "08:00 - 13:00 WIB",
      quota: "100 orang",
    },
    {
      date: "15 Mei 2026",
      day: "Jumat",
      location: "Kantor PMI Kulon Progo",
      time: "09:00 - 14:00 WIB",
      quota: "75 orang",
    },
    {
      date: "19 Mei 2026",
      day: "Selasa",
      location: "Pasar Sentolo",
      time: "08:00 - 12:00 WIB",
      quota: "80 orang",
    },
    {
      date: "22 Mei 2026",
      day: "Jumat",
      location: "Kampus UNY Wates",
      time: "09:00 - 15:00 WIB",
      quota: "150 orang",
    },
    {
      date: "26 Mei 2026",
      day: "Selasa",
      location: "Puskesmas Galur",
      time: "08:30 - 13:30 WIB",
      quota: "60 orang",
    },
  ];

  return (
    <section id="jadwal" className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Jadwal Mobile Unit Donor Darah</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Jadwal kunjungan mobile unit PMI Kulon Progo untuk donor darah masal di berbagai lokasi
          </p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {schedules.map((schedule, index) => (
            <div
              key={index}
              className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-primary text-white rounded-lg p-4 text-center min-w-[100px]">
                    <div className="text-2xl font-bold">{schedule.date.split(" ")[0]}</div>
                    <div className="text-sm">{schedule.date.split(" ")[1]} {schedule.date.split(" ")[2]}</div>
                    <div className="text-xs opacity-90 mt-1">{schedule.day}</div>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">{schedule.location}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{schedule.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-muted-foreground">Kuota: {schedule.quota}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <a
                    href="#kontak"
                    className="inline-block bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#C21219] transition-colors"
                  >
                    Daftar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-4xl mx-auto">
          <h3 className="font-semibold text-blue-900 mb-3">Cara Donor Darah:</h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Datang ke lokasi donor sesuai jadwal</li>
            <li>Bawa KTP/identitas diri</li>
            <li>Isi formulir pendaftaran</li>
            <li>Pemeriksaan kesehatan (tekanan darah, HB, dll)</li>
            <li>Proses donor darah (sekitar 10-15 menit)</li>
            <li>Istirahat dan konsumsi makanan yang disediakan</li>
          </ol>
          <p className="mt-4 text-sm text-blue-700">
            <strong>Catatan:</strong> Pastikan Anda sudah makan dan istirahat cukup sebelum donor darah
          </p>
        </div>
      </div>
    </section>
  );
}
