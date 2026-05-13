import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { Login } from "./admin/Login";
import { ProtectedRoute } from "./admin/ProtectedRoute";
import { DashboardOverview } from "./admin/DashboardOverview";
import { ManageStokDarah } from "./admin/ManageStokDarah";
import { ManageJadwal } from "./admin/ManageJadwal";
import { ManageBerita } from "./admin/ManageBerita";
import { ManagePesan } from "./admin/ManagePesan";
import { ManageInfografis } from "./admin/ManageInfografis";
import { ManageDonasi } from "./admin/ManageDonasi";

// Public Pages
import Home from "./pages/Home";
import StokDarahPage from "./pages/StokDarahPage";
import InfoDonorPage from "./pages/InfoDonorPage";
import JadwalPage from "./pages/JadwalPage";
import BeritaPage from "./pages/BeritaPage";
import DonasiPage from "./pages/DonasiPage";
import KontakPage from "./pages/KontakPage";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stok-darah" element={<StokDarahPage />} />
        <Route path="/info-donor" element={<InfoDonorPage />} />
        <Route path="/jadwal" element={<JadwalPage />} />
        <Route path="/berita" element={<BeritaPage />} />
        <Route path="/donasi" element={<DonasiPage />} />
        <Route path="/kontak" element={<KontakPage />} />
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <DashboardOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stok-darah"
          element={
            <ProtectedRoute>
              <ManageStokDarah />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jadwal"
          element={
            <ProtectedRoute>
              <ManageJadwal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/berita"
          element={
            <ProtectedRoute>
              <ManageBerita />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pesan"
          element={
            <ProtectedRoute>
              <ManagePesan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/infografis"
          element={
            <ProtectedRoute>
              <ManageInfografis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/donasi"
          element={
            <ProtectedRoute>
              <ManageDonasi />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}