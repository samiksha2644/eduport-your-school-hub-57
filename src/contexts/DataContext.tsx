import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Announcement {
  id: string;
  title_en: string;
  title_mr: string;
  desc_en: string;
  desc_mr: string;
  date: string;
  category: string;
}

export interface Achievement {
  id: string;
  title_en: string;
  title_mr: string;
  desc_en: string;
  desc_mr: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
}

export interface SiteSettings {
  vision_en: string;
  vision_mr: string;
  mission_en: string;
  mission_mr: string;
  principal_message_en: string;
  principal_message_mr: string;
  visiting_hours_en: string;
  visiting_hours_mr: string;
  banner_image: string;
  spotlight_en: string;
  spotlight_mr: string;
  school_email: string;
  school_phone: string;
  school_address: string;
  map_embed_url: string;
}

export interface SiteData {
  announcements: Announcement[];
  achievements: Achievement[];
  contactMessages: ContactMessage[];
  settings: SiteSettings;
}

const defaultSettings: SiteSettings = {
  vision_en: "", vision_mr: "", mission_en: "", mission_mr: "",
  principal_message_en: "", principal_message_mr: "",
  visiting_hours_en: "", visiting_hours_mr: "",
  banner_image: "", spotlight_en: "", spotlight_mr: "",
  school_email: "info@eduport.school",
  school_phone: "+91 12345 67890",
  school_address: "123 Education Lane, Knowledge City, Maharashtra 411001",
};

interface DataContextType {
  data: SiteData;
  loading: boolean;
  refreshAll: () => Promise<void>;
  refreshAnnouncements: () => Promise<void>;
  refreshAchievements: () => Promise<void>;
  refreshMessages: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  addAnnouncement: (a: Omit<Announcement, "id">) => Promise<boolean>;
  deleteAnnouncement: (id: string) => Promise<boolean>;
  addAchievement: (a: Omit<Achievement, "id">) => Promise<boolean>;
  deleteAchievement: (id: string) => Promise<boolean>;
  addContactMessage: (m: { name: string; email: string; phone: string; message: string }) => Promise<boolean>;
  deleteContactMessage: (id: string) => Promise<boolean>;
  updateSettings: (updates: Partial<SiteSettings>) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState<SiteData>({
    announcements: [],
    achievements: [],
    contactMessages: [],
    settings: defaultSettings,
  });
  const [loading, setLoading] = useState(true);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  const refreshAnnouncements = useCallback(async () => {
    const { data: rows } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    if (rows) setData(prev => ({ ...prev, announcements: rows }));
  }, []);

  const refreshAchievements = useCallback(async () => {
    const { data: rows } = await supabase.from("achievements").select("*").order("created_at", { ascending: false });
    if (rows) setData(prev => ({ ...prev, achievements: rows }));
  }, []);

  const refreshMessages = useCallback(async () => {
    const { data: rows } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (rows) setData(prev => ({ ...prev, contactMessages: rows }));
  }, []);

  const refreshSettings = useCallback(async () => {
    const { data: rows } = await supabase.from("site_settings").select("*").limit(1);
    if (rows && rows.length > 0) {
      setSettingsId(rows[0].id);
      const s = rows[0];
      setData(prev => ({
        ...prev,
        settings: {
          vision_en: s.vision_en, vision_mr: s.vision_mr,
          mission_en: s.mission_en, mission_mr: s.mission_mr,
          principal_message_en: s.principal_message_en, principal_message_mr: s.principal_message_mr,
          visiting_hours_en: s.visiting_hours_en, visiting_hours_mr: s.visiting_hours_mr,
          banner_image: s.banner_image, spotlight_en: s.spotlight_en, spotlight_mr: s.spotlight_mr,
          school_email: s.school_email, school_phone: s.school_phone, school_address: s.school_address,
        },
      }));
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([refreshAnnouncements(), refreshAchievements(), refreshSettings()]);
    // messages only fetched by admin
    setLoading(false);
  }, [refreshAnnouncements, refreshAchievements, refreshSettings]);

  useEffect(() => { refreshAll(); }, [refreshAll]);

  const addAnnouncement = useCallback(async (a: Omit<Announcement, "id">) => {
    const { error } = await supabase.from("announcements").insert(a);
    if (error) { console.error(error); return false; }
    await refreshAnnouncements();
    return true;
  }, [refreshAnnouncements]);

  const deleteAnnouncement = useCallback(async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) { console.error(error); return false; }
    await refreshAnnouncements();
    return true;
  }, [refreshAnnouncements]);

  const addAchievement = useCallback(async (a: Omit<Achievement, "id">) => {
    const { error } = await supabase.from("achievements").insert(a);
    if (error) { console.error(error); return false; }
    await refreshAchievements();
    return true;
  }, [refreshAchievements]);

  const deleteAchievement = useCallback(async (id: string) => {
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (error) { console.error(error); return false; }
    await refreshAchievements();
    return true;
  }, [refreshAchievements]);

  const addContactMessage = useCallback(async (m: { name: string; email: string; phone: string; message: string }) => {
    const { error } = await supabase.from("contact_messages").insert({
      ...m,
      date: new Date().toISOString().split("T")[0],
    });
    if (error) { console.error(error); return false; }
    return true;
  }, []);

  const deleteContactMessage = useCallback(async (id: string) => {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) { console.error(error); return false; }
    await refreshMessages();
    return true;
  }, [refreshMessages]);

  const updateSettings = useCallback(async (updates: Partial<SiteSettings>) => {
    if (!settingsId) return false;
    const { error } = await supabase.from("site_settings").update(updates).eq("id", settingsId);
    if (error) { console.error(error); return false; }
    await refreshSettings();
    return true;
  }, [settingsId, refreshSettings]);

  return (
    <DataContext.Provider value={{
      data, loading, refreshAll,
      refreshAnnouncements, refreshAchievements, refreshMessages, refreshSettings,
      addAnnouncement, deleteAnnouncement,
      addAchievement, deleteAchievement,
      addContactMessage, deleteContactMessage,
      updateSettings,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};
