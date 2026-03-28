CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  caption_en text NOT NULL DEFAULT '',
  caption_mr text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'events',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read gallery" ON public.gallery_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin insert gallery" ON public.gallery_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete gallery" ON public.gallery_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));