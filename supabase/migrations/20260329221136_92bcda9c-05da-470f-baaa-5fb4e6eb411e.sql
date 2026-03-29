-- Allow public insert on projects (demo mode)
CREATE POLICY "Public insert projects"
ON public.projects FOR INSERT
TO public
WITH CHECK (true);

-- Allow public insert on project_members (demo mode)
CREATE POLICY "Public insert project_members"
ON public.project_members FOR INSERT
TO public
WITH CHECK (true);

-- Allow public delete on project_members (demo mode, for member management)
CREATE POLICY "Public delete project_members"
ON public.project_members FOR DELETE
TO public
USING (true);