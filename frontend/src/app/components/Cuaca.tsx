import { Wind, Droplets } from "lucide-react";
import { useCuaca } from "../hooks/useCuaca";

export function Cuaca() {
  const { current, forecast, loading, error } = useCuaca();

  // Kalau API gagal diakses, sembunyikan section daripada nampilin data salah
  if (error || (!loading && !current)) return null;

  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <section id="cuaca" className="py-12 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading || !current ? (
            <div className="p-8 text-center text-muted-foreground">Memuat data cuaca...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 p-8">
              <div className="md:col-span-1 flex flex-col justify-center">
                <div className="text-sm text-muted-foreground mb-2">{today}</div>
                <h3 className="text-2xl font-bold mb-4">Cuaca Kulon Progo, DIY</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#E4002B] to-[#b3001f] rounded-full flex items-center justify-center">
                    <current.icon className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <div className="text-5xl font-bold">{current.temperature}°C</div>
                    <div className="text-muted-foreground">{current.condition}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Kelembaban</div>
                      <div className="font-semibold">{current.humidity}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">Angin</div>
                      <div className="font-semibold">{current.windSpeed} km/h</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h4 className="font-semibold mb-4">Prakiraan 5 Hari</h4>
                <div className="grid grid-cols-5 gap-2">
                  {forecast.map((day, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center hover:shadow-md transition-shadow"
                    >
                      <div className="text-sm font-medium mb-2">{day.day}</div>
                      <div className="flex justify-center mb-2">
                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                          <day.icon className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <div className="font-bold mb-1">{day.temp}</div>
                      <div className="text-xs text-muted-foreground">{day.condition}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}