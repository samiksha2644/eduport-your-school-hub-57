import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData } from "@/contexts/DataContext";
import { Menu, X, Globe, GraduationCap } from "lucide-react";

const Navbar: React.FC = () => {
  const { lang, t, toggleLanguage } = useLanguage();
  const { isAdmin, adminLogout } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/vision-mission", label: t.nav.vision },
    { to: "/gallery", label: t.nav.gallery },
    { to: "/announcements", label: t.nav.announcements },
    { to: "/visiting-hours", label: t.nav.visitingHours },
    { to: "/contact", label: t.nav.contact },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-xl text-foreground">
            EduPort
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-secondary hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Globe className="w-4 h-4" />
            {lang === "en" ? "मराठी" : "English"}
          </button>

          {isAdmin && (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/admin"
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                {t.nav.dashboard}
              </Link>
              <button
                onClick={adminLogout}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t.nav.logout}
              </button>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-secondary transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-card border-t px-4 py-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <div className="pt-2 border-t">
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground"
              >
                {t.nav.dashboard}
              </Link>
              <button
                onClick={() => { adminLogout(); setMobileOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-sm text-muted-foreground"
              >
                {t.nav.logout}
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
