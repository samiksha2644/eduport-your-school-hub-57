
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL DEFAULT '',
  title_mr text NOT NULL DEFAULT '',
  desc_en text NOT NULL DEFAULT '',
  desc_mr text NOT NULL DEFAULT '',
  date text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'all',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin insert announcements" ON public.announcements FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update announcements" ON public.announcements FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete announcements" ON public.announcements FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL DEFAULT '',
  title_mr text NOT NULL DEFAULT '',
  desc_en text NOT NULL DEFAULT '',
  desc_mr text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read achievements" ON public.achievements FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin insert achievements" ON public.achievements FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update achievements" ON public.achievements FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete achievements" ON public.achievements FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  date text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admin read contact messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete contact messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vision_en text NOT NULL DEFAULT '',
  vision_mr text NOT NULL DEFAULT '',
  mission_en text NOT NULL DEFAULT '',
  mission_mr text NOT NULL DEFAULT '',
  principal_message_en text NOT NULL DEFAULT '',
  principal_message_mr text NOT NULL DEFAULT '',
  visiting_hours_en text NOT NULL DEFAULT '',
  visiting_hours_mr text NOT NULL DEFAULT '',
  banner_image text NOT NULL DEFAULT '',
  spotlight_en text NOT NULL DEFAULT '',
  spotlight_mr text NOT NULL DEFAULT '',
  school_email text NOT NULL DEFAULT 'info@eduport.school',
  school_phone text NOT NULL DEFAULT '+91 12345 67890',
  school_address text NOT NULL DEFAULT '123 Education Lane, Knowledge City, Maharashtra 411001',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin update site settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (
  vision_en, vision_mr, mission_en, mission_mr,
  principal_message_en, principal_message_mr,
  visiting_hours_en, visiting_hours_mr,
  spotlight_en, spotlight_mr
) VALUES (
  'To be a center of academic excellence that nurtures holistic development, creativity, and responsible citizenship in every student.',
  'प्रत्येक विद्यार्थ्यामध्ये सर्वांगीण विकास, सर्जनशीलता आणि जबाबदार नागरिकत्व जोपासणारे शैक्षणिक उत्कृष्टतेचे केंद्र बनणे.',
  'To provide quality education through innovative teaching methods, foster critical thinking, and build character with strong moral values.',
  'नाविन्यपूर्ण शिक्षण पद्धतींद्वारे दर्जेदार शिक्षण देणे, समीक्षात्मक विचार वाढवणे आणि मजबूत नैतिक मूल्यांसह चारित्र्य घडवणे.',
  'Dear Students and Parents,

At EduPort, we believe in creating an environment where every child can discover their potential and develop the skills needed for the future.

Warm regards',
  'प्रिय विद्यार्थी आणि पालक,

EduPort मध्ये, आम्ही अशा वातावरणाची निर्मिती करण्यावर विश्वास ठेवतो जिथे प्रत्येक मूल आपली क्षमता शोधू शकेल.

सस्नेह',
  'Parents and guardians are welcome to meet teachers during the designated visiting hours.',
  'पालक आणि पालकांचे नियुक्त भेटीच्या तासांमध्ये शिक्षकांना भेटण्यासाठी स्वागत आहे.',
  'Admissions open for 2026-27 academic year!',
  '२०२६-२७ शैक्षणिक वर्षासाठी प्रवेश सुरू!'
);
