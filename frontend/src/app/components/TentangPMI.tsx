import { Target, Eye } from "lucide-react";

export function TentangPMI() {
  const values = [
    {
      icon: Eye,
      title: "Visi",
      description:
        "PMI berkarakter, profesional, mandiri dan dicintai masyarakat.",
    },
    {
      icon: Target,
      title: "Misi",
      description:
        "1. Menjadi organisasi kemanusiaan terdepan yang memberikan layanan berkualitas kepada masyarakat sesuai dengan prinsip-prinsip dasar Gerakan Palang Merah dan Bulan Sabit Merah;\n2. Meningkatkan kemandirian organisasi PMI melalui kemitraan strategis yang berkesinambungan dengan pemerintah, swasta, mitra gerakan, masyarakat, dan pemangku kepentingan lainnya di semua tingkatan;",
    },
  ];

  return (
    <section id="tentang" className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Tentang PMI Kulon Progo</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Palang Merah Indonesia Cabang Kulon Progo telah melayani masyarakat sejak tahun 2001
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {values.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white border border-border rounded-xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-[#C21219] to-[#8B1529] text-white rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Lebih dari Sekadar Donor Darah
            </h3>
            <p className="text-white/90 mb-6 leading-relaxed">
              PMI Kulon Progo tidak hanya fokus pada donor darah, tetapi juga aktif dalam
              berbagai kegiatan kemanusiaan seperti tanggap darurat bencana, pertolongan
              pertama pada kecelakaan, pelatihan relawan, edukasi kesehatan masyarakat,
              dan program sosial lainnya. Kami berkomitmen untuk meningkatkan transparansi
              dan akuntabilitas dalam setiap kegiatan yang kami lakukan.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mt-8">
              <div>
                <div className="text-3xl font-bold mb-1">25+</div>
                <div className="text-sm text-white/80">Tahun Pengabdian</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">200+</div>
                <div className="text-sm text-white/80">Relawan Aktif</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">50K+</div>
                <div className="text-sm text-white/80">Masyarakat Terlayani</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
