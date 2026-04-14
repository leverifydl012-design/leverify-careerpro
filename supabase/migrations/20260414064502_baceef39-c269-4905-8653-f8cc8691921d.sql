
-- Add category and progress to user_goals
ALTER TABLE public.user_goals ADD COLUMN category text DEFAULT 'general';
ALTER TABLE public.user_goals ADD COLUMN progress integer DEFAULT 0;

-- Create goal_notes table
CREATE TABLE public.goal_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES public.user_goals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  note_type text NOT NULL DEFAULT 'update',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.goal_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own goal notes"
ON public.goal_notes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goal notes"
ON public.goal_notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goal notes"
ON public.goal_notes FOR DELETE
USING (auth.uid() = user_id);

CREATE INDEX idx_goal_notes_goal_id ON public.goal_notes(goal_id);
