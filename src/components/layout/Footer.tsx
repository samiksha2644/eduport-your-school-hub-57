import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData } from "@/contexts/DataContext";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import schoolLogo from "@/assets/school-logo.jpeg";

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

  const mapUrl = data.settings.map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3820.0!2d73.89!3d17.38!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDIyJzQ4LjAiTiA3M8KwNTMnMjQuMCJF!5e0!3m2!1sen!2sin!4v1700000000000";

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={schoolLogo} alt="School Logo" className="w-10 h-10 rounded-lg object-contain bg-white p-0.5" />
              <span className="font-heading font-bold text-lg">कोयना एज्युकेशन सोसायटी</span>
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
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                {data.settings.school_email}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                {data.settings.school_phone}
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                {data.settings.school_address}
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

          {/* Google Map */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Find Us</h4>
            <div className="rounded-lg overflow-hidden border border-primary-foreground/20">
              <iframe
                src={mapUrl}
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="School Location"
              />
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
