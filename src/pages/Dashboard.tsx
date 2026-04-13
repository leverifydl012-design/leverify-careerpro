import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Target, TrendingUp, CheckCircle2, Clock, Plus, 
  LogOut, Sparkles, Calendar, Trophy, ChevronRight, Edit2, Trash2
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
  
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [userGoals, setUserGoals] = useState<UserGoal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', description: '', target_date: '', priority: 'medium' as const });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
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
      const { error } = await supabase
        .from('user_skills')
        .update({ status, completed_at: status === 'completed' ? new Date().toISOString() : null })
        .eq('id', existing.id);
      
      if (!error) {
        setUserSkills(prev => prev.map(s => s.id === existing.id ? { ...s, status } : s));
      }
    } else {
      const { data, error } = await supabase
        .from('user_skills')
        .insert({ user_id: user.id, skill_id: skillId, level, status, completed_at: status === 'completed' ? new Date().toISOString() : null })
        .select()
        .single();
      
      if (!error && data) {
        setUserSkills(prev => [...prev, data as UserSkill]);
      }
    }
  };

  const handleAddGoal = async () => {
    if (!user || !newGoal.title) return;
    
    const { data, error } = await supabase
      .from('user_goals')
      .insert({
        user_id: user.id,
        title: newGoal.title,
        description: newGoal.description || null,
        target_date: newGoal.target_date || null,
        priority: newGoal.priority,
        status: 'active'
      })
      .select()
      .single();
    
    if (!error && data) {
      setUserGoals(prev => [data as UserGoal, ...prev]);
      setNewGoal({ title: '', description: '', target_date: '', priority: 'medium' });
      setIsAddingGoal(false);
      toast({ title: 'Goal Added', description: 'Your new goal has been created!' });
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    const { error } = await supabase
      .from('user_goals')
      .update({ status: 'completed' })
      .eq('id', goalId);
    
    if (!error) {
      setUserGoals(prev => prev.map(g => g.id === goalId ? { ...g, status: 'completed' as const } : g));
      toast({ title: 'Goal Completed! 🎉', description: 'Keep up the great work!' });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    const { error } = await supabase
      .from('user_goals')
      .delete()
      .eq('id', goalId);
    
    if (!error) {
      setUserGoals(prev => prev.filter(g => g.id !== goalId));
    }
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
  const completedSkillsCount = userSkills.filter(s => s.status === 'completed').length;
  const inProgressSkillsCount = userSkills.filter(s => s.status === 'in_progress').length;
  const totalSkillsToTrack = skills.length * (profile?.target_level || 2);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl">My Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate('/quiz')}>
              Take Quiz
            </Button>
            <Button variant="ghost" onClick={() => navigate('/compare')}>
              Compare Levels
            </Button>
            <Button variant="outline" onClick={signOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold">{profile?.full_name || 'Career Professional'}</h1>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="glass border-white/10">
                <DialogHeader>
                  <DialogTitle>Edit Your Career Profile</DialogTitle>
                </DialogHeader>
                <ProfileEditor 
                  profile={profile} 
                  onSave={handleUpdateProfile} 
                  onCancel={() => setIsEditingProfile(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-background/50 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <span className="text-muted-foreground text-sm">Current Level</span>
              </div>
              <p className="text-2xl font-display font-bold">{currentLevelData?.name || 'Level 1'}</p>
            </div>
            
            <div className="bg-background/50 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-secondary/20">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                </div>
                <span className="text-muted-foreground text-sm">Target Level</span>
              </div>
              <p className="text-2xl font-display font-bold">{targetLevelData?.name || 'Not Set'}</p>
            </div>
            
            <div className="bg-background/50 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-muted-foreground text-sm">Skills Completed</span>
              </div>
              <p className="text-2xl font-display font-bold">{completedSkillsCount}</p>
            </div>
            
            <div className="bg-background/50 rounded-2xl p-4 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <span className="text-muted-foreground text-sm">In Progress</span>
              </div>
              <p className="text-2xl font-display font-bold">{inProgressSkillsCount}</p>
            </div>
          </div>
        </motion.div>

        {/* Progression Timeline / Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-6 mb-8"
        >
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skills Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass rounded-3xl p-6"
          >
            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Skill Progress for Level {profile?.target_level || 2}
            </h2>
            
            <div className="space-y-4">
              {skills.map(skill => {
                const targetLevel = profile?.target_level || 2;
                const userSkill = userSkills.find(s => s.skill_id === skill.name && s.level === targetLevel);
                const status = userSkill?.status || 'not_started';
                
                return (
                  <div key={skill.name} className="bg-background/50 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{skill.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{skill.description}</p>
                      </div>
                      <Select
                        value={status}
                        onValueChange={(value) => handleUpdateSkillStatus(skill.name, targetLevel, value as any)}
                      >
                        <SelectTrigger className={`w-36 ${
                          status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-background/50'
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

          {/* Goals & Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Goals */}
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-bold flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  My Goals
                </h2>
                <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1">
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass border-white/10">
                    <DialogHeader>
                      <DialogTitle>Add New Goal</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input 
                          value={newGoal.title} 
                          onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Complete Advanced Communication Skills"
                          className="bg-background/50"
                        />
                      </div>
                      <div>
                        <Label>Description (optional)</Label>
                        <Textarea 
                          value={newGoal.description} 
                          onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Details about this goal..."
                          className="bg-background/50"
                        />
                      </div>
                      <div>
                        <Label>Target Date (optional)</Label>
                        <Input 
                          type="date"
                          value={newGoal.target_date} 
                          onChange={(e) => setNewGoal(prev => ({ ...prev, target_date: e.target.value }))}
                          className="bg-background/50"
                        />
                      </div>
                      <div>
                        <Label>Priority</Label>
                        <Select value={newGoal.priority} onValueChange={(v) => setNewGoal(prev => ({ ...prev, priority: v as any }))}>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue />
                          </SelectTrigger>
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
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {userGoals.filter(g => g.status === 'active').map(goal => (
                  <div key={goal.id} className="bg-background/50 rounded-xl p-3 border border-white/5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium">{goal.title}</p>
                        {goal.target_date && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(goal.target_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleCompleteGoal(goal.id)}>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDeleteGoal(goal.id)}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {userGoals.filter(g => g.status === 'active').length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No active goals yet</p>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="glass rounded-3xl p-6">
              <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Achievements
              </h2>
              
              <div className="space-y-3">
                {achievements.slice(0, 5).map(achievement => (
                  <div key={achievement.id} className="bg-background/50 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(achievement.earned_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {achievements.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Complete skills to earn achievements!</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function ProfileEditor({ profile, onSave, onCancel }: { 
  profile: any; 
  onSave: (currentLevel: number, targetLevel: number, careerTrack: string) => void;
  onCancel: () => void;
}) {
  const [currentLevel, setCurrentLevel] = useState(profile?.current_level || 1);
  const [targetLevel, setTargetLevel] = useState(profile?.target_level || 2);
  const [careerTrack, setCareerTrack] = useState(profile?.career_track || 'ic');

  return (
    <div className="space-y-4">
      <div>
        <Label>Current Level</Label>
        <Select value={String(currentLevel)} onValueChange={(v) => setCurrentLevel(Number(v))}>
          <SelectTrigger className="bg-background/50">
            <SelectValue />
          </SelectTrigger>
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
          <SelectTrigger className="bg-background/50">
            <SelectValue />
          </SelectTrigger>
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
          <SelectTrigger className="bg-background/50">
            <SelectValue />
          </SelectTrigger>
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
