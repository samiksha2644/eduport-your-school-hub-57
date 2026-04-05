import React, { useState, useRef, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, Save, Megaphone, Image, Trophy, BookOpen, Clock, MessageSquare, Star, ImageIcon, Upload, GraduationCap, Compass, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ExaminationsAdmin from "./admin/ExaminationsAdmin";
import CareerAdmin from "./admin/CareerAdmin";

const AdminDashboard = () => {
  const { t } = useLanguage();
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
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/10"}`}>
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
  const [form, setForm] = useState({ title_en: "", title_mr: "", desc_en: "", desc_mr: "", date: "", category: "all" });

  const handleAdd = async () => {
    if (!form.title_en || !form.date) return;
    const ok = await addAnnouncement(form);
    if (ok) {
      toast({ title: "Announcement added!" });
      setForm({ title_en: "", title_mr: "", desc_en: "", desc_mr: "", date: "", category: "all" });
    } else {
      toast({ title: "Failed to add", variant: "destructive" });
    }
  };

  const handleDelete = async (id) => {
    const ok = await deleteAnnouncement(id);
    if (ok) toast({ title: "Deleted." });
    else toast({ title: "Failed to delete", variant: "destructive" });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4 p-4 bg-background rounded-lg border">
        <input className={inputClass} placeholder="Title (English)" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
        <input className={inputClass} placeholder="शीर्षक (मराठी)" value={form.title_mr} onChange={(e) => setForm({ ...form, title_mr: e.target.value })} />
        <textarea className={inputClass} placeholder="Description (English)" value={form.desc_en} onChange={(e) => setForm({ ...form, desc_en: e.target.value })} rows={2} />
        <textarea className={inputClass} placeholder="वर्णन (मराठी)" value={form.desc_mr} onChange={(e) => setForm({ ...form, desc_mr: e.target.value })} rows={2} />
        <input className={inputClass} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
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
              <p className="font-semibold">{a.title_en}</p>
              <p className="text-sm text-muted-foreground">{a.title_mr} • {a.date} • {a.category}</p>
            </div>
            <button onClick={() => handleDelete(a.id)} className={btnDanger}><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryTab() {
  const { t } = useLanguage();
  const [galleryItems, setGalleryItems] = useState([]);
  const [form, setForm] = useState({ captionEn: "", captionMr: "", category: "events" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const fetchGallery = async () => {
    const { data } = await supabase.from("gallery_items").select("*").order("created_at", { ascending: false });
    if (data) setGalleryItems(data);
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const handleAdd = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `gallery/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("images").upload(path, file);
      if (uploadErr) throw uploadErr;
      const { data: urlData } = supabase.storage.from("images").getPublicUrl(path);
      const { error: dbErr } = await supabase.from("gallery_items").insert({
        url: urlData.publicUrl, caption_en: form.captionEn, caption_mr: form.captionMr, category: form.category,
      });
      if (dbErr) throw dbErr;
      await fetchGallery();
      setForm({ captionEn: "", captionMr: "", category: "events" });
      setFile(null); setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
      toast({ title: "Image uploaded!" });
    } catch (err) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally { setUploading(false); }
  };

  const handleDelete = async (item) => {
    try {
      const match = item.url.match(/images\/(.+)$/);
      if (match) await supabase.storage.from("images").remove([match[1]]);
      const { error } = await supabase.from("gallery_items").delete().eq("id", item.id);
      if (error) throw error;
      await fetchGallery();
      toast({ title: "Image deleted." });
    } catch (err) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
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
        {preview && <div className="md:col-span-2"><img src={preview} alt="Preview" className="max-h-40 rounded-lg object-cover" /></div>}
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
        {galleryItems.map((g) => (
          <div key={g.id} className="relative group">
            <img src={g.url} alt={g.caption_en} className="w-full aspect-square object-cover rounded-lg" loading="lazy" />
            <button onClick={() => handleDelete(g)} className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity">
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
  const [form, setForm] = useState({ title_en: "", title_mr: "", desc_en: "", desc_mr: "" });

  const handleAdd = async () => {
    if (!form.title_en) return;
    const ok = await addAchievement(form);
    if (ok) { toast({ title: "Achievement added!" }); setForm({ title_en: "", title_mr: "", desc_en: "", desc_mr: "" }); }
    else toast({ title: "Failed to add", variant: "destructive" });
  };

  const handleDelete = async (id) => {
    const ok = await deleteAchievement(id);
    if (ok) toast({ title: "Deleted." });
    else toast({ title: "Failed to delete", variant: "destructive" });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4 p-4 bg-background rounded-lg border">
        <input className={inputClass} placeholder="Title (English)" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
        <input className={inputClass} placeholder="शीर्षक (मराठी)" value={form.title_mr} onChange={(e) => setForm({ ...form, title_mr: e.target.value })} />
        <textarea className={inputClass} placeholder="Description (English)" value={form.desc_en} onChange={(e) => setForm({ ...form, desc_en: e.target.value })} rows={2} />
        <textarea className={inputClass} placeholder="वर्णन (मराठी)" value={form.desc_mr} onChange={(e) => setForm({ ...form, desc_mr: e.target.value })} rows={2} />
        <button onClick={handleAdd} className={btnPrimary}><Plus className="w-4 h-4" /> {t.admin.add}</button>
      </div>
      <div className="space-y-3">
        {data.achievements.map((a) => (
          <div key={a.id} className="flex items-start justify-between p-4 bg-background rounded-lg border">
            <div>
              <p className="font-semibold">{a.title_en}</p>
              <p className="text-sm text-muted-foreground">{a.title_mr}</p>
            </div>
            <button onClick={() => handleDelete(a.id)} className={btnDanger}><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisionTab() {
  const { data, updateSettings } = useData();
  const { t } = useLanguage();
  const [visionEn, setVisionEn] = useState(data.settings.vision_en);
  const [visionMr, setVisionMr] = useState(data.settings.vision_mr);
  const [missionEn, setMissionEn] = useState(data.settings.mission_en);
  const [missionMr, setMissionMr] = useState(data.settings.mission_mr);

  useEffect(() => {
    setVisionEn(data.settings.vision_en);
    setVisionMr(data.settings.vision_mr);
    setMissionEn(data.settings.mission_en);
    setMissionMr(data.settings.mission_mr);
  }, [data.settings]);

  const handleSave = async () => {
    const ok = await updateSettings({ vision_en: visionEn, vision_mr: visionMr, mission_en: missionEn, mission_mr: missionMr });
    toast({ title: ok ? "Saved!" : "Save failed", variant: ok ? "default" : "destructive" });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Vision (English)</h3>
      <textarea className={inputClass} value={visionEn} onChange={(e) => setVisionEn(e.target.value)} rows={4} />
      <h3 className="font-semibold">दृष्टी (मराठी)</h3>
      <textarea className={inputClass} value={visionMr} onChange={(e) => setVisionMr(e.target.value)} rows={4} />
      <h3 className="font-semibold">Mission (English)</h3>
      <textarea className={inputClass} value={missionEn} onChange={(e) => setMissionEn(e.target.value)} rows={4} />
      <h3 className="font-semibold">ध्येय (मराठी)</h3>
      <textarea className={inputClass} value={missionMr} onChange={(e) => setMissionMr(e.target.value)} rows={4} />
      <button onClick={handleSave} className={btnPrimary}><Save className="w-4 h-4" /> {t.admin.save}</button>
    </div>
  );
}

function PrincipalTab() {
  const { data, updateSettings } = useData();
  const { t } = useLanguage();
  const [en, setEn] = useState(data.settings.principal_message_en);
  const [mr, setMr] = useState(data.settings.principal_message_mr);

  useEffect(() => {
    setEn(data.settings.principal_message_en);
    setMr(data.settings.principal_message_mr);
  }, [data.settings]);

  const handleSave = async () => {
    const ok = await updateSettings({ principal_message_en: en, principal_message_mr: mr });
    toast({ title: ok ? "Saved!" : "Save failed", variant: ok ? "default" : "destructive" });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Message (English)</h3>
      <textarea className={inputClass} value={en} onChange={(e) => setEn(e.target.value)} rows={6} />
      <h3 className="font-semibold">संदेश (मराठी)</h3>
      <textarea className={inputClass} value={mr} onChange={(e) => setMr(e.target.value)} rows={6} />
      <button onClick={handleSave} className={btnPrimary}><Save className="w-4 h-4" /> {t.admin.save}</button>
    </div>
  );
}

function VisitingTab() {
  const { data, updateSettings } = useData();
  const { t } = useLanguage();
  const [en, setEn] = useState(data.settings.visiting_hours_en);
  const [mr, setMr] = useState(data.settings.visiting_hours_mr);

  useEffect(() => {
    setEn(data.settings.visiting_hours_en);
    setMr(data.settings.visiting_hours_mr);
  }, [data.settings]);

  const handleSave = async () => {
    const ok = await updateSettings({ visiting_hours_en: en, visiting_hours_mr: mr });
    toast({ title: ok ? "Saved!" : "Save failed", variant: ok ? "default" : "destructive" });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Content (English)</h3>
      <textarea className={inputClass} value={en} onChange={(e) => setEn(e.target.value)} rows={6} />
      <h3 className="font-semibold">सामग्री (मराठी)</h3>
      <textarea className={inputClass} value={mr} onChange={(e) => setMr(e.target.value)} rows={6} />
      <button onClick={handleSave} className={btnPrimary}><Save className="w-4 h-4" /> {t.admin.save}</button>
    </div>
  );
}

function BannerTab() {
  const { data, updateSettings } = useData();
  const { t } = useLanguage();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(data.settings.banner_image || null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => { setPreview(data.settings.banner_image || null); }, [data.settings.banner_image]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
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
      const ok = await updateSettings({ banner_image: urlData.publicUrl });
      if (!ok) throw new Error("Failed to save");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      toast({ title: "Banner updated!" });
    } catch (err) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally { setUploading(false); }
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
  const { data, updateSettings } = useData();
  const { t } = useLanguage();
  const [en, setEn] = useState(data.settings.spotlight_en);
  const [mr, setMr] = useState(data.settings.spotlight_mr);

  useEffect(() => {
    setEn(data.settings.spotlight_en);
    setMr(data.settings.spotlight_mr);
  }, [data.settings]);

  const handleSave = async () => {
    const ok = await updateSettings({ spotlight_en: en, spotlight_mr: mr });
    toast({ title: ok ? "Saved!" : "Save failed", variant: ok ? "default" : "destructive" });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Spotlight (English)</h3>
      <input className={inputClass} value={en} onChange={(e) => setEn(e.target.value)} />
      <h3 className="font-semibold">स्पॉटलाइट (मराठी)</h3>
      <input className={inputClass} value={mr} onChange={(e) => setMr(e.target.value)} />
      <button onClick={handleSave} className={btnPrimary}><Save className="w-4 h-4" /> {t.admin.save}</button>
    </div>
  );
}

function MessagesTab() {
  const { data, deleteContactMessage, refreshMessages } = useData();

  useEffect(() => { refreshMessages(); }, [refreshMessages]);

  const handleDelete = async (id) => {
    const ok = await deleteContactMessage(id);
    if (ok) toast({ title: "Deleted." });
    else toast({ title: "Failed to delete", variant: "destructive" });
  };

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
            <button onClick={() => handleDelete(m.id)} className={btnDanger}><Trash2 className="w-4 h-4" /></button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
