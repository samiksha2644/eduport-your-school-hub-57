import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData } from "@/contexts/DataContext";
import { Megaphone, Trophy, BookOpen, Clock, Mail, Phone, ChevronRight, Star, Send } from "lucide-react";
import heroImage from "@/assets/hero-school.jpg";

const HomePage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { data, addContactMessage } = useData();

  const [formData, setFormData] = React.useState({ name: "", email: "", message: "" });
  const [formSuccess, setFormSuccess] = React.useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContactMessage({ ...formData, phone: "" });
    setFormSuccess(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setFormSuccess(false), 3000);
  };

  const spotlight = lang === "en" ? data.spotlightEn : data.spotlightMr;
  const vision = lang === "en" ? data.visionEn : data.visionMr;
  const mission = lang === "en" ? data.missionEn : data.missionMr;
  const principalMsg = lang === "en" ? data.principalMessageEn : data.principalMessageMr;

  return (
    <div className="min-h-screen">
      {/* Spotlight Bar */}
      <div className="bg-accent text-accent-foreground py-2 overflow-hidden">
        <div className="flex items-center gap-3">
          <span className="bg-primary text-primary-foreground px-3 py-0.5 text-xs font-bold rounded-sm whitespace-nowrap ml-4 flex items-center gap-1">
            <Star className="w-3 h-3" />
            {t.spotlight.title}
          </span>
          <div className="overflow-hidden flex-1">
            <p className="animate-ticker whitespace-nowrap text-sm font-medium">
              {spotlight || t.spotlight.default}
            </p>
          </div>
        </div>
      </div>

      {/* Notice Ticker */}
      {data.announcements.length > 0 && (
        <div className="bg-primary/5 border-b py-2 overflow-hidden">
          <div className="flex items-center gap-3">
            <span className="bg-primary text-primary-foreground px-3 py-0.5 text-xs font-bold rounded-sm whitespace-nowrap ml-4 flex items-center gap-1">
              <Megaphone className="w-3 h-3" />
              {t.announcements.title}
            </span>
            <div className="overflow-hidden flex-1">
              <p className="animate-ticker whitespace-nowrap text-sm" style={{ animationDuration: "25s" }}>
                {data.announcements.slice(0, 5).map((a) => (
                  <span key={a.id} className="mr-12">
                    📌 {lang === "en" ? a.titleEn : a.titleMr} ({a.date})
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[400px] overflow-hidden">
        <img
          src={data.bannerImage || heroImage}
          alt="EduPort School"
          className="w-full h-full object-cover"
          width={1920}
          height={1024}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="font-heading font-extrabold text-4xl md:text-6xl text-primary-foreground mb-4 leading-tight">
                {t.hero.welcome}
              </h1>
              <p className="text-xl md:text-2xl text-primary-foreground/80 font-medium">
                {t.hero.subtitle}
              </p>
              <div className="mt-8 flex gap-4">
                <Link
                  to="/announcements"
                  className="px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  {t.announcements.viewMore}
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3 bg-primary-foreground/20 text-primary-foreground font-semibold rounded-lg backdrop-blur-sm hover:bg-primary-foreground/30 transition-colors border border-primary-foreground/30"
                >
                  {t.contact.title}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Preview */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl text-center mb-10">{t.vision.title}</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-background rounded-xl p-8 border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">{t.vision.visionTitle}</h3>
              <p className="text-muted-foreground leading-relaxed line-clamp-3">{vision}</p>
            </div>
            <div className="bg-background rounded-xl p-8 border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">{t.vision.missionTitle}</h3>
              <p className="text-muted-foreground leading-relaxed line-clamp-3">{mission}</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              to="/vision-mission"
              className="inline-flex items-center gap-1 text-primary font-semibold hover:gap-2 transition-all"
            >
              {t.vision.readMore} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Announcements Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl text-center mb-10">{t.announcements.title}</h2>
          {data.announcements.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {data.announcements.slice(0, 3).map((a) => (
                <div key={a.id} className="bg-card rounded-xl p-6 border hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
                      {t.announcements.categories[a.category] || a.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{a.date}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    {lang === "en" ? a.titleEn : a.titleMr}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {lang === "en" ? a.descEn : a.descMr}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">{t.announcements.noAnnouncements}</p>
          )}
          <div className="text-center mt-8">
            <Link
              to="/announcements"
              className="inline-flex items-center gap-1 text-primary font-semibold hover:gap-2 transition-all"
            >
              {t.announcements.viewMore} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl text-center text-primary-foreground mb-10">
            {t.achievements.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {data.achievements.map((a) => (
              <div key={a.id} className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-colors">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mb-4">
                  <Trophy className="w-5 h-5 text-accent-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-primary-foreground mb-2">
                  {lang === "en" ? a.titleEn : a.titleMr}
                </h3>
                <p className="text-primary-foreground/70 text-sm">
                  {lang === "en" ? a.descEn : a.descMr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      {data.gallery.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-heading font-bold text-3xl text-center mb-10">{t.gallery.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {data.gallery.slice(0, 4).map((g) => (
                <div key={g.id} className="aspect-square rounded-xl overflow-hidden group cursor-pointer">
                  <img
                    src={g.url}
                    alt={lang === "en" ? g.captionEn : g.captionMr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/gallery"
                className="inline-flex items-center gap-1 text-primary font-semibold hover:gap-2 transition-all"
              >
                {t.gallery.viewMore} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Principal's Desk */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <h2 className="font-heading font-bold text-3xl mb-6">{t.principal.title}</h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line text-left bg-background rounded-xl p-8 border">
              {principalMsg}
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4 text-primary" /> {data.schoolEmail}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4 text-primary" /> {data.schoolPhone}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-3xl text-center mb-10">{t.contact.formTitle}</h2>
          <div className="max-w-lg mx-auto">
            <form onSubmit={handleContactSubmit} className="bg-card rounded-xl p-8 border space-y-4">
              <input
                type="text"
                placeholder={t.contact.name}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <input
                type="email"
                placeholder={t.contact.email}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <textarea
                placeholder={t.contact.message}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              />
              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> {t.contact.submit}
              </button>
              {formSuccess && (
                <p className="text-center text-sm font-medium text-green-600">{t.contact.success}</p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
