import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Droplet,
  Calendar,
  Newspaper,
  MessageSquare,
  PieChart,
  Wallet,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  User,
  Loader2,
} from "lucide-react";
import { api } from "@/config/api";
import { toast } from "sonner";

interface DashboardLayoutProps {
  children: ReactNode;
  isDirty?: boolean;
}

export function DashboardLayout({ children, isDirty = false }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  // State untuk Ubah Akun & Password
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountTab, setAccountTab] = useState<"password" | "username">("password");
  const [currentUsername, setCurrentUsername] = useState<string>(
    localStorage.getItem("admin_username") || "admin"
  );
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [usernameForm, setUsernameForm] = useState({
    username: localStorage.getItem("admin_username") || "admin",
    current_password: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("admin_username");
    if (stored) {
      setCurrentUsername(stored);
    } else {
      api.get("/api/user")
        .then((u) => {
          if (u && u.name) {
            localStorage.setItem("admin_username", u.name);
            setCurrentUsername(u.name);
          }
        })
        .catch(() => {});
    }
  }, []);

  const openAccountModal = () => {
    const stored = localStorage.getItem("admin_username") || currentUsername || "admin";
    setAccountTab("password");
    setPasswordForm({
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
    setUsernameForm({
      username: stored,
      current_password: "",
    });
    setAccountError(null);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsAccountModalOpen(true);
    setSidebarOpen(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError(null);

    if (!passwordForm.current_password) {
      setAccountError("Password saat ini wajib diisi.");
      return;
    }
    if (passwordForm.new_password.length < 8) {
      setAccountError("Password baru minimal 8 karakter.");
      return;
    }
    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      setAccountError("Konfirmasi password baru tidak cocok.");
      return;
    }
    if (passwordForm.new_password === passwordForm.current_password) {
      setAccountError("Password baru tidak boleh sama dengan password saat ini.");
      return;
    }

    setIsSavingAccount(true);
    try {
      const res = await api.put("/api/user/credentials", {
        username: currentUsername,
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
        new_password_confirmation: passwordForm.new_password_confirmation,
      });
      toast.success(res.message || "Password berhasil diperbarui!");
      setIsAccountModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setAccountError(err.message || "Gagal memperbarui password.");
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError(null);

    if (!usernameForm.username.trim()) {
      setAccountError("Username tidak boleh kosong.");
      return;
    }
    if (usernameForm.username.trim().length < 3) {
      setAccountError("Username minimal 3 karakter.");
      return;
    }
    if (!usernameForm.current_password) {
      setAccountError("Password saat ini wajib diisi untuk verifikasi keamanan.");
      return;
    }

    setIsSavingAccount(true);
    try {
      const res = await api.put("/api/user/credentials", {
        username: usernameForm.username.trim(),
        current_password: usernameForm.current_password,
      });
      const updatedName = res.user?.name || usernameForm.username.trim();
      localStorage.setItem("admin_username", updatedName);
      setCurrentUsername(updatedName);
      toast.success("Username berhasil diperbarui!");
      setIsAccountModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setAccountError(err.message || "Gagal memperbarui username.");
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleNavClick = (e: React.MouseEvent, targetPath: string) => {
    if (isDirty && location.pathname !== targetPath) {
      e.preventDefault();
      setPendingPath(targetPath);
      setIsUnsavedModalOpen(true);
    } else {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    if (isDirty) {
      setPendingPath("__logout__");
      setIsUnsavedModalOpen(true);
    } else {
      setIsLogoutModalOpen(true);
    }
  };

  const confirmUnsavedLeave = () => {
    setIsUnsavedModalOpen(false);
    if (pendingPath === "__logout__") {
      setPendingPath(null);
      setIsLogoutModalOpen(true);
    } else if (pendingPath) {
      const dest = pendingPath;
      setPendingPath(null);
      setSidebarOpen(false);
      navigate(dest);
    }
  };

  const cancelUnsavedLeave = () => {
    setIsUnsavedModalOpen(false);
    setPendingPath(null);
  };

  const confirmLogout = () => {
    api.post("/api/logout").catch(() => {});
    localStorage.removeItem("pmi_admin_logged_in");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_username");
    navigate("/admin/login");
  };

  const cancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Droplet, label: "Stok Darah", path: "/admin/stok-darah" },
    { icon: Calendar, label: "Jadwal Donor", path: "/admin/jadwal" },
    { icon: Newspaper, label: "Berita", path: "/admin/berita" },
    { icon: MessageSquare, label: "Pesan Masuk", path: "/admin/pesan" },
    { icon: PieChart, label: "Infografis", path: "/admin/infografis" },
    { icon: Wallet, label: "Donasi Masuk", path: "/admin/donasi" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src="/favicon_pmi.svg" alt="Logo PMI" className="w-6 h-6 object-contain" />
          <span className="font-semibold">Admin PMI</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-border z-50 transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/favicon_pmi.svg" alt="Logo PMI" className="w-10 h-10 object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-gray-900 truncate">Admin PMI</div>
              <div className="text-xs text-muted-foreground truncate font-mono">@{currentUsername}</div>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-215px)]">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={(e) => handleNavClick(e, item.path)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border space-y-1 bg-white">
          <button
            type="button"
            onClick={openAccountModal}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors w-full text-sm font-medium group cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
            <span>Ubah Akun</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-sm font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-8">{children}</main>

      {/* Unsaved Changes Modal */}
      {isUnsavedModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-200">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1.5">Perubahan Belum Disimpan</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Anda memiliki data yang telah diubah tetapi belum disimpan. Jika Anda meninggalkan halaman ini sekarang, semua perubahan tersebut akan hilang.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={cancelUnsavedLeave}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Tetap di Sini
              </button>
              <button
                type="button"
                onClick={confirmUnsavedLeave}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-sm"
              >
                Ya, Tinggalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 transform transition-all">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Keluar</h3>
            <p className="text-sm text-gray-500 mb-6">
              Apakah Anda yakin ingin keluar dari dashboard admin?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ubah Akun & Password Modal */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all border border-gray-100 my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#C41E3A] flex items-center justify-center border border-red-100 shadow-2xs">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Pengaturan Akun</h3>
                  <p className="text-xs text-muted-foreground">Kelola kata sandi dan username admin</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAccountModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="p-1 mx-5 mt-4 bg-gray-100 rounded-xl flex gap-1 border border-gray-200/60">
              <button
                type="button"
                onClick={() => {
                  setAccountTab("password");
                  setAccountError(null);
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  accountTab === "password"
                    ? "bg-white text-gray-900 shadow-2xs border border-gray-200/50"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-[#C41E3A]" />
                <span>Ganti Password</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAccountTab("username");
                  setAccountError(null);
                }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  accountTab === "username"
                    ? "bg-white text-gray-900 shadow-2xs border border-gray-200/50"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <User className="w-3.5 h-3.5 text-[#C41E3A]" />
                <span>Ubah Username</span>
              </button>
            </div>

            {/* TAB 1: GANTI PASSWORD */}
            {accountTab === "password" && (
              <form onSubmit={handleUpdatePassword} className="p-5 space-y-4">
                {accountError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                    <span className="leading-relaxed">{accountError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Password Saat Ini
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C41E3A]/20 focus:border-[#C41E3A] outline-none transition-all"
                      placeholder="Masukkan password saat ini"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Password Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C41E3A]/20 focus:border-[#C41E3A] outline-none transition-all"
                      placeholder="Minimal 8 karakter"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Ulangi Password Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.new_password_confirmation}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C41E3A]/20 focus:border-[#C41E3A] outline-none transition-all"
                      placeholder="Ketik ulang password baru"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAccountModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingAccount}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#C41E3A] hover:bg-[#a0182f] transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingAccount && <Loader2 className="w-4 h-4 animate-spin" />}
                    Perbarui Password
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: UBAH USERNAME */}
            {accountTab === "username" && (
              <form onSubmit={handleUpdateUsername} className="p-5 space-y-4">
                {accountError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                    <span className="leading-relaxed">{accountError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Username Baru
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={usernameForm.username}
                      onChange={(e) => setUsernameForm({ ...usernameForm, username: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C41E3A]/20 focus:border-[#C41E3A] outline-none transition-all"
                      placeholder="Masukkan username baru"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Password Saat Ini (Konfirmasi Keamanan)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={usernameForm.current_password}
                      onChange={(e) => setUsernameForm({ ...usernameForm, current_password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C41E3A]/20 focus:border-[#C41E3A] outline-none transition-all"
                      placeholder="Masukkan password saat ini"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAccountModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingAccount}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#C41E3A] hover:bg-[#a0182f] transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingAccount && <Loader2 className="w-4 h-4 animate-spin" />}
                    Simpan Username
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
