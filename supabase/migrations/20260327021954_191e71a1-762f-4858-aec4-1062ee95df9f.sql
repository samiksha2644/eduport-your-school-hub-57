
DROP POLICY IF EXISTS "Authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Public read" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update" ON storage.objects;

CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Public read" ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'images');

CREATE POLICY "Authenticated delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'images');

CREATE POLICY "Authenticated update" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');
