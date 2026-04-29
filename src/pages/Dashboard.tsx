import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Target, TrendingUp, CheckCircle2, Clock, Plus, 
  Sparkles, Calendar, Trophy, Edit2, Trash2, Menu,
  Zap, Award, ArrowUpRight, BarChart3, Brain, Flame
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { progressionLevels, skills, careerTracks, getNecessaryRequirements, getTrackLevelSkills, getTrackLevels } from '@/data/careerData';
import ProgressionTimeline from '@/components/ProgressionTimeline';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AICareerCoach } from '@/components/dashboard/AICareerCoach';
import { GrowthInsights } from '@/components/dashboard/GrowthInsights';
import { EnhancedGoalsTab } from '@/components/dashboard/EnhancedGoalsTab';

interface UserSkill {
  id: string;
  skill_id: string;
  level: number;
  status: 'not_started' | 'in_progress' | 'completed';
  notes: string | null;
}

interface UserGoal {
  id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  status: 'active' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
}

interface Achievement {
  id: string;
  achievement_type: string;
  title: string;
  description: string | null;
  earned_at: string;
}

export default function Dashboard() {
  const { user, profile, loading, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [userGoals, setUserGoals] = useState<UserGoal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    const [skillsRes, goalsRes, achievementsRes] = await Promise.all([
      supabase.from('user_skills').select('*').eq('user_id', user.id),
      supabase.from('user_goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('achievements').select('*').eq('user_id', user.id).order('earned_at', { ascending: false })
    ]);
    if (skillsRes.data) setUserSkills(skillsRes.data as UserSkill[]);
    if (goalsRes.data) setUserGoals(goalsRes.data as UserGoal[]);
    if (achievementsRes.data) setAchievements(achievementsRes.data as Achievement[]);
  };

  const handleUpdateProfile = async (
    currentLevel: number,
    targetLevel: number,
    careerTrack: string,
    designation: string | null
  ) => {
    const { error } = await updateProfile({
      current_level: currentLevel,
      target_level: targetLevel,
      career_track: careerTrack,
      designation,
    });
    if (error) {
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Profile updated!' });
      setIsEditingProfile(false);
    }
  };

  const handleUpdateSkillStatus = async (skillId: string, level: number, status: 'not_started' | 'in_progress' | 'completed') => {
    if (!user) return;
    const existing = userSkills.find(s => s.skill_id === skillId && s.level === level);
    if (existing) {
      const { error } = await supabase.from('user_skills')
        .update({ status, completed_at: status === 'completed' ? new Date().toISOString() : null })
        .eq('id', existing.id);
      if (!error) setUserSkills(prev => prev.map(s => s.id === existing.id ? { ...s, status } : s));
    } else {
      const { data, error } = await supabase.from('user_skills')
        .insert({ user_id: user.id, skill_id: skillId, level, status, completed_at: status === 'completed' ? new Date().toISOString() : null })
        .select().single();
      if (!error && data) setUserSkills(prev => [...prev, data as UserSkill]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const currentLevelData = progressionLevels.find(l => l.level === (profile?.current_level || 1));
  const targetLevelData = progressionLevels.find(l => l.level === (profile?.target_level || 2));
  const targetLvl = profile?.target_level || 2;
  const careerTrack = profile?.career_track || 'ic';
  const requiredSkillsForTarget = getTrackLevelSkills(careerTrack, targetLvl);
  const completedSkills = userSkills.filter(s => s.status === 'completed').map(s => s.skill_id);
  const inProgressSkills = userSkills.filter(s => s.status === 'in_progress').map(s => s.skill_id);
  const completedSkillsCount = requiredSkillsForTarget.filter(req =>
    userSkills.some(s => s.skill_id === req.skillName && s.level === targetLvl && s.status === 'completed')
  ).length;
  const inProgressSkillsCount = requiredSkillsForTarget.filter(req =>
    userSkills.some(s => s.skill_id === req.skillName && s.level === targetLvl && s.status === 'in_progress')
  ).length;
  const activeGoalsCount = userGoals.filter(g => g.status === 'active').length;
  const overallProgress = requiredSkillsForTarget.length > 0
    ? Math.round((completedSkillsCount / requiredSkillsForTarget.length) * 100)
    : 0;

  const careerRoleName =
    careerTracks.find(t => t.id === (profile?.career_track || 'ic'))?.name || 'Individual Contributor (Business)';

  const progressionRequirements = requiredSkillsForTarget.map(req => {
    const status =
      userSkills.find(s => s.skill_id === req.skillName && s.level === targetLvl)?.status || 'not_started';
    return {
      skillName: req.skillName,
      requiredLevel: req.requiredLevel,
      status,
      necessaryRequirements: getNecessaryRequirements(req.skillName, req.requiredLevel),
    };
  });

  const coachContext = {
    currentLevel: profile?.current_level || 1,
    targetLevel: profile?.target_level || 2,
    careerTrack: profile?.career_track || 'ic',
    careerRoleName,
    designation: profile?.designation || null,
    completedSkills,
    inProgressSkills,
    activeGoals: userGoals.filter(g => g.status === 'active').map(g => g.title),
    progressionRequirements,
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab 
          profile={profile} user={user} currentLevelData={currentLevelData} targetLevelData={targetLevelData}
          completedSkillsCount={completedSkillsCount} inProgressSkillsCount={inProgressSkillsCount}
          activeGoalsCount={activeGoalsCount} overallProgress={overallProgress}
          isEditingProfile={isEditingProfile} setIsEditingProfile={setIsEditingProfile}
          handleUpdateProfile={handleUpdateProfile}
          userGoals={userGoals} achievements={achievements}
          coachContext={coachContext}
        />;
      case 'skills':
        return <SkillsTab profile={profile} userSkills={userSkills} handleUpdateSkillStatus={handleUpdateSkillStatus} />;
      case 'roadmap':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl p-6">
            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Career Roadmap
            </h2>
            <ProgressionTimeline
              currentLevel={profile?.current_level || 1}
              targetLevel={profile?.target_level || 2}
              userSkills={userSkills}
              totalSkillsPerLevel={skills.length}
              careerTrack={profile?.career_track || 'ic'}
            />
          </motion.div>
        );
      case 'goals':
        return <EnhancedGoalsTab userId={user?.id || ''} coachContext={coachContext} />;
      case 'coach':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl overflow-hidden h-[calc(100vh-120px)]">
            <AICareerCoach context={coachContext} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className={`hidden lg:block`}>
        <div className="fixed left-0 top-0 h-screen z-40">
          <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-display font-bold text-lg capitalize">
                {activeTab === 'coach' ? 'AI Career Coach' : activeTab === 'goals' ? 'Personal Development' : activeTab.replace('-', ' ')}
              </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {activeTab === 'overview' ? 'Your career at a glance' : 
                   activeTab === 'skills' ? 'Track and update your skill progress' :
                   activeTab === 'goals' ? 'Manage your personal development' :
                   'Manage your career growth'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Flame className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">Level {profile?.current_level || 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:block">{profile?.full_name || 'User'}</span>
              </div>
            </div>
          </div>
          {/* Mobile Tab Bar */}
          <div className="lg:hidden overflow-x-auto flex gap-1 px-4 pb-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'skills', label: 'My Skills' },
              { id: 'roadmap', label: 'Career Roadmap' },
              { id: 'goals', label: 'Personal Development' },
              { id: 'coach', label: '🤖 AI Coach' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

/* ========== OVERVIEW TAB ========== */
function OverviewTab({ profile, user, currentLevelData, targetLevelData, completedSkillsCount, inProgressSkillsCount, activeGoalsCount, overallProgress, isEditingProfile, setIsEditingProfile, handleUpdateProfile, userGoals, achievements, coachContext }: any) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/15 via-secondary/10 to-accent/10 border border-primary/20 p-6"
      >
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-lg">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Welcome back, {profile?.full_name?.split(' ')[0] || 'Professional'}!</h2>
              <p className="text-muted-foreground text-sm mt-1">{user?.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-primary/20 text-primary font-medium">
                  {currentLevelData?.name || 'Level 1'}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs px-2.5 py-1 rounded-full bg-secondary/20 text-secondary font-medium">
                  {targetLevelData?.name || 'Level 2'}
                </span>
              </div>
            </div>
          </div>
          <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 shrink-0">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-border">
              <DialogHeader><DialogTitle>Edit Your Career Profile</DialogTitle></DialogHeader>
              <ProfileEditor profile={profile} onSave={handleUpdateProfile} onCancel={() => setIsEditingProfile(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: TrendingUp, label: 'Overall Progress', value: `${overallProgress}%`, color: 'text-primary', bg: 'bg-primary/10' },
          { icon: CheckCircle2, label: 'Skills Completed', value: completedSkillsCount, color: 'text-accent', bg: 'bg-accent/10' },
          { icon: Clock, label: 'In Progress', value: inProgressSkillsCount, color: 'text-secondary', bg: 'bg-secondary/10' },
          { icon: Target, label: 'Active Goals', value: activeGoalsCount, color: 'text-primary', bg: 'bg-primary/10' },
          { icon: Trophy, label: 'Achievements', value: achievements.length, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        ].map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }}
            className="glass rounded-2xl p-4 hover:border-primary/30 transition-colors"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-display font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Level Progress</span>
          </div>
          <span className="text-sm text-primary font-bold">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-3 bg-muted" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{currentLevelData?.name}</span>
          <span>{targetLevelData?.name}</span>
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Goals */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Active Goals
            </h3>
            <span className="text-xs text-muted-foreground">{userGoals.filter((g: any) => g.status === 'active').length} active</span>
          </div>
          <div className="space-y-2">
            {userGoals.filter((g: any) => g.status === 'active').slice(0, 5).map((goal: any) => (
              <div key={goal.id} className="flex items-center gap-3 bg-background/40 rounded-xl p-3 border border-border hover:border-primary/30 transition-colors">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${goal.priority === 'high' ? 'bg-destructive' : goal.priority === 'medium' ? 'bg-primary' : 'bg-accent'}`} />
                <span className="text-sm flex-1 truncate">{goal.title}</span>
                {goal.target_date && <span className="text-[10px] text-muted-foreground">{new Date(goal.target_date).toLocaleDateString()}</span>}
              </div>
            ))}
            {userGoals.filter((g: any) => g.status === 'active').length === 0 && (
              <p className="text-center text-muted-foreground py-8 text-sm">No active goals yet.</p>
            )}
          </div>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" /> Recent Achievements
            </h3>
            <span className="text-xs text-muted-foreground">{achievements.length} total</span>
          </div>
          <div className="space-y-2">
            {achievements.slice(0, 5).map((a: any) => (
              <div key={a.id} className="flex items-center gap-3 bg-background/40 rounded-xl p-3 border border-border hover:border-yellow-400/30 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-yellow-400/15 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{a.title}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(a.earned_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {achievements.length === 0 && (
              <p className="text-center text-muted-foreground py-8 text-sm">Complete skills to earn achievements!</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h3 className="font-display font-bold text-sm mb-3 text-muted-foreground">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Compare Levels', icon: BarChart3, action: () => navigate('/compare'), color: 'text-primary' },
            { label: 'Ask AI Coach', icon: Sparkles, action: () => {}, color: 'text-accent' },
            { label: 'View Roadmap', icon: TrendingUp, action: () => {}, color: 'text-primary' },
          ].map((item, idx) => (
            <button key={idx} onClick={item.action}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background/40 border border-border hover:border-primary/30 transition-all text-left group"
            >
              <item.icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Growth Snapshot */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-3xl p-6">
        <h3 className="font-display font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> Growth Snapshot
        </h3>
        <GrowthInsights {...coachContext} />
      </motion.div>
    </div>
  );
}

/* ========== SKILLS TAB ========== */
function SkillsTab({ profile, userSkills, handleUpdateSkillStatus }: any) {
  const targetLevel = profile?.target_level || 2;
  const careerTrack = profile?.career_track || 'ic';
  const requiredSkills = getTrackLevelSkills(careerTrack, targetLevel);
  const completedCount = requiredSkills.filter((req: any) =>
    userSkills.some((s: any) => s.skill_id === req.skillName && s.level === targetLevel && s.status === 'completed')
  ).length;
  const inProgressCount = requiredSkills.filter((req: any) =>
    userSkills.some((s: any) => s.skill_id === req.skillName && s.level === targetLevel && s.status === 'in_progress')
  ).length;
  const progress = requiredSkills.length > 0 ? Math.round((completedCount / requiredSkills.length) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4 text-center">
          <p className="text-2xl font-display font-bold text-accent">{completedCount}</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <p className="text-2xl font-display font-bold text-primary">{inProgressCount}</p>
          <p className="text-xs text-muted-foreground">In Progress</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <p className="text-2xl font-display font-bold">{requiredSkills.length - completedCount - inProgressCount}</p>
          <p className="text-xs text-muted-foreground">Not Started</p>
        </div>
      </div>

      {/* Progress */}
      <div className="glass rounded-2xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Level {targetLevel} Required Skills</span>
          <span className="text-sm text-primary font-bold">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2.5 bg-muted" />
        <p className="text-xs text-muted-foreground mt-1">{completedCount} of {requiredSkills.length} required skills completed</p>
      </div>

      {/* Skills list */}
      <div className="glass rounded-3xl p-6">
        <h2 className="text-xl font-display font-bold mb-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Required Skills for Level {targetLevel}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Complete these {requiredSkills.length} skills to progress to Level {targetLevel}
        </p>
        <div className="space-y-3">
          {requiredSkills.map((req: any) => {
            const skill = skills.find(s => s.name === req.skillName);
            if (!skill) return null;
            const userSkill = userSkills.find((s: any) => s.skill_id === skill.name && s.level === targetLevel);
            const status = userSkill?.status || 'not_started';
            return (
              <div key={skill.name} className={`rounded-xl p-4 border transition-colors ${
                status === 'completed' ? 'bg-accent/5 border-accent/30' :
                status === 'in_progress' ? 'bg-primary/5 border-primary/30' :
                'bg-background/40 border-border'
              }`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{skill.name}</h3>
                      {status === 'completed' && <CheckCircle2 className="w-4 h-4 text-accent" />}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                        {req.requiredLevel}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{skill.description}</p>
                  </div>
                  <Select value={status} onValueChange={(value) => handleUpdateSkillStatus(skill.name, targetLevel, value)}>
                    <SelectTrigger className={`w-36 shrink-0 ${
                      status === 'completed' ? 'bg-accent/20 text-accent border-accent/30' :
                      status === 'in_progress' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-background/50'
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_started">Not Started</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/* ========== ACHIEVEMENTS TAB ========== */
function AchievementsTab({ achievements }: { achievements: Achievement[] }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="glass rounded-2xl p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-yellow-400/15 flex items-center justify-center">
          <Trophy className="w-7 h-7 text-yellow-400" />
        </div>
        <div>
          <p className="text-3xl font-display font-bold">{achievements.length}</p>
          <p className="text-sm text-muted-foreground">Total Achievements Earned</p>
        </div>
      </div>

      <div className="glass rounded-3xl p-6">
        <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" /> All Achievements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map(a => (
            <div key={a.id} className="bg-background/40 rounded-xl p-4 border border-border hover:border-yellow-400/30 transition-colors flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/15 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold">{a.title}</p>
                {a.description && <p className="text-sm text-muted-foreground line-clamp-1">{a.description}</p>}
                <p className="text-xs text-muted-foreground mt-1">{new Date(a.earned_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
          {achievements.length === 0 && (
            <p className="text-center text-muted-foreground py-8 col-span-2">Complete skills to earn achievements!</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ========== ANALYTICS TAB ========== */
function AnalyticsTab({ coachContext, userSkills, userGoals, achievements }: any) {
  const completedGoals = userGoals.filter((g: any) => g.status === 'completed').length;
  const totalGoals = userGoals.length;
  const goalCompletionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  const targetLvl = coachContext.targetLevel || 2;
  const requiredForTarget = getTrackLevelSkills(coachContext.careerTrack || 'ic', targetLvl);
  const completedSkillsForLevel = requiredForTarget.filter((req: any) =>
    userSkills.some((s: any) => s.skill_id === req.skillName && s.level === targetLvl && s.status === 'completed')
  ).length;
  const skillProgress = requiredForTarget.length > 0 ? Math.round((completedSkillsForLevel / requiredForTarget.length) * 100) : 0;

  const metrics = [
    { label: 'Skill Completion', value: skillProgress, max: 100, unit: '%', color: 'bg-primary' },
    { label: 'Goal Completion', value: goalCompletionRate, max: 100, unit: '%', color: 'bg-accent' },
    { label: 'Achievements', value: achievements.length, max: 20, unit: '', color: 'bg-yellow-400' },
    { label: 'Active Focus Areas', value: coachContext.inProgressSkills.length, max: requiredForTarget.length || skills.length, unit: `/${requiredForTarget.length || skills.length}`, color: 'bg-secondary' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
            className="glass rounded-2xl p-5"
          >
            <p className="text-xs text-muted-foreground mb-2">{m.label}</p>
            <p className="text-3xl font-display font-bold">{m.value}{m.unit}</p>
            <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full ${m.color} transition-all duration-700`} style={{ width: `${Math.min((m.value / m.max) * 100, 100)}%` }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Skill breakdown */}
      <div className="glass rounded-3xl p-6">
        <h3 className="font-display font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Skill Breakdown
        </h3>
        <div className="space-y-4">
          {skills.map(skill => {
            const userSkill = userSkills.find((s: any) => s.skill_id === skill.name);
            const status = userSkill?.status || 'not_started';
            const pct = status === 'completed' ? 100 : status === 'in_progress' ? 50 : 0;
            return (
              <div key={skill.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className={`text-xs font-medium ${
                    status === 'completed' ? 'text-accent' : status === 'in_progress' ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {status === 'completed' ? 'Mastered' : status === 'in_progress' ? 'Learning' : 'Not Started'}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className={`h-full rounded-full ${
                      status === 'completed' ? 'bg-accent' : status === 'in_progress' ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="glass rounded-3xl p-6">
        <h3 className="font-display font-bold mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background/40 rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Career Track</p>
            <p className="font-display font-bold">
              {coachContext.careerTrack === 'ic' ? 'Individual Contributor' : 
               coachContext.careerTrack === 'dept-lead' ? 'Department Lead' :
               coachContext.careerTrack === 'manager' ? 'Manager' : 'Group Manager'}
            </p>
          </div>
          <div className="bg-background/40 rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Level Gap</p>
            <p className="font-display font-bold">{coachContext.targetLevel - coachContext.currentLevel} level{coachContext.targetLevel - coachContext.currentLevel > 1 ? 's' : ''} to target</p>
          </div>
          <div className="bg-background/40 rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground mb-1">Est. Timeline</p>
            <p className="font-display font-bold">{(coachContext.targetLevel - coachContext.currentLevel) * 6} months</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ========== PROFILE EDITOR ========== */
function ProfileEditor({
  profile,
  onSave,
  onCancel,
}: {
  profile: any;
  onSave: (c: number, t: number, tr: string, designation: string | null) => void;
  onCancel: () => void;
}) {
  const [careerTrack, setCareerTrack] = useState(profile?.career_track || 'ic');
  const validLevels = getTrackLevels(careerTrack);
  const [designation, setDesignation] = useState<string>(profile?.designation || '');
  const [currentLevel, setCurrentLevel] = useState(
    validLevels.includes(profile?.current_level) ? profile.current_level : validLevels[0]
  );
  const [targetLevel, setTargetLevel] = useState(
    validLevels.includes(profile?.target_level) && profile.target_level > currentLevel
      ? profile.target_level
      : Math.min(currentLevel + 1, validLevels[validLevels.length - 1])
  );

  const handleTrackChange = (newTrack: string) => {
    setCareerTrack(newTrack);
    const levels = getTrackLevels(newTrack);
    const newCurrent = levels[0];
    setCurrentLevel(newCurrent);
    setTargetLevel(levels[1] ?? levels[0]);
  };

  const handleCurrentChange = (v: string) => {
    const newCurrent = Number(v);
    setCurrentLevel(newCurrent);
    if (targetLevel <= newCurrent) {
      const levels = getTrackLevels(careerTrack);
      const next = levels.find(l => l > newCurrent);
      if (next) setTargetLevel(next);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Designation</Label>
        <Input
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          placeholder="e.g., Senior Analyst, Product Manager, Team Lead"
          className="bg-background/50"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Used by the AI Coach to tailor language and examples to your job title.
        </p>
      </div>
      <div>
        <Label>Career Track</Label>
        <Select value={careerTrack} onValueChange={handleTrackChange}>
          <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
          <SelectContent>
            {careerTracks.map(track => (
              <SelectItem key={track.id} value={track.id}>{track.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Current Level</Label>
        <Select value={String(currentLevel)} onValueChange={handleCurrentChange}>
          <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
          <SelectContent>
            {progressionLevels.filter(l => validLevels.includes(l.level)).map(level => (
              <SelectItem key={level.level} value={String(level.level)}>{level.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Target Level</Label>
        <Select value={String(targetLevel)} onValueChange={(v) => setTargetLevel(Number(v))}>
          <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
          <SelectContent>
            {progressionLevels.filter(l => validLevels.includes(l.level) && l.level > currentLevel).map(level => (
              <SelectItem key={level.level} value={String(level.level)}>{level.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button
          onClick={() =>
            onSave(
              currentLevel,
              targetLevel,
              careerTrack,
              designation.trim() ? designation.trim() : null
            )
          }
          className="flex-1"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
