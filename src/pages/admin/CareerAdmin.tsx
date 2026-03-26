import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, Edit2, ChevronDown } from "lucide-react";

const inputClass = "w-full px-4 py-2 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none";
const btnPrimary = "px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm";
const btnDanger = "p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors";

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
  sort_order: number;
}

interface EntranceExam {
  id: string;
  name_en: string;
  name_mr: string;
  description_en: string;
  description_mr: string;
  sort_order: number;
}

const CareerAdmin: React.FC = () => {
  const [streams, setStreams] = useState<CareerStream[]>([]);
  const [entranceExams, setEntranceExams] = useState<EntranceExam[]>([]);
  const [editingStream, setEditingStream] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<CareerStream>>({});
  const [editingExam, setEditingExam] = useState<string | null>(null);
  const [examForm, setExamForm] = useState<Partial<EntranceExam>>({});
  const [showAddStream, setShowAddStream] = useState(false);
  const [showAddExam, setShowAddExam] = useState(false);
  const [newStream, setNewStream] = useState({ name_en: "", name_mr: "", category: "after_10th" });
  const [newExam, setNewExam] = useState({ name_en: "", name_mr: "" });
  const [openSection, setOpenSection] = useState<string>("streams");

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const [s, e] = await Promise.all([
      supabase.from("career_streams").select("*").order("sort_order"),
      supabase.from("entrance_exams").select("*").order("sort_order"),
    ]);
    if (s.data) setStreams(s.data as CareerStream[]);
    if (e.data) setEntranceExams(e.data as EntranceExam[]);
  };

  const handleAddStream = async () => {
    if (!newStream.name_en) return;
    const { error } = await supabase.from("career_streams").insert({
      ...newStream,
      sort_order: streams.length + 1,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Stream added!" }); setNewStream({ name_en: "", name_mr: "", category: "after_10th" }); setShowAddStream(false); fetchAll(); }
  };

  const handleDeleteStream = async (id: string) => {
    await supabase.from("career_streams").delete().eq("id", id);
    toast({ title: "Stream deleted." }); fetchAll();
  };

  const startEditStream = (s: CareerStream) => { setEditingStream(s.id); setEditForm({ ...s }); };

  const handleSaveStream = async () => {
    if (!editingStream) return;
    const { id, created_at, ...rest } = editForm as any;
    const { error } = await supabase.from("career_streams").update(rest).eq("id", editingStream);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Stream updated!" }); setEditingStream(null); fetchAll(); }
  };

  const handleAddExam = async () => {
    if (!newExam.name_en) return;
    const { error } = await supabase.from("entrance_exams").insert({
      ...newExam,
      sort_order: entranceExams.length + 1,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Exam added!" }); setNewExam({ name_en: "", name_mr: "" }); setShowAddExam(false); fetchAll(); }
  };

  const handleDeleteExam = async (id: string) => {
    await supabase.from("entrance_exams").delete().eq("id", id);
    toast({ title: "Exam deleted." }); fetchAll();
  };

  const startEditExam = (e: EntranceExam) => { setEditingExam(e.id); setExamForm({ ...e }); };

  const handleSaveExam = async () => {
    if (!editingExam) return;
    const { error } = await supabase.from("entrance_exams").update({
      name_en: examForm.name_en,
      name_mr: examForm.name_mr,
      description_en: examForm.description_en,
      description_mr: examForm.description_mr,
    }).eq("id", editingExam);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Exam updated!" }); setEditingExam(null); fetchAll(); }
  };

  const after10th = streams.filter((s) => s.category === "after_10th");
  const after12th = streams.filter((s) => s.category === "after_12th");

  const renderStreamList = (label: string, items: CareerStream[]) => (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-primary">{label}</h4>
      {items.map((s) => {
        const isEditing = editingStream === s.id;
        return (
          <div key={s.id} className="bg-card rounded-lg border overflow-hidden">
            <div className="flex items-center justify-between p-3">
              <span className="text-sm font-medium">{s.name_en} / {s.name_mr}</span>
              <div className="flex gap-1">
                <button onClick={() => isEditing ? setEditingStream(null) : startEditStream(s)} className="p-1.5 rounded hover:bg-secondary"><Edit2 className="w-3.5 h-3.5 text-primary" /></button>
                <button onClick={() => handleDeleteStream(s.id)} className="p-1.5 rounded hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
              </div>
            </div>
            {isEditing && (
              <div className="border-t p-3 space-y-3">
                <div className="grid md:grid-cols-2 gap-2">
                  <input className={inputClass} placeholder="Name (EN)" value={editForm.name_en || ""} onChange={(e) => setEditForm({ ...editForm, name_en: e.target.value })} />
                  <input className={inputClass} placeholder="नाव (MR)" value={editForm.name_mr || ""} onChange={(e) => setEditForm({ ...editForm, name_mr: e.target.value })} />
                </div>
                {[
                  { label: "Subjects", keyEn: "subjects_en" as const, keyMr: "subjects_mr" as const },
                  { label: "Career Options", keyEn: "career_options_en" as const, keyMr: "career_options_mr" as const },
                  { label: "Skills Required", keyEn: "skills_en" as const, keyMr: "skills_mr" as const },
                  { label: "Future Scope", keyEn: "future_scope_en" as const, keyMr: "future_scope_mr" as const },
                ].map(({ label, keyEn, keyMr }) => (
                  <div key={label}>
                    <label className="text-xs font-medium text-muted-foreground">{label}</label>
                    <div className="grid md:grid-cols-2 gap-2">
                      <textarea className={inputClass} rows={3} placeholder={`${label} (EN)`} value={(editForm[keyEn] as string) || ""} onChange={(e) => setEditForm({ ...editForm, [keyEn]: e.target.value })} />
                      <textarea className={inputClass} rows={3} placeholder={`${label} (MR)`} value={(editForm[keyMr] as string) || ""} onChange={(e) => setEditForm({ ...editForm, [keyMr]: e.target.value })} />
                    </div>
                  </div>
                ))}
                <button onClick={handleSaveStream} className={btnPrimary}><Save className="w-4 h-4" /> Save</button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Section Toggles */}
      <div className="flex gap-2">
        <button onClick={() => setOpenSection("streams")} className={`px-4 py-2 rounded-lg text-sm font-medium ${openSection === "streams" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
          Career Streams
        </button>
        <button onClick={() => setOpenSection("entrance")} className={`px-4 py-2 rounded-lg text-sm font-medium ${openSection === "entrance" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
          Entrance Exams
        </button>
      </div>

      {openSection === "streams" && (
        <div className="space-y-6">
          {!showAddStream ? (
            <button onClick={() => setShowAddStream(true)} className={btnPrimary}><Plus className="w-4 h-4" /> Add Stream</button>
          ) : (
            <div className="p-4 bg-background rounded-lg border space-y-3">
              <input className={inputClass} placeholder="Stream Name (English)" value={newStream.name_en} onChange={(e) => setNewStream({ ...newStream, name_en: e.target.value })} />
              <input className={inputClass} placeholder="विषय नाव (मराठी)" value={newStream.name_mr} onChange={(e) => setNewStream({ ...newStream, name_mr: e.target.value })} />
              <select className={inputClass} value={newStream.category} onChange={(e) => setNewStream({ ...newStream, category: e.target.value })}>
                <option value="after_10th">After 10th</option>
                <option value="after_12th">After 12th</option>
              </select>
              <div className="flex gap-2">
                <button onClick={handleAddStream} className={btnPrimary}><Plus className="w-4 h-4" /> Add</button>
                <button onClick={() => setShowAddStream(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary">Cancel</button>
              </div>
            </div>
          )}
          {renderStreamList("After 10th / १०वी नंतर", after10th)}
          {renderStreamList("After 12th / १२वी नंतर", after12th)}
        </div>
      )}

      {openSection === "entrance" && (
        <div className="space-y-4">
          {!showAddExam ? (
            <button onClick={() => setShowAddExam(true)} className={btnPrimary}><Plus className="w-4 h-4" /> Add Entrance Exam</button>
          ) : (
            <div className="p-4 bg-background rounded-lg border space-y-3">
              <input className={inputClass} placeholder="Exam Name (English)" value={newExam.name_en} onChange={(e) => setNewExam({ ...newExam, name_en: e.target.value })} />
              <input className={inputClass} placeholder="परीक्षा नाव (मराठी)" value={newExam.name_mr} onChange={(e) => setNewExam({ ...newExam, name_mr: e.target.value })} />
              <div className="flex gap-2">
                <button onClick={handleAddExam} className={btnPrimary}><Plus className="w-4 h-4" /> Add</button>
                <button onClick={() => setShowAddExam(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary">Cancel</button>
              </div>
            </div>
          )}
          {entranceExams.map((exam) => {
            const isEditing = editingExam === exam.id;
            return (
              <div key={exam.id} className="bg-card rounded-lg border overflow-hidden">
                <div className="flex items-center justify-between p-3">
                  <span className="text-sm font-medium">{exam.name_en} / {exam.name_mr}</span>
                  <div className="flex gap-1">
                    <button onClick={() => isEditing ? setEditingExam(null) : startEditExam(exam)} className="p-1.5 rounded hover:bg-secondary"><Edit2 className="w-3.5 h-3.5 text-primary" /></button>
                    <button onClick={() => handleDeleteExam(exam.id)} className="p-1.5 rounded hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                  </div>
                </div>
                {isEditing && (
                  <div className="border-t p-3 space-y-3">
                    <div className="grid md:grid-cols-2 gap-2">
                      <input className={inputClass} placeholder="Name (EN)" value={examForm.name_en || ""} onChange={(e) => setExamForm({ ...examForm, name_en: e.target.value })} />
                      <input className={inputClass} placeholder="नाव (MR)" value={examForm.name_mr || ""} onChange={(e) => setExamForm({ ...examForm, name_mr: e.target.value })} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-2">
                      <textarea className={inputClass} rows={4} placeholder="Description (EN)" value={examForm.description_en || ""} onChange={(e) => setExamForm({ ...examForm, description_en: e.target.value })} />
                      <textarea className={inputClass} rows={4} placeholder="वर्णन (MR)" value={examForm.description_mr || ""} onChange={(e) => setExamForm({ ...examForm, description_mr: e.target.value })} />
                    </div>
                    <button onClick={handleSaveExam} className={btnPrimary}><Save className="w-4 h-4" /> Save</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CareerAdmin;
