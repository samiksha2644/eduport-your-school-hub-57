import React, { useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData, Announcement, GalleryItem, Achievement } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, Save, Megaphone, Image, Trophy, BookOpen, Clock, MessageSquare, Star, ImageIcon, Upload, CheckCircle, AlertCircle, GraduationCap, Compass } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ExaminationsAdmin from "./admin/ExaminationsAdmin";
import CareerAdmin from "./admin/CareerAdmin";

const AdminDashboard: React.FC = () => {
  const { lang, t } = useLanguage();
  const { data, updateData, addAnnouncement, deleteAnnouncement, addGalleryItem, deleteGalleryItem, addAchievement, deleteAchievement, deleteContactMessage } = useData();
  const { isAdmin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("announcements");

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (!isAdmin) return <Navigate to="/admin-login" />;

  const tabs = [
    { key: "announcements", icon: Megaphone },
    { key: "gallery", icon: Image },
    { key: "achievements", icon: Trophy },
    { key: "vision", icon: BookOpen },
    { key: "principal", icon: BookOpen },
    { key: "visiting", icon: Clock },
    { key: "banner", icon: ImageIcon },
    { key: "spotlight", icon: Star },
    { key: "messages", icon: MessageSquare },
    { key: "examinations", icon: GraduationCap },
    { key: "career", icon: Compass },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="font-heading font-bold text-3xl mb-8">{t.admin.title}</h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.admin.tabs[key]}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-xl p-6 border">
          {activeTab === "announcements" && <AnnouncementsTab />}
          {activeTab === "gallery" && <GalleryTab />}
          {activeTab === "achievements" && <AchievementsTab />}
          {activeTab === "vision" && <VisionTab />}
          {activeTab === "principal" && <PrincipalTab />}
          {activeTab === "visiting" && <VisitingTab />}
          {activeTab === "banner" && <BannerTab />}
          {activeTab === "spotlight" && <SpotlightTab />}
          {activeTab === "messages" && <MessagesTab />}
          {activeTab === "examinations" && <ExaminationsAdmin />}
          {activeTab === "career" && <CareerAdmin />}
        </div>
      </div>
    </div>
  );
};

const inputClass = "w-full px-4 py-2 rounded-lg border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none";
const btnPrimary = "px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm";
const btnDanger = "p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors";

function AnnouncementsTab() {
  const { data, addAnnouncement, deleteAnnouncement } = useData();
  const { t } = useLanguage();
  const [form, setForm] = useState({ titleEn: "", titleMr: "", descEn: "", descMr: "", date: "", category: "all" as Announcement["category"] });

  const handleAdd = () => {
    if (!form.titleEn || !form.date) return;
    addAnnouncement(form);
    setForm({ titleEn: "", titleMr: "", descEn: "", descMr: "", date: "", category: "all" });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4 p-4 bg-background rounded-lg border">
        <input className={inputClass} placeholder="Title (English)" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
        <input className={inputClass} placeholder="शीर्षक (मराठी)" value={form.titleMr} onChange={(e) => setForm({ ...form, titleMr: e.target.value })} />
        <textarea className={inputClass} placeholder="Description (English)" value={form.descEn} onChange={(e) => setForm({ ...form, descEn: e.target.value })} rows={2} />
        <textarea className={inputClass} placeholder="वर्णन (मराठी)" value={form.descMr} onChange={(e) => setForm({ ...form, descMr: e.target.value })} rows={2} />
        <input className={inputClass} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Announcement["category"] })}>
          <option value="all">All</option>
          <option value="5-8">5th–8th</option>
          <option value="9-10">9th–10th</option>
          <option value="11-12">11th–12th</option>
        </select>
        <button onClick={handleAdd} className={btnPrimary}><Plus className="w-4 h-4" /> {t.admin.add}</button>
      </div>

      <div className="space-y-3">
        {data.announcements.map((a) => (
          <div key={a.id} className="flex items-start justify-between p-4 bg-background rounded-lg border">
            <div>
              <p className="font-semibold">{a.titleEn}</p>
              <p className="text-sm text-muted-foreground">{a.titleMr} • {a.date} • {a.category}</p>
            </div>
            <button onClick={() => deleteAnnouncement(a.id)} className={btnDanger}><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryTab() {
  const { data, addGalleryItem, deleteGalleryItem } = useData();
  const { t } = useLanguage();
  const [form, setForm] = useState({ captionEn: "", captionMr: "", category: "events" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleAdd = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `gallery/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("images").upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("images").getPublicUrl(path);
      addGalleryItem({ url: urlData.publicUrl, ...form });
      setForm({ captionEn: "", captionMr: "", category: "events" });
      setFile(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      toast({ title: "Image uploaded successfully!" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    try {
      // Try to extract storage path from URL
      const url = item.url;
      const match = url.match(/images\/(.+)$/);
      if (match) {
        await supabase.storage.from("images").remove([match[1]]);
      }
      deleteGalleryItem(item.id);
      toast({ title: "Image deleted." });
    } catch {
      deleteGalleryItem(item.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4 p-4 bg-background rounded-lg border">
        <div className="md:col-span-2">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">{file ? file.name : "Click to choose image"}</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
        {preview && (
          <div className="md:col-span-2">
            <img src={preview} alt="Preview" className="max-h-40 rounded-lg object-cover" />
          </div>
        )}
        <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="events">Events</option>
          <option value="sports">Sports</option>
          <option value="annualDay">Annual Day</option>
          <option value="academic">Academic</option>
        </select>
        <input className={inputClass} placeholder="Caption (English)" value={form.captionEn} onChange={(e) => setForm({ ...form, captionEn: e.target.value })} />
        <input className={inputClass} placeholder="शीर्षक (मराठी)" value={form.captionMr} onChange={(e) => setForm({ ...form, captionMr: e.target.value })} />
        <button onClick={handleAdd} disabled={uploading || !file} className={`${btnPrimary} ${uploading ? "opacity-50" : ""}`}>
          {uploading ? "Uploading..." : <><Plus className="w-4 h-4" /> {t.admin.add}</>}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.gallery.map((g) => (
          <div key={g.id} className="relative group">
            <img src={g.url} alt={g.captionEn} className="w-full aspect-square object-cover rounded-lg" loading="lazy" />
            <button
              onClick={() => handleDelete(g)}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementsTab() {
  const { data, addAchievement, deleteAchievement } = useData();
  const { t } = useLanguage();
  const [form, setForm] = useState({ titleEn: "", titleMr: "", descEn: "", descMr: "" });

  const handleAdd = () => {
    if (!form.titleEn) return;
    addAchievement(form);
    setForm({ titleEn: "", titleMr: "", descEn: "", descMr: "" });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4 p-4 bg-background rounded-lg border">
        <input className={inputClass} placeholder="Title (English)" value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} />
        <input className={inputClass} placeholder="शीर्षक (मराठी)" value={form.titleMr} onChange={(e) => setForm({ ...form, titleMr: e.target.value })} />
        <textarea className={inputClass} placeholder="Description (English)" value={form.descEn} onChange={(e) => setForm({ ...form, descEn: e.target.value })} rows={2} />
        <textarea className={inputClass} placeholder="वर्णन (मराठी)" value={form.descMr} onChange={(e) => setForm({ ...form, descMr: e.target.value })} rows={2} />
        <button onClick={handleAdd} className={btnPrimary}><Plus className="w-4 h-4" /> {t.admin.add}</button>
      </div>

      <div className="space-y-3">
        {data.achievements.map((a) => (
          <div key={a.id} className="flex items-start justify-between p-4 bg-background rounded-lg border">
            <div>
              <p className="font-semibold">{a.titleEn}</p>
              <p className="text-sm text-muted-foreground">{a.titleMr}</p>
            </div>
            <button onClick={() => deleteAchievement(a.id)} className={btnDanger}><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisionTab() {
  const { data, updateData } = useData();
  const { t } = useLanguage();
  const [visionEn, setVisionEn] = useState(data.visionEn);
  const [visionMr, setVisionMr] = useState(data.visionMr);
  const [missionEn, setMissionEn] = useState(data.missionEn);
  const [missionMr, setMissionMr] = useState(data.missionMr);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Vision (English)</h3>
        <textarea className={inputClass} value={visionEn} onChange={(e) => setVisionEn(e.target.value)} rows={4} />
        <h3 className="font-semibold">दृष्टी (मराठी)</h3>
        <textarea className={inputClass} value={visionMr} onChange={(e) => setVisionMr(e.target.value)} rows={4} />
        <h3 className="font-semibold">Mission (English)</h3>
        <textarea className={inputClass} value={missionEn} onChange={(e) => setMissionEn(e.target.value)} rows={4} />
        <h3 className="font-semibold">ध्येय (मराठी)</h3>
        <textarea className={inputClass} value={missionMr} onChange={(e) => setMissionMr(e.target.value)} rows={4} />
        <button onClick={() => updateData({ visionEn, visionMr, missionEn, missionMr })} className={btnPrimary}>
          <Save className="w-4 h-4" /> {t.admin.save}
        </button>
      </div>
    </div>
  );
}

function PrincipalTab() {
  const { data, updateData } = useData();
  const { t } = useLanguage();
  const [en, setEn] = useState(data.principalMessageEn);
  const [mr, setMr] = useState(data.principalMessageMr);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Message (English)</h3>
      <textarea className={inputClass} value={en} onChange={(e) => setEn(e.target.value)} rows={6} />
      <h3 className="font-semibold">संदेश (मराठी)</h3>
      <textarea className={inputClass} value={mr} onChange={(e) => setMr(e.target.value)} rows={6} />
      <button onClick={() => updateData({ principalMessageEn: en, principalMessageMr: mr })} className={btnPrimary}>
        <Save className="w-4 h-4" /> {t.admin.save}
      </button>
    </div>
  );
}

function VisitingTab() {
  const { data, updateData } = useData();
  const { t } = useLanguage();
  const [en, setEn] = useState(data.visitingHoursEn);
  const [mr, setMr] = useState(data.visitingHoursMr);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Content (English)</h3>
      <textarea className={inputClass} value={en} onChange={(e) => setEn(e.target.value)} rows={6} />
      <h3 className="font-semibold">सामग्री (मराठी)</h3>
      <textarea className={inputClass} value={mr} onChange={(e) => setMr(e.target.value)} rows={6} />
      <button onClick={() => updateData({ visitingHoursEn: en, visitingHoursMr: mr })} className={btnPrimary}>
        <Save className="w-4 h-4" /> {t.admin.save}
      </button>
    </div>
  );
}

function BannerTab() {
  const { data, updateData } = useData();
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(data.bannerImage || null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `banner/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("images").upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("images").getPublicUrl(path);
      updateData({ bannerImage: urlData.publicUrl });
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      toast({ title: "Banner image updated!" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Banner Image</h3>
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">{file ? file.name : "Click to choose banner image"}</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>
      {preview && <img src={preview} alt="Preview" className="max-h-48 rounded-lg object-cover" />}
      <button onClick={handleUpload} disabled={uploading || !file} className={`${btnPrimary} ${uploading ? "opacity-50" : ""}`}>
        {uploading ? "Uploading..." : <><Save className="w-4 h-4" /> {t.admin.save}</>}
      </button>
    </div>
  );
}

function SpotlightTab() {
  const { data, updateData } = useData();
  const { t } = useLanguage();
  const [en, setEn] = useState(data.spotlightEn);
  const [mr, setMr] = useState(data.spotlightMr);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Spotlight (English)</h3>
      <input className={inputClass} value={en} onChange={(e) => setEn(e.target.value)} />
      <h3 className="font-semibold">स्पॉटलाइट (मराठी)</h3>
      <input className={inputClass} value={mr} onChange={(e) => setMr(e.target.value)} />
      <button onClick={() => updateData({ spotlightEn: en, spotlightMr: mr })} className={btnPrimary}>
        <Save className="w-4 h-4" /> {t.admin.save}
      </button>
    </div>
  );
}

function MessagesTab() {
  const { data, deleteContactMessage } = useData();

  return (
    <div className="space-y-3">
      {data.contactMessages.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">No messages yet.</p>
      ) : (
        data.contactMessages.map((m) => (
          <div key={m.id} className="flex items-start justify-between p-4 bg-background rounded-lg border">
            <div>
              <p className="font-semibold">{m.name} <span className="text-sm font-normal text-muted-foreground">({m.email})</span></p>
              {m.phone && <p className="text-xs text-muted-foreground">{m.phone}</p>}
              <p className="text-sm mt-1">{m.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.date}</p>
            </div>
            <button onClick={() => deleteContactMessage(m.id)} className={btnDanger}><Trash2 className="w-4 h-4" /></button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
