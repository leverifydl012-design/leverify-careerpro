-- Add designation/job title to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS designation text;

