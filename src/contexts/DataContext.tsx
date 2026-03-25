import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface Announcement {
  id: string;
  titleEn: string;
  titleMr: string;
  descEn: string;
  descMr: string;
  date: string;
  category: "all" | "5-8" | "9-10" | "11-12";
}

export interface GalleryItem {
  id: string;
  url: string;
  captionEn: string;
  captionMr: string;
  category: string;
}

export interface Achievement {
  id: string;
  titleEn: string;
  titleMr: string;
  descEn: string;
  descMr: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
}

export interface SiteData {
  announcements: Announcement[];
  gallery: GalleryItem[];
  achievements: Achievement[];
  visionEn: string;
  visionMr: string;
  missionEn: string;
  missionMr: string;
  principalMessageEn: string;
  principalMessageMr: string;
  visitingHoursEn: string;
  visitingHoursMr: string;
  bannerImage: string;
  spotlightEn: string;
  spotlightMr: string;
  contactMessages: ContactMessage[];
  schoolEmail: string;
  schoolPhone: string;
  schoolAddress: string;
}

interface AdminUser {
  email: string;
  password: string;
  isAdmin: boolean;
}

interface DataContextType {
  data: SiteData;
  updateData: (updates: Partial<SiteData>) => void;
  addAnnouncement: (a: Omit<Announcement, "id">) => void;
  deleteAnnouncement: (id: string) => void;
  addGalleryItem: (g: Omit<GalleryItem, "id">) => void;
  deleteGalleryItem: (id: string) => void;
  addAchievement: (a: Omit<Achievement, "id">) => void;
  deleteAchievement: (id: string) => void;
  addContactMessage: (m: Omit<ContactMessage, "id" | "date">) => void;
  deleteContactMessage: (id: string) => void;
  isAdmin: boolean;
  adminLogin: (email: string, password: string) => boolean;
  adminRegister: (email: string, password: string) => boolean;
  adminLogout: () => void;
}

const defaultData: SiteData = {
  announcements: [
    { id: "1", titleEn: "Board Exam Schedule Released", titleMr: "बोर्ड परीक्षा वेळापत्रक जाहीर", descEn: "The board exam schedule for Class 10 and 12 has been released. Students are advised to check the notice board.", descMr: "इयत्ता १० आणि १२ चे बोर्ड परीक्षा वेळापत्रक जाहीर झाले आहे. विद्यार्थ्यांनी सूचना फलक तपासावा.", date: "2026-03-20", category: "9-10" },
    { id: "2", titleEn: "Annual Sports Day 2026", titleMr: "वार्षिक क्रीडा दिन २०२६", descEn: "Annual Sports Day will be held on April 15, 2026. All students must participate.", descMr: "वार्षिक क्रीडा दिन १५ एप्रिल २०२६ रोजी आयोजित केला जाईल. सर्व विद्यार्थ्यांनी सहभागी व्हावे.", date: "2026-03-18", category: "all" },
    { id: "3", titleEn: "Science Exhibition", titleMr: "विज्ञान प्रदर्शन", descEn: "Inter-school science exhibition for classes 5-8 on March 28.", descMr: "इयत्ता ५-८ साठी आंतरशालेय विज्ञान प्रदर्शन २८ मार्च रोजी.", date: "2026-03-15", category: "5-8" },
  ],
  gallery: [],
  achievements: [
    { id: "1", titleEn: "State Level Science Fair Winners", titleMr: "राज्यस्तरीय विज्ञान प्रदर्शन विजेते", descEn: "Our students won 3 gold medals at the State Science Fair 2025.", descMr: "आमच्या विद्यार्थ्यांनी राज्य विज्ञान प्रदर्शन २०२५ मध्ये ३ सुवर्णपदके जिंकली." },
    { id: "2", titleEn: "100% Board Results", titleMr: "१००% बोर्ड निकाल", descEn: "All students of Class 10 and 12 passed with distinction.", descMr: "इयत्ता १०वी आणि १२वीच्या सर्व विद्यार्थ्यांनी प्रथम श्रेणीत उत्तीर्ण." },
    { id: "3", titleEn: "National Sports Championship", titleMr: "राष्ट्रीय क्रीडा स्पर्धा", descEn: "School cricket team secured 2nd place in national championship.", descMr: "शाळेच्या क्रिकेट संघाने राष्ट्रीय स्पर्धेत द्वितीय स्थान मिळवले." },
  ],
  visionEn: "To be a center of academic excellence that nurtures holistic development, creativity, and responsible citizenship in every student. We aspire to create lifelong learners who contribute meaningfully to society.",
  visionMr: "प्रत्येक विद्यार्थ्यामध्ये सर्वांगीण विकास, सर्जनशीलता आणि जबाबदार नागरिकत्व जोपासणारे शैक्षणिक उत्कृष्टतेचे केंद्र बनणे. आम्ही आजीवन शिकणारे तयार करण्याची इच्छा बाळगतो जे समाजाला अर्थपूर्ण योगदान देतात.",
  missionEn: "To provide quality education through innovative teaching methods, foster critical thinking, and build character with strong moral values. We are committed to creating an inclusive environment that celebrates diversity and encourages every student to reach their full potential.",
  missionMr: "नाविन्यपूर्ण शिक्षण पद्धतींद्वारे दर्जेदार शिक्षण देणे, समीक्षात्मक विचार वाढवणे आणि मजबूत नैतिक मूल्यांसह चारित्र्य घडवणे. आम्ही विविधतेचा सन्मान करणारे आणि प्रत्येक विद्यार्थ्याला त्यांच्या पूर्ण क्षमतेपर्यंत पोहोचण्यासाठी प्रोत्साहित करणारे सर्वसमावेशक वातावरण तयार करण्यासाठी वचनबद्ध आहोत.",
  principalMessageEn: "Dear Students and Parents,\n\nAt EduPort, we believe in creating an environment where every child can discover their potential and develop the skills needed for the future. Our dedicated faculty works tirelessly to provide not just academic excellence but also to nurture values of integrity, compassion, and perseverance.\n\nWe encourage parents to actively participate in their child's educational journey. Together, we can build a brighter future.\n\nWarm regards",
  principalMessageMr: "प्रिय विद्यार्थी आणि पालक,\n\nEduPort मध्ये, आम्ही अशा वातावरणाची निर्मिती करण्यावर विश्वास ठेवतो जिथे प्रत्येक मूल आपली क्षमता शोधू शकेल आणि भविष्यासाठी आवश्यक कौशल्ये विकसित करू शकेल. आमचे समर्पित शिक्षक केवळ शैक्षणिक उत्कृष्टताच नव्हे तर सचोटी, करुणा आणि चिकाटीची मूल्ये जोपासण्यासाठी अथक परिश्रम करतात.\n\nआम्ही पालकांना त्यांच्या मुलाच्या शैक्षणिक प्रवासात सक्रियपणे सहभागी होण्यास प्रोत्साहित करतो. एकत्रितपणे, आपण एक उज्ज्वल भविष्य घडवू शकतो.\n\nसस्नेह",
  visitingHoursEn: "Parents and guardians are welcome to meet teachers during the designated visiting hours. Please ensure you carry a valid ID and inform the school office in advance.\n\nFor urgent matters, please contact the school office directly.",
  visitingHoursMr: "पालक आणि पालकांचे नियुक्त भेटीच्या तासांमध्ये शिक्षकांना भेटण्यासाठी स्वागत आहे. कृपया वैध ओळखपत्र बाळगा आणि शाळेच्या कार्यालयाला आगाऊ सूचित करा.\n\nतातडीच्या बाबींसाठी, कृपया शाळेच्या कार्यालयाशी थेट संपर्क साधा.",
  bannerImage: "",
  spotlightEn: "Admissions open for 2026-27 academic year! Contact the school office for details.",
  spotlightMr: "२०२६-२७ शैक्षणिक वर्षासाठी प्रवेश सुरू! तपशीलांसाठी शाळेच्या कार्यालयाशी संपर्क साधा.",
  contactMessages: [],
  schoolEmail: "info@eduport.school",
  schoolPhone: "+91 12345 67890",
  schoolAddress: "123 Education Lane, Knowledge City, Maharashtra 411001",
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const genId = () => Math.random().toString(36).substr(2, 9);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<SiteData>(() => {
    const saved = localStorage.getItem("eduport_data");
    return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("eduport_admin_session") === "true";
  });

  useEffect(() => {
    localStorage.setItem("eduport_data", JSON.stringify(data));
  }, [data]);

  const updateData = useCallback((updates: Partial<SiteData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const addAnnouncement = useCallback((a: Omit<Announcement, "id">) => {
    setData((prev) => ({ ...prev, announcements: [{ ...a, id: genId() }, ...prev.announcements] }));
  }, []);

  const deleteAnnouncement = useCallback((id: string) => {
    setData((prev) => ({ ...prev, announcements: prev.announcements.filter((a) => a.id !== id) }));
  }, []);

  const addGalleryItem = useCallback((g: Omit<GalleryItem, "id">) => {
    setData((prev) => ({ ...prev, gallery: [{ ...g, id: genId() }, ...prev.gallery] }));
  }, []);

  const deleteGalleryItem = useCallback((id: string) => {
    setData((prev) => ({ ...prev, gallery: prev.gallery.filter((g) => g.id !== id) }));
  }, []);

  const addAchievement = useCallback((a: Omit<Achievement, "id">) => {
    setData((prev) => ({ ...prev, achievements: [{ ...a, id: genId() }, ...prev.achievements] }));
  }, []);

  const deleteAchievement = useCallback((id: string) => {
    setData((prev) => ({ ...prev, achievements: prev.achievements.filter((a) => a.id !== id) }));
  }, []);

  const addContactMessage = useCallback((m: Omit<ContactMessage, "id" | "date">) => {
    setData((prev) => ({
      ...prev,
      contactMessages: [{ ...m, id: genId(), date: new Date().toISOString().split("T")[0] }, ...prev.contactMessages],
    }));
  }, []);

  const deleteContactMessage = useCallback((id: string) => {
    setData((prev) => ({ ...prev, contactMessages: prev.contactMessages.filter((m) => m.id !== id) }));
  }, []);

  const adminLogin = useCallback((email: string, password: string) => {
    const users: AdminUser[] = JSON.parse(localStorage.getItem("eduport_users") || "[]");
    const user = users.find((u) => u.email === email && u.password === password && u.isAdmin);
    if (user) {
      setIsAdmin(true);
      localStorage.setItem("eduport_admin_session", "true");
      return true;
    }
    return false;
  }, []);

  const adminRegister = useCallback((email: string, password: string) => {
    const users: AdminUser[] = JSON.parse(localStorage.getItem("eduport_users") || "[]");
    if (users.find((u) => u.email === email)) return false;
    const isFirst = users.length === 0;
    users.push({ email, password, isAdmin: isFirst });
    localStorage.setItem("eduport_users", JSON.stringify(users));
    if (isFirst) {
      setIsAdmin(true);
      localStorage.setItem("eduport_admin_session", "true");
    }
    return true;
  }, []);

  const adminLogout = useCallback(() => {
    setIsAdmin(false);
    localStorage.removeItem("eduport_admin_session");
  }, []);

  return (
    <DataContext.Provider
      value={{
        data, updateData,
        addAnnouncement, deleteAnnouncement,
        addGalleryItem, deleteGalleryItem,
        addAchievement, deleteAchievement,
        addContactMessage, deleteContactMessage,
        isAdmin, adminLogin, adminRegister, adminLogout,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};
