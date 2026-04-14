import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Plus, CheckCircle2, Trash2, Calendar, Edit2, MessageSquare,
  Sparkles, ChevronDown, ChevronUp, Clock, AlertTriangle, BookOpen,
  Lightbulb, TrendingUp, Filter, BarChart3, Flag, StickyNote, Send,
  Zap, Award, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

interface UserGoal {
  id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  status: string;
  priority: string | null;
  category: string | null;
  progress: number | null;
}

interface GoalNote {
  id: string;
  goal_id: string;
  content: string;
  note_type: string;
  created_at: string;
}

interface EnhancedGoalsTabProps {
  userId: string;
  coachContext: any;
}

const CATEGORIES = [
  { value: 'general', label: 'General', icon: Target, color: 'text-primary' },
  { value: 'skill', label: 'Skill Building', icon: Zap, color: 'text-blue-500' },
  { value: 'project', label: 'Project', icon: BarChart3, color: 'text-purple-500' },
  { value: 'learning', label: 'Learning', icon: BookOpen, color: 'text-green-500' },
  { value: 'networking', label: 'Networking', icon: MessageSquare, color: 'text-orange-500' },
  { value: 'leadership', label: 'Leadership', icon: Award, color: 'text-yellow-500' },
];

const NOTE_TYPES = [
  { value: 'update', label: 'Progress Update', icon: TrendingUp },
  { value: 'milestone', label: 'Milestone Reached', icon: Flag },
  { value: 'blocker', label: 'Blocker / Challenge', icon: AlertTriangle },
  { value: 'reflection', label: 'Reflection', icon: Lightbulb },
];

export function EnhancedGoalsTab({ userId, coachContext }: EnhancedGoalsTabProps) {
  const { toast } = useToast();
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [goalNotes, setGoalNotes] = useState<Record<string, GoalNote[]>>({});
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<UserGoal | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('active');
  const [newNote, setNewNote] = useState({ content: '', type: 'update' });
  const [addingNoteFor, setAddingNoteFor] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '', description: '', target_date: '', priority: 'medium', category: 'general'
  });

  useEffect(() => { fetchGoals(); }, [userId]);

  const fetchGoals = async () => {
    const { data } = await supabase.from('user_goals').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (data) setGoals(data as UserGoal[]);
  };

  const fetchNotesForGoal = async (goalId: string) => {
    const { data } = await supabase.from('goal_notes').select('*').eq('goal_id', goalId).order('created_at', { ascending: false });
    if (data) setGoalNotes(prev => ({ ...prev, [goalId]: data as GoalNote[] }));
  };

  const handleAddGoal = async () => {
    if (!newGoal.title) return;
    const { data, error } = await supabase.from('user_goals')
      .insert({ user_id: userId, title: newGoal.title, description: newGoal.description || null, target_date: newGoal.target_date || null, priority: newGoal.priority, category: newGoal.category, status: 'active', progress: 0 })
      .select().single();
    if (!error && data) {
      setGoals(prev => [data as UserGoal, ...prev]);
      setNewGoal({ title: '', description: '', target_date: '', priority: 'medium', category: 'general' });
      setIsAddingGoal(false);
      toast({ title: '🎯 Goal Created!', description: 'Stay focused and track your progress.' });
    }
  };

  const handleUpdateGoal = async (goal: UserGoal) => {
    const { error } = await supabase.from('user_goals').update({
      title: goal.title, description: goal.description, target_date: goal.target_date,
      priority: goal.priority, category: goal.category, progress: goal.progress, status: goal.status
    }).eq('id', goal.id);
    if (!error) {
      setGoals(prev => prev.map(g => g.id === goal.id ? goal : g));
      setEditingGoal(null);
      toast({ title: 'Goal Updated' });
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    const { error } = await supabase.from('user_goals').update({ status: 'completed', progress: 100 }).eq('id', goalId);
    if (!error) {
      setGoals(prev => prev.map(g => g.id === goalId ? { ...g, status: 'completed', progress: 100 } : g));
      toast({ title: '🎉 Goal Completed!', description: 'Amazing work! Keep pushing forward.' });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    const { error } = await supabase.from('user_goals').delete().eq('id', goalId);
    if (!error) setGoals(prev => prev.filter(g => g.id !== goalId));
  };

  const handleAddNote = async (goalId: string) => {
    if (!newNote.content.trim()) return;
    const { data, error } = await supabase.from('goal_notes')
      .insert({ goal_id: goalId, user_id: userId, content: newNote.content, note_type: newNote.type })
      .select().single();
    if (!error && data) {
      setGoalNotes(prev => ({ ...prev, [goalId]: [data as GoalNote, ...(prev[goalId] || [])] }));
      setNewNote({ content: '', type: 'update' });
      setAddingNoteFor(null);
      toast({ title: 'Note Added' });
    }
  };

  const handleDeleteNote = async (noteId: string, goalId: string) => {
    const { error } = await supabase.from('goal_notes').delete().eq('id', noteId);
    if (!error) setGoalNotes(prev => ({ ...prev, [goalId]: (prev[goalId] || []).filter(n => n.id !== noteId) }));
  };

  const toggleGoalExpand = (goalId: string) => {
    if (expandedGoal === goalId) {
      setExpandedGoal(null);
    } else {
      setExpandedGoal(goalId);
      if (!goalNotes[goalId]) fetchNotesForGoal(goalId);
    }
  };

  const handleUpdateProgress = async (goalId: string, progress: number) => {
    const { error } = await supabase.from('user_goals').update({ progress }).eq('id', goalId);
    if (!error) setGoals(prev => prev.map(g => g.id === goalId ? { ...g, progress } : g));
  };

  const getAISuggestion = async () => {
    setAiLoading(true);
    setAiSuggestion('');
    try {
      const activeGoals = goals.filter(g => g.status === 'active').map(g => g.title);
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/career-coach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Based on my profile, suggest 3 SMART goals I should set right now. My current goals are: ${activeGoals.join(', ') || 'none yet'}. Give each goal a title, why it matters, and a realistic timeline. Be specific and actionable.`
          }],
          context: coachContext
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) { toast({ title: 'Rate Limited', description: 'Please try again in a moment.', variant: 'destructive' }); return; }
        if (resp.status === 402) { toast({ title: 'Credits Needed', description: 'Please add funds to continue using AI features.', variant: 'destructive' }); return; }
        throw new Error('AI error');
      }

      const reader = resp.body?.getReader();
      const decoder = new TextDecoder();
      let result = '';
      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ') || line.includes('[DONE]')) continue;
          try {
            const parsed = JSON.parse(line.slice(6));
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) { result += content; setAiSuggestion(result); }
          } catch {}
        }
      }
    } catch {
      toast({ title: 'Error', description: 'Could not get AI suggestions.', variant: 'destructive' });
    } finally {
      setAiLoading(false);
    }
  };

  const filteredGoals = goals.filter(g => {
    if (filterStatus !== 'all' && g.status !== filterStatus) return false;
    if (filterCategory !== 'all' && g.category !== filterCategory) return false;
    return true;
  });

  const activeCount = goals.filter(g => g.status === 'active').length;
  const completedCount = goals.filter(g => g.status === 'completed').length;
  const avgProgress = goals.filter(g => g.status === 'active').length > 0
    ? Math.round(goals.filter(g => g.status === 'active').reduce((sum, g) => sum + (g.progress || 0), 0) / goals.filter(g => g.status === 'active').length)
    : 0;

  const getDaysRemaining = (date: string | null) => {
    if (!date) return null;
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getCategoryInfo = (cat: string | null) => CATEGORIES.find(c => c.value === (cat || 'general')) || CATEGORIES[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Goals', value: activeCount, icon: Target, color: 'text-primary' },
          { label: 'Completed', value: completedCount, icon: CheckCircle2, color: 'text-accent' },
          { label: 'Avg Progress', value: `${avgProgress}%`, icon: TrendingUp, color: 'text-blue-500' },
          { label: 'Total Notes', value: Object.values(goalNotes).flat().length, icon: StickyNote, color: 'text-orange-500' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-display font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> New Goal</Button>
          </DialogTrigger>
          <DialogContent className="glass border-border max-w-lg">
            <DialogHeader><DialogTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-primary" /> Create New Goal</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Goal Title *</Label><Input value={newGoal.title} onChange={e => setNewGoal(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Lead a cross-team project" className="bg-background/50" /></div>
              <div><Label>Description</Label><Textarea value={newGoal.description} onChange={e => setNewGoal(p => ({ ...p, description: e.target.value }))} placeholder="What does success look like? How will you measure it?" className="bg-background/50" rows={3} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Category</Label>
                  <Select value={newGoal.category} onValueChange={v => setNewGoal(p => ({ ...p, category: v }))}>
                    <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Priority</Label>
                  <Select value={newGoal.priority} onValueChange={v => setNewGoal(p => ({ ...p, priority: v }))}>
                    <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Low</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="high">🔴 High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Target Date</Label><Input type="date" value={newGoal.target_date} onChange={e => setNewGoal(p => ({ ...p, target_date: e.target.value }))} className="bg-background/50" /></div>
              <Button onClick={handleAddGoal} className="w-full gap-2"><Plus className="w-4 h-4" /> Create Goal</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button variant="outline" className="gap-2" onClick={getAISuggestion} disabled={aiLoading}>
          <Sparkles className="w-4 h-4" /> {aiLoading ? 'Thinking...' : 'AI Goal Suggestions'}
        </Button>

        <div className="flex-1" />

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-36 bg-background/50"><Filter className="w-3 h-3 mr-1" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32 bg-background/50"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* AI Suggestions Panel */}
      <AnimatePresence>
        {aiSuggestion && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-6 border border-primary/30 bg-primary/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> AI-Suggested Goals</h3>
              <Button variant="ghost" size="sm" onClick={() => setAiSuggestion('')}>Dismiss</Button>
            </div>
            <div className="prose prose-sm max-w-none text-foreground">
              <ReactMarkdown>{aiSuggestion}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goals List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredGoals.map((goal, idx) => {
            const catInfo = getCategoryInfo(goal.category);
            const CatIcon = catInfo.icon;
            const days = getDaysRemaining(goal.target_date);
            const isExpanded = expandedGoal === goal.id;
            const notes = goalNotes[goal.id] || [];
            const isCompleted = goal.status === 'completed';

            return (
              <motion.div key={goal.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }}
                transition={{ delay: idx * 0.03 }}
                className={`glass rounded-2xl border border-border overflow-hidden ${isCompleted ? 'opacity-70' : ''}`}>
                {/* Goal Header */}
                <div className="p-4 cursor-pointer" onClick={() => toggleGoalExpand(goal.id)}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCompleted ? 'bg-accent/20' : 'bg-background/50 border border-border'}`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5 text-accent" /> : <CatIcon className={`w-5 h-5 ${catInfo.color}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-semibold ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>{goal.title}</h3>
                        <Badge variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">
                          {goal.priority}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{catInfo.label}</Badge>
                      </div>
                      {goal.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{goal.description}</p>}
                      <div className="flex items-center gap-4 mt-2">
                        {!isCompleted && (
                          <div className="flex items-center gap-2 flex-1 max-w-xs">
                            <Progress value={goal.progress || 0} className="h-2 flex-1" />
                            <span className="text-xs font-medium text-muted-foreground w-8">{goal.progress || 0}%</span>
                          </div>
                        )}
                        {days !== null && (
                          <span className={`text-xs flex items-center gap-1 ${days < 0 ? 'text-destructive' : days <= 7 ? 'text-orange-500' : 'text-muted-foreground'}`}>
                            <Clock className="w-3 h-3" />
                            {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Due today' : `${days}d left`}
                          </span>
                        )}
                        {notes.length > 0 && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <StickyNote className="w-3 h-3" /> {notes.length} notes
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!isCompleted && (
                        <>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={e => { e.stopPropagation(); setEditingGoal(goal); }}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={e => { e.stopPropagation(); handleCompleteGoal(goal.id); }}>
                            <CheckCircle2 className="w-4 h-4 text-accent" />
                          </Button>
                        </>
                      )}
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={e => { e.stopPropagation(); handleDeleteGoal(goal.id); }}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="px-4 pb-4 border-t border-border pt-4 space-y-4">
                        {/* Progress Slider */}
                        {!isCompleted && (
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">Update Progress</Label>
                            <div className="flex items-center gap-3">
                              {[0, 25, 50, 75, 100].map(val => (
                                <Button key={val} size="sm" variant={goal.progress === val ? 'default' : 'outline'}
                                  className="text-xs px-3" onClick={() => handleUpdateProgress(goal.id, val)}>
                                  {val}%
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Full Description */}
                        {goal.description && (
                          <div className="bg-background/50 rounded-xl p-3 border border-border">
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          </div>
                        )}

                        {/* Add Note */}
                        {!isCompleted && (
                          <div>
                            {addingNoteFor === goal.id ? (
                              <div className="space-y-3 bg-background/50 rounded-xl p-4 border border-border">
                                <div className="flex gap-2 flex-wrap">
                                  {NOTE_TYPES.map(nt => (
                                    <Button key={nt.value} size="sm" variant={newNote.type === nt.value ? 'default' : 'outline'}
                                      className="gap-1 text-xs" onClick={() => setNewNote(p => ({ ...p, type: nt.value }))}>
                                      <nt.icon className="w-3 h-3" /> {nt.label}
                                    </Button>
                                  ))}
                                </div>
                                <Textarea value={newNote.content} onChange={e => setNewNote(p => ({ ...p, content: e.target.value }))}
                                  placeholder="What's the latest update on this goal?" className="bg-background/50" rows={2} />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => handleAddNote(goal.id)} className="gap-1"><Send className="w-3 h-3" /> Save Note</Button>
                                  <Button size="sm" variant="ghost" onClick={() => setAddingNoteFor(null)}>Cancel</Button>
                                </div>
                              </div>
                            ) : (
                              <Button size="sm" variant="outline" className="gap-1 w-full" onClick={() => setAddingNoteFor(goal.id)}>
                                <Plus className="w-3 h-3" /> Add Note / Update
                              </Button>
                            )}
                          </div>
                        )}

                        {/* Notes Timeline */}
                        {notes.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Activity Log</h4>
                            {notes.map(note => {
                              const noteTypeInfo = NOTE_TYPES.find(nt => nt.value === note.note_type) || NOTE_TYPES[0];
                              const NoteIcon = noteTypeInfo.icon;
                              return (
                                <div key={note.id} className="flex gap-3 group">
                                  <div className="flex flex-col items-center">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                      note.note_type === 'milestone' ? 'bg-green-500/20 text-green-500' :
                                      note.note_type === 'blocker' ? 'bg-destructive/20 text-destructive' :
                                      note.note_type === 'reflection' ? 'bg-yellow-500/20 text-yellow-500' :
                                      'bg-primary/20 text-primary'
                                    }`}>
                                      <NoteIcon className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="w-px flex-1 bg-border mt-1" />
                                  </div>
                                  <div className="flex-1 pb-3 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 mb-1">{noteTypeInfo.label}</Badge>
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] text-muted-foreground">{new Date(note.created_at).toLocaleDateString()}</span>
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDeleteNote(note.id, goal.id)}>
                                          <Trash2 className="w-3 h-3 text-destructive" />
                                        </Button>
                                      </div>
                                    </div>
                                    <p className="text-sm">{note.content}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredGoals.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg mb-1">No Goals Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {filterStatus !== 'all' || filterCategory !== 'all' ? 'Try adjusting your filters.' : 'Create your first goal or let AI suggest some!'}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setIsAddingGoal(true)} className="gap-1"><Plus className="w-4 h-4" /> New Goal</Button>
              <Button variant="outline" onClick={getAISuggestion} disabled={aiLoading} className="gap-1">
                <Sparkles className="w-4 h-4" /> AI Suggestions
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Goal Dialog */}
      <Dialog open={!!editingGoal} onOpenChange={open => !open && setEditingGoal(null)}>
        <DialogContent className="glass border-border max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Edit2 className="w-5 h-5" /> Edit Goal</DialogTitle></DialogHeader>
          {editingGoal && (
            <div className="space-y-4">
              <div><Label>Title</Label><Input value={editingGoal.title} onChange={e => setEditingGoal({ ...editingGoal, title: e.target.value })} className="bg-background/50" /></div>
              <div><Label>Description</Label><Textarea value={editingGoal.description || ''} onChange={e => setEditingGoal({ ...editingGoal, description: e.target.value })} className="bg-background/50" rows={3} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Category</Label>
                  <Select value={editingGoal.category || 'general'} onValueChange={v => setEditingGoal({ ...editingGoal, category: v })}>
                    <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Priority</Label>
                  <Select value={editingGoal.priority || 'medium'} onValueChange={v => setEditingGoal({ ...editingGoal, priority: v })}>
                    <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Low</SelectItem>
                      <SelectItem value="medium">🟡 Medium</SelectItem>
                      <SelectItem value="high">🔴 High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Target Date</Label><Input type="date" value={editingGoal.target_date || ''} onChange={e => setEditingGoal({ ...editingGoal, target_date: e.target.value })} className="bg-background/50" /></div>
              <div><Label>Status</Label>
                <Select value={editingGoal.status} onValueChange={v => setEditingGoal({ ...editingGoal, status: v })}>
                  <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => handleUpdateGoal(editingGoal)} className="w-full">Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
