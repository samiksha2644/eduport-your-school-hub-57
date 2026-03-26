import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, Upload, FileText, ExternalLink, ChevronDown, Edit2 } from "lucide-react";

const inputClass = "w-full px-4 py-2 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none";
const btnPrimary = "px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm";
const btnDanger = "p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors";

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
  sort_order: number;
}

interface ExamResource {
  id: string;
  exam_id: string;
  file_name: string;
  file_url: string;
}

const ExaminationsAdmin: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [resources, setResources] = useState<ExamResource[]>([]);
  const [editingExam, setEditingExam] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Exam>>({});
  const [newExam, setNewExam] = useState({ name_en: "", name_mr: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newLink, setNewLink] = useState({ label: "", url: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [examsRes, resRes] = await Promise.all([
      supabase.from("exams").select("*").order("sort_order"),
      supabase.from("exam_resources").select("*"),
    ]);
    if (examsRes.data) setExams(examsRes.data.map((e: any) => ({ ...e, reference_links: Array.isArray(e.reference_links) ? e.reference_links : [] })));
    if (resRes.data) setResources(resRes.data as ExamResource[]);
  };

  const handleAddExam = async () => {
    if (!newExam.name_en) return;
    const { error } = await supabase.from("exams").insert({
      name_en: newExam.name_en,
      name_mr: newExam.name_mr,
      sort_order: exams.length + 1,
    });
    if (error) {
      toast({ title: "Error adding exam", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Exam added!" });
      setNewExam({ name_en: "", name_mr: "" });
      setShowAdd(false);
      fetchAll();
    }
  };

  const handleDeleteExam = async (id: string) => {
    await supabase.from("exams").delete().eq("id", id);
    toast({ title: "Exam deleted." });
    fetchAll();
  };

  const startEditing = (exam: Exam) => {
    setEditingExam(exam.id);
    setEditForm({ ...exam });
  };

  const handleSaveEdit = async () => {
    if (!editingExam || !editForm) return;
    const { error } = await supabase.from("exams").update({
      name_en: editForm.name_en,
      name_mr: editForm.name_mr,
      overview_en: editForm.overview_en,
      overview_mr: editForm.overview_mr,
      eligibility_en: editForm.eligibility_en,
      eligibility_mr: editForm.eligibility_mr,
      exam_pattern_en: editForm.exam_pattern_en,
      exam_pattern_mr: editForm.exam_pattern_mr,
      syllabus_en: editForm.syllabus_en,
      syllabus_mr: editForm.syllabus_mr,
      reference_links: editForm.reference_links,
    }).eq("id", editingExam);
    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Exam updated!" });
      setEditingExam(null);
      fetchAll();
    }
  };

  const handleUploadPdf = async (examId: string, file: File) => {
    setUploading(true);
    try {
      const path = `pdfs/${examId}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("images").upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("images").getPublicUrl(path);
      await supabase.from("exam_resources").insert({
        exam_id: examId,
        file_name: file.name,
        file_url: urlData.publicUrl,
      });
      toast({ title: "PDF uploaded!" });
      fetchAll();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResource = async (resource: ExamResource) => {
    const match = resource.file_url.match(/images\/(.+)$/);
    if (match) {
      await supabase.storage.from("images").remove([match[1]]);
    }
    await supabase.from("exam_resources").delete().eq("id", resource.id);
    toast({ title: "Resource deleted." });
    fetchAll();
  };

  const addReferenceLink = () => {
    if (!newLink.label || !newLink.url || !editForm.reference_links) return;
    setEditForm({
      ...editForm,
      reference_links: [...editForm.reference_links, { ...newLink }],
    });
    setNewLink({ label: "", url: "" });
  };

  const removeReferenceLink = (idx: number) => {
    if (!editForm.reference_links) return;
    setEditForm({
      ...editForm,
      reference_links: editForm.reference_links.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-6">
      {/* Add new exam */}
      {!showAdd ? (
        <button onClick={() => setShowAdd(true)} className={btnPrimary}>
          <Plus className="w-4 h-4" /> Add New Exam
        </button>
      ) : (
        <div className="p-4 bg-background rounded-lg border space-y-3">
          <input className={inputClass} placeholder="Exam Name (English)" value={newExam.name_en} onChange={(e) => setNewExam({ ...newExam, name_en: e.target.value })} />
          <input className={inputClass} placeholder="परीक्षा नाव (मराठी)" value={newExam.name_mr} onChange={(e) => setNewExam({ ...newExam, name_mr: e.target.value })} />
          <div className="flex gap-2">
            <button onClick={handleAddExam} className={btnPrimary}><Plus className="w-4 h-4" /> Add</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Exam list */}
      {exams.map((exam) => {
        const isEditing = editingExam === exam.id;
        const examResources = resources.filter((r) => r.exam_id === exam.id);

        return (
          <div key={exam.id} className="bg-background rounded-lg border overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <h3 className="font-semibold">{exam.name_en} / {exam.name_mr}</h3>
              <div className="flex gap-1">
                <button onClick={() => isEditing ? setEditingExam(null) : startEditing(exam)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <Edit2 className="w-4 h-4 text-primary" />
                </button>
                <button onClick={() => handleDeleteExam(exam.id)} className={btnDanger}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isEditing && (
              <div className="border-t p-4 space-y-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Name (English)</label>
                    <input className={inputClass} value={editForm.name_en || ""} onChange={(e) => setEditForm({ ...editForm, name_en: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">नाव (मराठी)</label>
                    <input className={inputClass} value={editForm.name_mr || ""} onChange={(e) => setEditForm({ ...editForm, name_mr: e.target.value })} />
                  </div>
                </div>

                {[
                  { label: "Overview", keyEn: "overview_en" as const, keyMr: "overview_mr" as const, labelMr: "विहंगावलोकन" },
                  { label: "Eligibility", keyEn: "eligibility_en" as const, keyMr: "eligibility_mr" as const, labelMr: "पात्रता" },
                  { label: "Exam Pattern", keyEn: "exam_pattern_en" as const, keyMr: "exam_pattern_mr" as const, labelMr: "परीक्षा स्वरूप" },
                  { label: "Syllabus", keyEn: "syllabus_en" as const, keyMr: "syllabus_mr" as const, labelMr: "अभ्यासक्रम" },
                ].map(({ label, keyEn, keyMr, labelMr }) => (
                  <div key={label} className="space-y-2">
                    <h4 className="text-sm font-semibold text-primary">{label} / {labelMr}</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <textarea className={inputClass} rows={4} placeholder={`${label} (English) - use bullet points with •`} value={(editForm[keyEn] as string) || ""} onChange={(e) => setEditForm({ ...editForm, [keyEn]: e.target.value })} />
                      <textarea className={inputClass} rows={4} placeholder={`${labelMr} (मराठी)`} value={(editForm[keyMr] as string) || ""} onChange={(e) => setEditForm({ ...editForm, [keyMr]: e.target.value })} />
                    </div>
                  </div>
                ))}

                {/* Reference Links */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-primary">Reference Links</h4>
                  {editForm.reference_links?.map((link, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm flex-1">{link.label} — {link.url}</span>
                      <button onClick={() => removeReferenceLink(i)} className={btnDanger}><Trash2 className="w-3 h-3" /></button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input className={inputClass} placeholder="Link Label" value={newLink.label} onChange={(e) => setNewLink({ ...newLink, label: e.target.value })} />
                    <input className={inputClass} placeholder="URL" value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} />
                    <button onClick={addReferenceLink} className={btnPrimary}><Plus className="w-4 h-4" /></button>
                  </div>
                </div>

                <button onClick={handleSaveEdit} className={btnPrimary}>
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            )}

            {/* Resources section */}
            <div className="border-t p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">PDF Resources ({examResources.length})</h4>
                <label className={`${btnPrimary} cursor-pointer ${uploading ? "opacity-50" : ""}`}>
                  <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload PDF"}
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUploadPdf(exam.id, f);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
              {examResources.map((r) => (
                <div key={r.id} className="flex items-center gap-2 p-2 rounded border">
                  <FileText className="w-4 h-4 text-primary" />
                  <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="text-sm flex-1 text-primary hover:underline">{r.file_name}</a>
                  <button onClick={() => handleDeleteResource(r)} className={btnDanger}><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExaminationsAdmin;
