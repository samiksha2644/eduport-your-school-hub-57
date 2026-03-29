import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useData } from "@/contexts/DataContext";
import { supabase } from "@/integrations/supabase/client";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const { t } = useLanguage();
  const { data } = useData();
  const s = data.settings;
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("contact_messages").insert({
      ...form,
      date: new Date().toISOString().split("T")[0],
    });
    if (error) { toast({ title: "Failed to send message", variant: "destructive" }); return; }
    setSuccess(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="font-heading font-bold text-4xl text-center mb-12">{t.contact.title}</h1>
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-heading font-semibold text-2xl mb-6">{t.contact.formTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder={t.contact.name} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-3 rounded-lg border bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none" />
              <input type="email" placeholder={t.contact.email} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-4 py-3 rounded-lg border bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none" />
              <input type="tel" placeholder={t.contact.phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg border bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none" />
              <textarea placeholder={t.contact.message} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} className="w-full px-4 py-3 rounded-lg border bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none resize-none" />
              <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> {t.contact.submit}
              </button>
              {success && <p className="text-center text-sm font-medium text-green-600">{t.contact.success}</p>}
            </form>
          </div>
          <div>
            <div className="bg-card rounded-xl p-8 border space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-primary" /></div>
                <div><h3 className="font-semibold text-sm text-muted-foreground mb-1">{t.contact.schoolEmail}</h3><p className="font-medium">{s.school_email}</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 text-primary" /></div>
                <div><h3 className="font-semibold text-sm text-muted-foreground mb-1">{t.contact.schoolPhone}</h3><p className="font-medium">{s.school_phone}</p></div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-primary" /></div>
                <div><h3 className="font-semibold text-sm text-muted-foreground mb-1">{t.contact.schoolAddress}</h3><p className="font-medium">{s.school_address}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
