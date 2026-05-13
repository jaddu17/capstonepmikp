import { DashboardLayout } from "./DashboardLayout";
import { Users, Droplet, Calendar, TrendingUp, AlertCircle } from "lucide-react";

export function DashboardOverview() {
  const stats = [
    {
      icon: Droplet,
      label: "Total Stok Darah",
      value: "180",
      unit: "kantong",
      color: "bg-red-500",
      change: "+12%",
    },
    {
      icon: Calendar,
      label: "Jadwal Donor Bulan Ini",
      value: "5",
      unit: "kegiatan",
      color: "bg-blue-500",
      change: "+2",
    },
    {
      icon: Users,
      label: "Pendonor Bulan Ini",
      value: "324",
      unit: "orang",
      color: "bg-green-500",
      change: "+18%",
    },
    {
      icon: TrendingUp,
      label: "Total Layanan",
      value: "156",
      unit: "layanan",
      color: "bg-orange-500",
      change: "+8%",
    },
  ];

  const recentActivities = [
    { action: "Update stok darah golongan A+", time: "2 jam lalu", user: "Admin" },
    { action: "Tambah jadwal donor di Alun-Alun Wates", time: "5 jam lalu", user: "Admin" },
    { action: "Publish berita donor darah masal", time: "1 hari lalu", user: "Admin" },
    { action: "Balas pesan dari pendonor", time: "1 hari lalu", user: "Admin" },
  ];

  const alerts = [
    { type: "warning", message: "Stok darah AB- menipis (3 kantong)" },
    { type: "warning", message: "Stok darah B- menipis (5 kantong)" },
    { type: "info", message: "5 pesan baru dari masyarakat" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang di dashboard admin PMI Kulon Progo
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-600 text-sm font-medium">{stat.change}</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
          <h2 className="font-semibold mb-4">Aktivitas Terbaru</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{activity.action}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {activity.time} • {activity.user}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
          <h2 className="font-semibold mb-4">Notifikasi & Peringatan</h2>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 rounded-lg ${
                  alert.type === "warning"
                    ? "bg-yellow-50 border border-yellow-200"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <AlertCircle
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    alert.type === "warning" ? "text-yellow-600" : "text-blue-600"
                  }`}
                />
                <p
                  className={`text-sm ${
                    alert.type === "warning" ? "text-yellow-800" : "text-blue-800"
                  }`}
                >
                  {alert.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
