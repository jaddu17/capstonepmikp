import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo_pmi.svg";

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
          <Link to="/" className="flex items-center gap-4 group">
            <div className="flex items-center justify-center h-12 transition-transform group-hover:scale-105">
              <img src={logo} alt="Logo PMI" className="h-full w-auto object-contain" />
            </div>
            <div className="hidden sm:block pl-4 border-l-2 border-gray-200">
              <div className="text-sm font-black text-primary tracking-widest">KAB. KULON PROGO</div>
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
