import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Target, TrendingUp, CheckCircle2, Clock, Plus, 
  Sparkles, Calendar, Trophy, Edit2, Trash2, Menu
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { progressionLevels, skills, careerTracks } from '@/data/careerData';
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
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', target_date: '', priority: 'medium' as const });

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

  const handleUpdateProfile = async (currentLevel: number, targetLevel: number, careerTrack: string) => {
    const { error } = await updateProfile({ current_level: currentLevel, target_level: targetLevel, career_track: careerTrack });
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

  const handleAddGoal = async () => {
    if (!user || !newGoal.title) return;
    const { data, error } = await supabase.from('user_goals')
      .insert({ user_id: user.id, title: newGoal.title, description: newGoal.description || null, target_date: newGoal.target_date || null, priority: newGoal.priority, status: 'active' })
      .select().single();
    if (!error && data) {
      setUserGoals(prev => [data as UserGoal, ...prev]);
      setNewGoal({ title: '', description: '', target_date: '', priority: 'medium' });
      setIsAddingGoal(false);
      toast({ title: 'Goal Added', description: 'Your new goal has been created!' });
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    const { error } = await supabase.from('user_goals').update({ status: 'completed' }).eq('id', goalId);
    if (!error) {
      setUserGoals(prev => prev.map(g => g.id === goalId ? { ...g, status: 'completed' as const } : g));
      toast({ title: 'Goal Completed! 🎉', description: 'Keep up the great work!' });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    const { error } = await supabase.from('user_goals').delete().eq('id', goalId);
    if (!error) setUserGoals(prev => prev.filter(g => g.id !== goalId));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentLevelData = progressionLevels.find(l => l.level === (profile?.current_level || 1));
  const targetLevelData = progressionLevels.find(l => l.level === (profile?.target_level || 2));
  const completedSkills = userSkills.filter(s => s.status === 'completed').map(s => s.skill_id);
  const inProgressSkills = userSkills.filter(s => s.status === 'in_progress').map(s => s.skill_id);
  const completedSkillsCount = completedSkills.length;
  const inProgressSkillsCount = inProgressSkills.length;

  const coachContext = {
    currentLevel: profile?.current_level || 1,
    targetLevel: profile?.target_level || 2,
    careerTrack: profile?.career_track || 'ic',
    completedSkills,
    inProgressSkills,
    activeGoals: userGoals.filter(g => g.status === 'active').map(g => g.title),
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab 
          profile={profile} user={user} currentLevelData={currentLevelData} targetLevelData={targetLevelData}
          completedSkillsCount={completedSkillsCount} inProgressSkillsCount={inProgressSkillsCount}
          isEditingProfile={isEditingProfile} setIsEditingProfile={setIsEditingProfile}
          handleUpdateProfile={handleUpdateProfile}
          userGoals={userGoals} achievements={achievements}
          coachContext={coachContext}
        />;
      case 'skills':
        return <SkillsTab 
          profile={profile} userSkills={userSkills} 
          handleUpdateSkillStatus={handleUpdateSkillStatus}
        />;
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
            />
          </motion.div>
        );
      case 'goals':
        return <EnhancedGoalsTab userId={user?.id || ''} coachContext={coachContext} />;
      case 'achievements':
        return <AchievementsTab achievements={achievements} />;
      case 'coach':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl overflow-hidden h-[calc(100vh-120px)]">
            <AICareerCoach context={coachContext} />
          </motion.div>
        );
      case 'growth':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl p-6">
            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Growth Insights & Action Plan
            </h2>
            <GrowthInsights {...coachContext} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - hidden on mobile */}
      <div className={`hidden lg:block ${sidebarOpen ? '' : 'lg:hidden'}`}>
        <div className="fixed left-0 top-0 h-screen z-40">
          <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="font-display font-bold text-lg capitalize">{activeTab.replace('-', ' ')}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:block">{profile?.full_name || 'User'}</span>
              </div>
            </div>
          </div>
          {/* Mobile Tab Bar */}
          <div className="lg:hidden overflow-x-auto flex gap-1 px-4 pb-2">
            {['overview','skills','roadmap','goals','coach','growth'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {tab === 'coach' ? '🤖 AI Coach' : tab.charAt(0).toUpperCase() + tab.slice(1)}
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

/* ========== SUB-COMPONENTS ========== */

function OverviewTab({ profile, user, currentLevelData, targetLevelData, completedSkillsCount, inProgressSkillsCount, isEditingProfile, setIsEditingProfile, handleUpdateProfile, userGoals, achievements, coachContext }: any) {
  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-primary-foreground">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">{profile?.full_name || 'Career Professional'}</h2>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
            </div>
          </div>
          <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-border">
              <DialogHeader><DialogTitle>Edit Your Career Profile</DialogTitle></DialogHeader>
              <ProfileEditor profile={profile} onSave={handleUpdateProfile} onCancel={() => setIsEditingProfile(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Target, label: 'Current Level', value: currentLevelData?.name || 'Level 1', color: 'primary' },
            { icon: TrendingUp, label: 'Target Level', value: targetLevelData?.name || 'Not Set', color: 'secondary' },
            { icon: CheckCircle2, label: 'Completed', value: completedSkillsCount, color: 'accent' },
            { icon: Clock, label: 'In Progress', value: inProgressSkillsCount, color: 'primary' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-background/50 rounded-2xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 text-${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-xl font-display font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Two Column: Recent Goals + Quick AI Suggestion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-3xl p-6">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Active Goals
          </h3>
          <div className="space-y-2">
            {userGoals.filter((g: any) => g.status === 'active').slice(0, 4).map((goal: any) => (
              <div key={goal.id} className="flex items-center gap-3 bg-background/50 rounded-xl p-3 border border-border">
                <div className={`w-2 h-2 rounded-full ${goal.priority === 'high' ? 'bg-destructive' : goal.priority === 'medium' ? 'bg-primary' : 'bg-accent'}`} />
                <span className="text-sm flex-1">{goal.title}</span>
              </div>
            ))}
            {userGoals.filter((g: any) => g.status === 'active').length === 0 && (
              <p className="text-center text-muted-foreground py-6 text-sm">No active goals yet. Set one to get started!</p>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-3xl p-6">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Recent Achievements
          </h3>
          <div className="space-y-2">
            {achievements.slice(0, 4).map((a: any) => (
              <div key={a.id} className="flex items-center gap-3 bg-background/50 rounded-xl p-3 border border-border">
                <Trophy className="w-4 h-4 text-yellow-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(a.earned_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {achievements.length === 0 && (
              <p className="text-center text-muted-foreground py-6 text-sm">Complete skills to earn achievements!</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Growth Insights Preview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-3xl p-6">
        <h3 className="font-display font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> Growth Snapshot
        </h3>
        <GrowthInsights {...coachContext} />
      </motion.div>
    </div>
  );
}

function SkillsTab({ profile, userSkills, handleUpdateSkillStatus }: any) {
  const targetLevel = profile?.target_level || 2;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl p-6">
      <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        Skill Progress for Level {targetLevel}
      </h2>
      <div className="space-y-3">
        {skills.map(skill => {
          const userSkill = userSkills.find((s: any) => s.skill_id === skill.name && s.level === targetLevel);
          const status = userSkill?.status || 'not_started';
          return (
            <div key={skill.name} className="bg-background/50 rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold">{skill.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{skill.description}</p>
                </div>
                <Select value={status} onValueChange={(value) => handleUpdateSkillStatus(skill.name, targetLevel, value)}>
                  <SelectTrigger className={`w-36 shrink-0 ${
                    status === 'completed' ? 'bg-accent/20 text-accent' :
                    status === 'in_progress' ? 'bg-primary/20 text-primary' : 'bg-background/50'
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
    </motion.div>
  );
}

function GoalsTab({ userGoals, isAddingGoal, setIsAddingGoal, newGoal, setNewGoal, handleAddGoal, handleCompleteGoal, handleDeleteGoal }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> My Goals
          </h2>
          <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1"><Plus className="w-4 h-4" /> Add Goal</Button>
            </DialogTrigger>
            <DialogContent className="glass border-border">
              <DialogHeader><DialogTitle>Add New Goal</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={newGoal.title} onChange={(e) => setNewGoal((prev: any) => ({ ...prev, title: e.target.value }))} placeholder="Complete Advanced Communication Skills" className="bg-background/50" />
                </div>
                <div>
                  <Label>Description (optional)</Label>
                  <Textarea value={newGoal.description} onChange={(e) => setNewGoal((prev: any) => ({ ...prev, description: e.target.value }))} placeholder="Details about this goal..." className="bg-background/50" />
                </div>
                <div>
                  <Label>Target Date (optional)</Label>
                  <Input type="date" value={newGoal.target_date} onChange={(e) => setNewGoal((prev: any) => ({ ...prev, target_date: e.target.value }))} className="bg-background/50" />
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={newGoal.priority} onValueChange={(v) => setNewGoal((prev: any) => ({ ...prev, priority: v }))}>
                    <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddGoal} className="w-full">Create Goal</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Goals */}
        <div className="space-y-3">
          {userGoals.filter((g: any) => g.status === 'active').map((goal: any) => (
            <div key={goal.id} className="bg-background/50 rounded-xl p-4 border border-border">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${goal.priority === 'high' ? 'bg-destructive' : goal.priority === 'medium' ? 'bg-primary' : 'bg-accent'}`} />
                    <p className="font-semibold truncate">{goal.title}</p>
                  </div>
                  {goal.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{goal.description}</p>}
                  {goal.target_date && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                      <Calendar className="w-3 h-3" /> {new Date(goal.target_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleCompleteGoal(goal.id)}>
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDeleteGoal(goal.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {userGoals.filter((g: any) => g.status === 'active').length === 0 && (
            <p className="text-center text-muted-foreground py-8">No active goals yet. Click "Add Goal" to get started!</p>
          )}
        </div>
      </div>

      {/* Completed Goals */}
      {userGoals.filter((g: any) => g.status === 'completed').length > 0 && (
        <div className="glass rounded-3xl p-6">
          <h3 className="font-display font-bold mb-4 text-muted-foreground">Completed Goals</h3>
          <div className="space-y-2">
            {userGoals.filter((g: any) => g.status === 'completed').map((goal: any) => (
              <div key={goal.id} className="flex items-center gap-3 bg-background/50 rounded-xl p-3 border border-border opacity-70">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span className="text-sm line-through">{goal.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function AchievementsTab({ achievements }: { achievements: Achievement[] }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl p-6">
      <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" /> Achievements
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map(a => (
          <div key={a.id} className="bg-background/50 rounded-xl p-4 border border-border flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6 text-yellow-500" />
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
    </motion.div>
  );
}

function ProfileEditor({ profile, onSave, onCancel }: { profile: any; onSave: (c: number, t: number, tr: string) => void; onCancel: () => void }) {
  const [currentLevel, setCurrentLevel] = useState(profile?.current_level || 1);
  const [targetLevel, setTargetLevel] = useState(profile?.target_level || 2);
  const [careerTrack, setCareerTrack] = useState(profile?.career_track || 'ic');

  return (
    <div className="space-y-4">
      <div>
        <Label>Current Level</Label>
        <Select value={String(currentLevel)} onValueChange={(v) => setCurrentLevel(Number(v))}>
          <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
          <SelectContent>
            {progressionLevels.map(level => (
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
            {progressionLevels.filter(l => l.level > currentLevel).map(level => (
              <SelectItem key={level.level} value={String(level.level)}>{level.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Career Track</Label>
        <Select value={careerTrack} onValueChange={setCareerTrack}>
          <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
          <SelectContent>
            {careerTracks.map(track => (
              <SelectItem key={track.id} value={track.id}>{track.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button onClick={() => onSave(currentLevel, targetLevel, careerTrack)} className="flex-1">Save</Button>
      </div>
    </div>
  );
}
