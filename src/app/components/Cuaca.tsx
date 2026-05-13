import { Cloud, CloudRain, Sun, Wind, Droplets } from "lucide-react";

export function Cuaca() {
  const currentWeather = {
    location: "Kulon Progo, DIY",
    date: "10 Mei 2026",
    temperature: 28,
    condition: "Cerah Berawan",
    humidity: 65,
    windSpeed: 12,
    icon: Cloud,
  };

  const forecast = [
    { day: "Senin", temp: "27°C", icon: Sun, condition: "Cerah" },
    { day: "Selasa", temp: "26°C", icon: Cloud, condition: "Berawan" },
    { day: "Rabu", temp: "25°C", icon: CloudRain, condition: "Hujan Ringan" },
    { day: "Kamis", temp: "27°C", icon: Cloud, condition: "Berawan" },
    { day: "Jumat", temp: "28°C", icon: Sun, condition: "Cerah" },
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-3 gap-6 p-8">
            <div className="md:col-span-1 flex flex-col justify-center">
              <div className="text-sm text-muted-foreground mb-2">
                {currentWeather.date}
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Cuaca {currentWeather.location}
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                  <currentWeather.icon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <div className="text-5xl font-bold">{currentWeather.temperature}°C</div>
                  <div className="text-muted-foreground">
                    {currentWeather.condition}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Kelembaban</div>
                    <div className="font-semibold">{currentWeather.humidity}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Angin</div>
                    <div className="font-semibold">{currentWeather.windSpeed} km/h</div>
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
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <day.icon className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="font-bold mb-1">{day.temp}</div>
                    <div className="text-xs text-muted-foreground">{day.condition}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
