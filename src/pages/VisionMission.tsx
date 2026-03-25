import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData } from "@/contexts/DataContext";
import { BookOpen, Target } from "lucide-react";

const VisionMission: React.FC = () => {
  const { lang, t } = useLanguage();
  const { data } = useData();

  const vision = lang === "en" ? data.visionEn : data.visionMr;
  const mission = lang === "en" ? data.missionEn : data.missionMr;

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-heading font-bold text-4xl text-center mb-12">{t.vision.title}</h1>

        <div className="space-y-10">
          <div className="bg-card rounded-xl p-8 border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-heading font-bold text-2xl">{t.vision.visionTitle}</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">{vision}</p>
          </div>

          <div className="bg-card rounded-xl p-8 border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h2 className="font-heading font-bold text-2xl">{t.vision.missionTitle}</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">{mission}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionMission;
