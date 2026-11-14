import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Users, Droplet, Calendar, TrendingUp, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { api } from "@/config/api";

interface DashboardStatsData {
  stats: {
    total_stok: number;
    jadwal_donor: number;
    total_donasi: number;
    total_layanan: number;
  };
  alerts: Array<{
    type: "warning" | "info";
    message: string;
  }>;
  recent_activities: Array<{
    action: string;
    time: string;
    user: string;
  }>;
}

export function DashboardOverview() {
  const [data, setData] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardStats = useCallback((isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    api.get<DashboardStatsData>('/api/dashboard/stats')
      .then((res: any) => {
        setData(res);
      })
      .catch((err: any) => {
        console.error("Gagal memuat statistik dashboard:", err);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    fetchDashboardStats(true);
  }, [fetchDashboardStats]);

  const stats = [
    {
      icon: Droplet,
      label: "Total Stok Darah",
      value: data?.stats?.total_stok ?? 0,
      unit: "kantong",
      color: "bg-red-500",
    },
    {
      icon: Calendar,
      label: "Jadwal Donor Aktif",
      value: data?.stats?.jadwal_donor ?? 0,
      unit: "kegiatan",
      color: "bg-blue-500",
    },
    {
      icon: Users,
      label: "Total Donasi Masuk",
      value: data?.stats?.total_donasi ?? 0,
      unit: "donatur",
      color: "bg-green-500",
    },
    {
      icon: TrendingUp,
      label: "Total Layanan",
      value: data?.stats?.total_layanan ?? 0,
      unit: "layanan",
      color: "bg-orange-500",
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Selamat datang di dashboard admin PMI Kulon Progo
          </p>
        </div>
        <button
          onClick={() => fetchDashboardStats(false)}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-2 self-start sm:self-auto bg-white border border-border px-3.5 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm font-medium">Memuat ringkasan data real-time...</span>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center shadow-xs`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-gray-100 px-2.5 py-1 rounded-full">
                    {stat.unit}
                  </span>
                </div>
                <div className="text-3xl font-extrabold mb-1 text-gray-900 tracking-tight">{stat.value}</div>
                <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Aktivitas Terbaru */}
            <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
              <h2 className="font-semibold text-lg mb-4 text-gray-900">Aktivitas Terbaru</h2>
              <div className="space-y-4">
                {(!data?.recent_activities || data.recent_activities.length === 0) ? (
                  <div className="py-8 text-center text-xs text-muted-foreground italic">
                    Belum ada aktivitas tercatat di sistem
                  </div>
                ) : (
                  data.recent_activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="w-2.5 h-2.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 truncate">{activity.action}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {activity.time} • {activity.user}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Notifikasi & Peringatan */}
            <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
              <h2 className="font-semibold text-lg mb-4 text-gray-900">Notifikasi & Peringatan</h2>
              <div className="space-y-3">
                {(!data?.alerts || data.alerts.length === 0) ? (
                  <div className="py-8 text-center text-xs text-muted-foreground italic">
                    Tidak ada peringatan aktif saat ini
                  </div>
                ) : (
                  data.alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-4 rounded-xl border ${alert.type === "warning"
                          ? "bg-amber-50/70 border-amber-200 text-amber-900"
                          : "bg-blue-50/70 border-blue-200 text-blue-900"
                        }`}
                    >
                      <AlertCircle
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${alert.type === "warning" ? "text-amber-600" : "text-blue-600"
                          }`}
                      />
                      <p className="text-sm font-medium leading-relaxed">{alert.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
