import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, Compass, GraduationCap, BookOpen, Play } from "lucide-react";
import YouTubeEmbed from "@/components/YouTubeEmbed";

interface CareerStream {
  id: string;
  category: string;
  name_en: string;
  name_mr: string;
  subjects_en: string;
  subjects_mr: string;
  career_options_en: string;
  career_options_mr: string;
  skills_en: string;
  skills_mr: string;
  future_scope_en: string;
  future_scope_mr: string;
  video_url: string;
}

interface EntranceExam {
  id: string;
  name_en: string;
  name_mr: string;
  description_en: string;
  description_mr: string;
  video_url: string;
}

const CareerGuidancePage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [streams, setStreams] = useState<CareerStream[]>([]);
  const [entranceExams, setEntranceExams] = useState<EntranceExam[]>([]);
  const [openCategory, setOpenCategory] = useState<string | null>("after_10th");
  const [openStream, setOpenStream] = useState<string | null>(null);
  const [openEntranceSection, setOpenEntranceSection] = useState(false);
  const [openExam, setOpenExam] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [streamsRes, examsRes] = await Promise.all([
      supabase.from("career_streams").select("*").order("sort_order"),
      supabase.from("entrance_exams").select("*").order("sort_order"),
    ]);
    if (streamsRes.data) setStreams(streamsRes.data as CareerStream[]);
    if (examsRes.data) setEntranceExams(examsRes.data as EntranceExam[]);
  };

  const renderBullets = (text: string) => {
    if (!text) return <p className="text-muted-foreground text-sm">—</p>;
    return (
      <ul className="space-y-1">
        {text.split("\n").filter(Boolean).map((line, i) => (
          <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
            {line.replace(/^[•\-]\s*/, "")}
          </li>
        ))}
      </ul>
    );
  };

  const after10th = streams.filter((s) => s.category === "after_10th");
  const after12th = streams.filter((s) => s.category === "after_12th");

  const renderStreamCard = (stream: CareerStream) => {
    const isOpen = openStream === stream.id;
    const fields = [
      { label: t.career.subjects, en: stream.subjects_en, mr: stream.subjects_mr },
      { label: t.career.careerOptions, en: stream.career_options_en, mr: stream.career_options_mr },
      { label: t.career.skills, en: stream.skills_en, mr: stream.skills_mr },
      { label: t.career.futureScope, en: stream.future_scope_en, mr: stream.future_scope_mr },
    ];

    return (
      <div key={stream.id} className="border rounded-lg overflow-hidden">
        <button
          onClick={() => setOpenStream(isOpen ? null : stream.id)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
        >
          <span className="font-medium text-sm text-foreground">
            {lang === "en" ? stream.name_en : stream.name_mr}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen && (
          <div className="px-4 pb-4 space-y-4">
            {fields.map((field) => (
              <div key={field.label}>
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wide mb-1.5">{field.label}</h4>
                {renderBullets(lang === "en" ? field.en : field.mr)}
              </div>
            ))}
            {stream.video_url && <YouTubeEmbed url={stream.video_url} title={t.career.recommendedVideo} />}
          </div>
        )}
      </div>
    );
  };

  const renderCategory = (key: string, label: string, items: CareerStream[], icon: React.ReactNode) => {
    const isOpen = openCategory === key;
    return (
      <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
        <button
          onClick={() => setOpenCategory(isOpen ? null : key)}
          className="w-full flex items-center justify-between p-5 hover:bg-secondary/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {icon}
            <h2 className="font-heading font-semibold text-lg text-foreground">{label}</h2>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen && (
          <div className="border-t px-5 pb-5 space-y-2 pt-3">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">{t.career.noStreams}</p>
            ) : (
              items.map(renderStreamCard)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Compass className="w-4 h-4" />
            {t.career.title}
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            {t.career.title}
          </h1>
        </div>

        <div className="space-y-4">
          {renderCategory("after_10th", t.career.after10th, after10th, <GraduationCap className="w-5 h-5 text-primary" />)}
          {renderCategory("after_12th", t.career.after12th, after12th, <BookOpen className="w-5 h-5 text-primary" />)}

          {/* Entrance Exams */}
          <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
            <button
              onClick={() => setOpenEntranceSection(!openEntranceSection)}
              className="w-full flex items-center justify-between p-5 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-accent" />
                <h2 className="font-heading font-semibold text-lg text-foreground">{t.career.entranceExams}</h2>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openEntranceSection ? "rotate-180" : ""}`}
              />
            </button>
            {openEntranceSection && (
              <div className="border-t px-5 pb-5 space-y-2 pt-3">
                {entranceExams.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">{t.career.noEntranceExams}</p>
                ) : (
                  entranceExams.map((exam) => {
                    const isOpen = openExam === exam.id;
                    return (
                      <div key={exam.id} className="border rounded-lg overflow-hidden">
                        <button
                          onClick={() => setOpenExam(isOpen ? null : exam.id)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
                        >
                          <span className="font-medium text-sm text-foreground">
                            {lang === "en" ? exam.name_en : exam.name_mr}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 space-y-4">
                            <p className="text-sm text-foreground/80 leading-relaxed">
                              {lang === "en" ? exam.description_en : exam.description_mr}
                            </p>
                            {exam.video_url && <YouTubeEmbed url={exam.video_url} title={t.career.recommendedVideo} />}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGuidancePage;
