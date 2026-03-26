import React, { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, FileText, ExternalLink, BookOpen } from "lucide-react";

interface ExamResource {
  id: string;
  exam_id: string;
  file_name: string;
  file_url: string;
}

interface Exam {
  id: string;
  name_en: string;
  name_mr: string;
  overview_en: string;
  overview_mr: string;
  eligibility_en: string;
  eligibility_mr: string;
  exam_pattern_en: string;
  exam_pattern_mr: string;
  syllabus_en: string;
  syllabus_mr: string;
  reference_links: { label: string; url: string }[];
  resources?: ExamResource[];
}

const ExaminationsPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [exams, setExams] = useState<Exam[]>([]);
  const [openExam, setOpenExam] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    const { data: examsData } = await supabase
      .from("exams")
      .select("*")
      .order("sort_order");
    
    const { data: resourcesData } = await supabase
      .from("exam_resources")
      .select("*");

    if (examsData) {
      const mapped = examsData.map((e: any) => ({
        ...e,
        reference_links: Array.isArray(e.reference_links) ? e.reference_links : [],
        resources: (resourcesData || []).filter((r: any) => r.exam_id === e.id),
      }));
      setExams(mapped);
      if (mapped.length > 0) setOpenExam(mapped[0].id);
    }
  };

  const toggleExam = (id: string) => {
    setOpenExam(openExam === id ? null : id);
    setOpenSection(null);
  };

  const toggleSection = (key: string) => {
    setOpenSection(openSection === key ? null : key);
  };

  const renderBullets = (text: string) => {
    if (!text) return <p className="text-muted-foreground text-sm">—</p>;
    return (
      <ul className="space-y-1.5">
        {text.split("\n").filter(Boolean).map((line, i) => (
          <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
            {line.replace(/^[•\-]\s*/, "")}
          </li>
        ))}
      </ul>
    );
  };

  const sections = (exam: Exam) => [
    { key: "overview", label: t.examinations.overview, contentEn: exam.overview_en, contentMr: exam.overview_mr },
    { key: "eligibility", label: t.examinations.eligibility, contentEn: exam.eligibility_en, contentMr: exam.eligibility_mr },
    { key: "pattern", label: t.examinations.examPattern, contentEn: exam.exam_pattern_en, contentMr: exam.exam_pattern_mr },
    { key: "syllabus", label: t.examinations.syllabus, contentEn: exam.syllabus_en, contentMr: exam.syllabus_mr },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            {t.examinations.title}
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            {t.examinations.title}
          </h1>
        </div>

        {exams.length === 0 && (
          <p className="text-center text-muted-foreground py-16">{t.examinations.noExams}</p>
        )}

        <div className="space-y-4">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-card rounded-xl border overflow-hidden shadow-sm">
              {/* Exam header */}
              <button
                onClick={() => toggleExam(exam.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-secondary/50 transition-colors"
              >
                <h2 className="font-heading font-semibold text-lg text-foreground">
                  {lang === "en" ? exam.name_en : exam.name_mr}
                </h2>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                    openExam === exam.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Exam content */}
              {openExam === exam.id && (
                <div className="border-t px-5 pb-5 space-y-2">
                  {sections(exam).map((section) => {
                    const sectionKey = `${exam.id}-${section.key}`;
                    const isOpen = openSection === sectionKey;
                    return (
                      <div key={section.key} className="border rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleSection(sectionKey)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
                        >
                          <span className="font-medium text-sm text-foreground">{section.label}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-1">
                            {renderBullets(lang === "en" ? section.contentEn : section.contentMr)}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Resources */}
                  <div className="border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection(`${exam.id}-resources`)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
                    >
                      <span className="font-medium text-sm text-foreground">{t.examinations.resources}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                          openSection === `${exam.id}-resources` ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openSection === `${exam.id}-resources` && (
                      <div className="px-4 pb-4 pt-1">
                        {(!exam.resources || exam.resources.length === 0) ? (
                          <p className="text-sm text-muted-foreground">{t.examinations.noResources}</p>
                        ) : (
                          <div className="space-y-2">
                            {exam.resources.map((r) => (
                              <a
                                key={r.id}
                                href={r.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 rounded-lg border hover:bg-secondary/30 transition-colors"
                              >
                                <FileText className="w-4 h-4 text-primary" />
                                <span className="text-sm text-foreground flex-1">{r.file_name}</span>
                                <span className="text-xs text-primary font-medium">{t.examinations.viewPdf}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Reference Links */}
                  {exam.reference_links && exam.reference_links.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">{t.examinations.referenceLinks}</h4>
                      <div className="space-y-1">
                        {exam.reference_links.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExaminationsPage;
