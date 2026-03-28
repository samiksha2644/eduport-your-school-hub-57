import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

interface GalleryItem {
  id: string;
  url: string;
  caption_en: string;
  caption_mr: string;
  category: string;
}

const GalleryPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const { data } = await supabase.from("gallery_items").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  };

  const categories = Object.entries(t.gallery.categories);
  const filtered = filter === "all" ? items : items.filter((g) => g.category === filter);

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="font-heading font-bold text-4xl text-center mb-8">{t.gallery.title}</h1>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((g) => (
              <div
                key={g.id}
                onClick={() => setSelectedImage(g.url)}
                className="aspect-square rounded-xl overflow-hidden cursor-pointer group"
              >
                <img
                  src={g.url}
                  alt={lang === "en" ? g.caption_en : g.caption_mr}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-20">No images in gallery yet.</p>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-foreground/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-card text-foreground hover:bg-secondary"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedImage}
            alt=""
            className="max-w-full max-h-[90vh] rounded-xl object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
