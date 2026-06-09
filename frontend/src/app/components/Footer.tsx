import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo_pmi.svg";

export function Footer() {
  const quickLinks = [
    { name: "Beranda", href: "/" },
    { name: "Stok Darah", href: "/stok-darah" },
    { name: "Jadwal Donor", href: "/jadwal" },
    { name: "Berita", href: "/berita" },
    { name: "Donasi", href: "/donasi" },
  ];

  const services = [
    { name: "Donor Darah", href: "/stok-darah" },
    { name: "Pertolongan Pertama", href: "/berita" },
    { name: "Tanggap Bencana", href: "/berita" },
    { name: "Pelatihan Relawan", href: "/kontak" },
  ];

  const socialMedia = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Email", icon: Mail, href: "/kontak" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center h-14 bg-white rounded-xl py-2 px-3">
                <img src={logo} alt="Logo PMI" className="h-full w-auto object-contain" />
              </div>
              <div className="pl-4 border-l-2 border-gray-700">
                <div className="text-sm font-black tracking-widest text-white">KAB. KULON PROGO</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Palang Merah Indonesia Cabang Kulon Progo melayani dengan sepenuh hati
              untuk kemanusiaan.
            </p>
            <div className="flex gap-3">
              {socialMedia.map((social) => {
                const isExternal = social.href.startsWith("http") || social.href === "#";
                return isExternal ? (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ) : (
                  <Link
                    key={social.name}
                    to={social.href}
                    className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Menu Cepat</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Layanan</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Kontak</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Jl. KH. Ahmad Dahlan No. 12</li>
              <li>Wates, Kulon Progo</li>
              <li>DIY 55611</li>
              <li className="mt-3">
                <a
                  href="tel:0274773456"
                  className="hover:text-white transition-colors"
                >
                  (0274) 773456
                </a>
              </li>
              <li>
                <Link
                  to="/kontak"
                  className="hover:text-white transition-colors"
                >
                  pmi.kulonprogo@gmail.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2026 PMI Kulon Progo. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Kebijakan Privasi
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Syarat & Ketentuan
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
