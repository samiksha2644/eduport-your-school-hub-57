import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData } from "@/contexts/DataContext";
import { Clock, AlertTriangle } from "lucide-react";

const VisitingHours: React.FC = () => {
  const { lang, t } = useLanguage();
  const { data } = useData();

  const content = lang === "en" ? data.visitingHoursEn : data.visitingHoursMr;

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-heading font-bold text-4xl text-center mb-12">{t.visiting.title}</h1>

        <div className="bg-card rounded-xl p-8 border mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h2 className="font-heading font-bold text-2xl">{t.visiting.schedule}</h2>
          </div>

          <div className="bg-primary/5 rounded-lg p-6 mb-6">
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground mb-1">{t.visiting.days}</p>
              <p className="text-3xl font-bold text-primary">{t.visiting.time}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-accent/10 rounded-lg p-4">
            <AlertTriangle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium text-foreground">{t.visiting.note}</p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-8 border">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default VisitingHours;
