
DROP POLICY IF EXISTS "Auth delete career_streams" ON public.career_streams;
DROP POLICY IF EXISTS "Auth insert career_streams" ON public.career_streams;
DROP POLICY IF EXISTS "Auth update career_streams" ON public.career_streams;

CREATE POLICY "Admin insert career_streams" ON public.career_streams FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update career_streams" ON public.career_streams FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete career_streams" ON public.career_streams FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Auth delete entrance_exams" ON public.entrance_exams;
DROP POLICY IF EXISTS "Auth insert entrance_exams" ON public.entrance_exams;
DROP POLICY IF EXISTS "Auth update entrance_exams" ON public.entrance_exams;

CREATE POLICY "Admin insert entrance_exams" ON public.entrance_exams FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update entrance_exams" ON public.entrance_exams FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete entrance_exams" ON public.entrance_exams FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Auth delete exam_resources" ON public.exam_resources;
DROP POLICY IF EXISTS "Auth insert exam_resources" ON public.exam_resources;

CREATE POLICY "Admin insert exam_resources" ON public.exam_resources FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete exam_resources" ON public.exam_resources FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Auth delete exams" ON public.exams;
DROP POLICY IF EXISTS "Auth insert exams" ON public.exams;
DROP POLICY IF EXISTS "Auth update exams" ON public.exams;

CREATE POLICY "Admin insert exams" ON public.exams FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update exams" ON public.exams FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete exams" ON public.exams FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
