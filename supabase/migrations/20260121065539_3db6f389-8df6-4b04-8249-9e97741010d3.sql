-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  current_level INTEGER DEFAULT 1 CHECK (current_level >= 1 AND current_level <= 5),
  target_level INTEGER CHECK (target_level >= 1 AND target_level <= 5),
  career_track TEXT DEFAULT 'ic',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_skills table for tracking completed/in-progress skills
CREATE TABLE public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  skill_id TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 5),
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, skill_id, level)
);

-- Create user_goals table for career goals with deadlines
CREATE TABLE public.user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assessment_results table for quiz results
CREATE TABLE public.assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recommended_level INTEGER NOT NULL CHECK (recommended_level >= 1 AND recommended_level <= 5),
  skill_scores JSONB NOT NULL DEFAULT '{}',
  suggestions JSONB NOT NULL DEFAULT '[]',
  taken_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_skills
CREATE POLICY "Users can view their own skills" ON public.user_skills
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skills" ON public.user_skills
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skills" ON public.user_skills
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skills" ON public.user_skills
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_goals
CREATE POLICY "Users can view their own goals" ON public.user_goals
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals" ON public.user_goals
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON public.user_goals
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" ON public.user_goals
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for assessment_results
CREATE POLICY "Users can view their own assessments" ON public.assessment_results
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments" ON public.assessment_results
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for achievements
CREATE POLICY "Users can view their own achievements" ON public.achievements
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON public.achievements
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_skills_updated_at
BEFORE UPDATE ON public.user_skills
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at
BEFORE UPDATE ON public.user_goals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();