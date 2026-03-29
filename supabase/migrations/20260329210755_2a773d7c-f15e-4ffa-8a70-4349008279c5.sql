
-- Allow public INSERT/UPDATE/DELETE on tasks
CREATE POLICY "Public insert tasks" ON public.tasks FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public update tasks" ON public.tasks FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public delete tasks" ON public.tasks FOR DELETE TO public USING (true);

-- Allow public INSERT/DELETE on links (no update needed per scope)
CREATE POLICY "Public insert links" ON public.links FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Public delete links" ON public.links FOR DELETE TO public USING (true);
