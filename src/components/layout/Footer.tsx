import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData } from "@/contexts/DataContext";
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { data } = useData();

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/vision-mission", label: t.nav.vision },
    { to: "/gallery", label: t.nav.gallery },
    { to: "/announcements", label: t.nav.announcements },
    { to: "/visiting-hours", label: t.nav.visitingHours },
    { to: "/examinations", label: t.nav.examinations },
    { to: "/career-guidance", label: t.nav.careerGuidance },
    { to: "/contact", label: t.nav.contact },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-heading font-bold text-xl">EduPort</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              {t.footer.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">{t.footer.quickLinks}</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">{t.footer.contactInfo}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                {data.schoolEmail}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                {data.schoolPhone}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5" />
                {data.schoolAddress}
              </li>
            </ul>
            <div className="mt-4">
              <h5 className="font-medium text-sm mb-2">{t.footer.followUs}</h5>
              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-foreground/20 flex items-center justify-between text-sm text-primary-foreground/50">
          <span>{t.footer.rights}</span>
          <Link
            to="/admin-login"
            className="text-primary-foreground/30 hover:text-primary-foreground/50 transition-colors text-xs"
          >
            {t.nav.adminLogin}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
