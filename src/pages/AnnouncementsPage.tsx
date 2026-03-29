import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData } from "@/contexts/DataContext";
import { Calendar } from "lucide-react";

const AnnouncementsPage = () => {
  const { lang, t } = useLanguage();
  const { data } = useData();
  const [filter, setFilter] = useState("all");

  const categoryKeys = ["all", "5-8", "9-10", "11-12"];
  const filtered = filter === "all"
    ? data.announcements
    : data.announcements.filter((a) => a.category === filter || a.category === "all");

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-heading font-bold text-4xl text-center mb-8">{t.announcements.title}</h1>
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categoryKeys.map((key) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/10"}`}>
              {t.announcements.categories[key]}
            </button>
          ))}
        </div>
        {filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((a) => (
              <div key={a.id} className="bg-card rounded-xl p-6 border hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">{t.announcements.categories[a.category] || a.category}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="w-3 h-3" /> {a.date}</span>
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2">{lang === "en" ? a.title_en : a.title_mr}</h3>
                <p className="text-muted-foreground leading-relaxed">{lang === "en" ? a.desc_en : a.desc_mr}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-20">{t.announcements.noAnnouncements}</p>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
