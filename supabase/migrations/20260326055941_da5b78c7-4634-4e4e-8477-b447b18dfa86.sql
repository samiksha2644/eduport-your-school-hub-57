
-- Exams table for scholarship & competitive exams
CREATE TABLE public.exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_mr text NOT NULL DEFAULT '',
  overview_en text NOT NULL DEFAULT '',
  overview_mr text NOT NULL DEFAULT '',
  eligibility_en text NOT NULL DEFAULT '',
  eligibility_mr text NOT NULL DEFAULT '',
  exam_pattern_en text NOT NULL DEFAULT '',
  exam_pattern_mr text NOT NULL DEFAULT '',
  syllabus_en text NOT NULL DEFAULT '',
  syllabus_mr text NOT NULL DEFAULT '',
  reference_links jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read exams" ON public.exams FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Auth insert exams" ON public.exams FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update exams" ON public.exams FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete exams" ON public.exams FOR DELETE TO authenticated USING (true);

-- Exam resources (PDF uploads)
CREATE TABLE public.exam_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.exam_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read exam_resources" ON public.exam_resources FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Auth insert exam_resources" ON public.exam_resources FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth delete exam_resources" ON public.exam_resources FOR DELETE TO authenticated USING (true);

-- Career streams table
CREATE TABLE public.career_streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('after_10th', 'after_12th')),
  name_en text NOT NULL,
  name_mr text NOT NULL DEFAULT '',
  subjects_en text NOT NULL DEFAULT '',
  subjects_mr text NOT NULL DEFAULT '',
  career_options_en text NOT NULL DEFAULT '',
  career_options_mr text NOT NULL DEFAULT '',
  skills_en text NOT NULL DEFAULT '',
  skills_mr text NOT NULL DEFAULT '',
  future_scope_en text NOT NULL DEFAULT '',
  future_scope_mr text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.career_streams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read career_streams" ON public.career_streams FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Auth insert career_streams" ON public.career_streams FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update career_streams" ON public.career_streams FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete career_streams" ON public.career_streams FOR DELETE TO authenticated USING (true);

-- Entrance exams table
CREATE TABLE public.entrance_exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_mr text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  description_mr text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.entrance_exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read entrance_exams" ON public.entrance_exams FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Auth insert entrance_exams" ON public.entrance_exams FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update entrance_exams" ON public.entrance_exams FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth delete entrance_exams" ON public.entrance_exams FOR DELETE TO authenticated USING (true);
