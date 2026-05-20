import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo_pmi.png";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Beranda", href: "/" },
    { name: "Stok Darah", href: "/stok-darah" },
    { name: "Info Donor", href: "/info-donor" },
    { name: "Jadwal Donor", href: "/jadwal" },
    { name: "Berita", href: "/berita" },
    { name: "Donasi", href: "/donasi" },
    { name: "Kontak", href: "/kontak" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-12 h-12 transition-transform group-hover:scale-110">
              <img src={logo} alt="Logo PMI" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-black text-xl text-primary tracking-tight leading-none">PMI</div>
              <div className="text-[10px] uppercase font-black text-gray-400 tracking-widest mt-0.5">Kab. Kulon Progo</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-all px-4 py-2 rounded-full ${
                  location.pathname === item.href
                    ? "bg-primary text-white shadow-md hover:bg-[#C21219] hover:shadow-primary/20"
                    : "text-foreground hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block py-3 px-4 rounded-xl transition-all ${
                  location.pathname === item.href
                    ? "bg-primary text-white font-bold shadow-md"
                    : "text-foreground hover:bg-gray-50 hover:text-primary font-medium"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
