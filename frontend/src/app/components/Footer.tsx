import { Instagram, MessageCircle, MapPin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo_pmi.svg";
import { SITE_CONFIG } from "@/config/site";

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

  const quickContacts = [
    {
      name: "Instagram Resmi",
      icon: Instagram,
      href: SITE_CONFIG.instagramLink,
      hoverClass: "hover:bg-[#E1306C]",
    },
    {
      name: "WhatsApp Admin",
      icon: MessageCircle,
      href: SITE_CONFIG.whatsappLink,
      hoverClass: "hover:bg-[#25D366]",
    },
    {
      name: "Lokasi Google Maps",
      icon: MapPin,
      href: SITE_CONFIG.mapsLink,
      hoverClass: "hover:bg-[#EA4335]",
    },
    {
      name: "Email PMI",
      icon: Mail,
      href: `mailto:${SITE_CONFIG.email}`,
      hoverClass: "hover:bg-[#C41E3A]",
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center h-14 bg-white rounded-xl py-2 px-3 shadow-sm">
                <img src={logo} alt="Logo PMI" className="h-full w-auto object-contain" />
              </div>
              <div className="pl-4 border-l-2 border-gray-700">
                <div className="text-sm font-black tracking-widest text-white">KAB. KULON PROGO</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Palang Merah Indonesia Cabang Kulon Progo melayani dengan sepenuh hati
              untuk kemanusiaan.
            </p>
            {/* 4 Ikon Akses Cepat Fungsional */}
            <div className="flex gap-2.5">
              {quickContacts.map((contact) => (
                <a
                  key={contact.name}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 hover:text-white ${contact.hoverClass} transition-all duration-300 transform hover:scale-110 shadow-sm cursor-pointer`}
                  title={contact.name}
                  aria-label={contact.name}
                >
                  <contact.icon className="w-4 h-4" />
                </a>
              ))}
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
              <li>
                <a
                  href={SITE_CONFIG.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors block leading-relaxed"
                  title="Lihat lokasi di Google Maps"
                >
                  Jl. Bhayangkara, Serut, Pengasih<br />
                  Kec. Pengasih, Kabupaten Kulon Progo<br />
                  Daerah Istimewa Yogyakarta 55652
                </a>
              </li>
              <li className="mt-3">
                <a
                  href={`tel:${SITE_CONFIG.phoneRaw}`}
                  className="hover:text-white transition-colors"
                >
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="hover:text-white transition-colors"
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2026 PMI Kulon Progo. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
