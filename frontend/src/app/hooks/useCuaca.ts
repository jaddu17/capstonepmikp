import { useState, useEffect } from "react";
import { Cloud, CloudRain, CloudFog, Sun } from "lucide-react";

// Koordinat Wates, Kulon Progo, DIY
const KULON_PROGO_LAT = -7.8166;
const KULON_PROGO_LON = 110.1624;

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export function getWeatherInfo(code: number) {
  if (code === 0) return { condition: "Cerah", icon: Sun };
  if (code === 1 || code === 2) return { condition: "Cerah Berawan", icon: Cloud };
  if (code === 3) return { condition: "Berawan", icon: Cloud };
  if (code === 45 || code === 48) return { condition: "Berkabut", icon: CloudFog };
  if (code >= 51 && code <= 55) return { condition: "Gerimis", icon: CloudRain };
  if (code >= 61 && code <= 65) return { condition: "Hujan", icon: CloudRain };
  if (code >= 80 && code <= 82) return { condition: "Hujan Ringan", icon: CloudRain };
  if (code >= 95) return { condition: "Badai Petir", icon: CloudRain };
  return { condition: "Berawan", icon: Cloud };
}

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: typeof Cloud;
}

export interface ForecastDay {
  day: string;
  temp: string;
  condition: string;
  icon: typeof Cloud;
}

interface WeatherState {
  current: CurrentWeather | null;
  forecast: ForecastDay[];
  loading: boolean;
  error: boolean;
}

/**
 * Hook bersama untuk ambil data cuaca Kulon Progo dari Open-Meteo.
 * Dipakai oleh CuacaBadge (Hero) dan Cuaca (section lengkap) supaya
 * datanya konsisten dan tidak fetch dobel secara terpisah.
 */
export function useCuaca(): WeatherState {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${KULON_PROGO_LAT}&longitude=${KULON_PROGO_LON}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code` +
      `&daily=weather_code,temperature_2m_max` +
      `&timezone=Asia%2FJakarta&forecast_days=5`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const currentInfo = getWeatherInfo(data.current.weather_code);
        setCurrent({
          temperature: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m),
          condition: currentInfo.condition,
          icon: currentInfo.icon,
        });

        const days: ForecastDay[] = data.daily.time.map((dateStr: string, index: number) => {
          const info = getWeatherInfo(data.daily.weather_code[index]);
          return {
            day: DAY_NAMES[new Date(dateStr).getDay()],
            temp: `${Math.round(data.daily.temperature_2m_max[index])}°C`,
            condition: info.condition,
            icon: info.icon,
          };
        });

        setForecast(days);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cuaca:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  return { current, forecast, loading, error };
}