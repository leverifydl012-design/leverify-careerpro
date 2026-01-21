import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Target, TrendingUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { skills, progressionLevels } from '@/data/careerData';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Question {
  skillName: string;
  question: string;
  options: {
    label: string;
    value: number;
    description: string;
  }[];
}

const questions: Question[] = skills.map(skill => ({
  skillName: skill.name,
  question: `How would you rate your ${skill.name} abilities?`,
  options: [
    { 
      label: 'Developing', 
      value: 1, 
      description: skill.levels.standard.skills[0] 
    },
    { 
      label: 'Competent', 
      value: 2, 
      description: skill.levels.effective.skills[0] 
    },
    { 
      label: 'Proficient', 
      value: 3, 
      description: skill.levels.advanced.skills[0] 
    },
    { 
      label: 'Expert', 
      value: 4, 
      description: skill.levels.expert.skills[0] 
    },
  ]
}));

export default function Quiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentQ.skillName]: value }));
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const calculateResults = () => {
    const scores = Object.values(answers);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    let recommendedLevel = 1;
    if (average >= 3.5) recommendedLevel = 5;
    else if (average >= 3) recommendedLevel = 4;
    else if (average >= 2.5) recommendedLevel = 3;
    else if (average >= 1.5) recommendedLevel = 2;
    
    const suggestions = skills
      .filter(skill => answers[skill.name] < 3)
      .map(skill => ({
        skill: skill.name,
        currentScore: answers[skill.name],
        suggestion: skill.levels.advanced.skills[0]
      }));
    
    return { recommendedLevel, average, suggestions };
  };

  const saveResults = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Create an account to save your results and track progress.',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }
    
    setIsSaving(true);
    const results = calculateResults();
    
    const { error } = await supabase
      .from('assessment_results')
      .insert({
        user_id: user.id,
        recommended_level: results.recommendedLevel,
        skill_scores: answers,
        suggestions: results.suggestions
      });
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to save results', variant: 'destructive' });
    } else {
      toast({ title: 'Results Saved! 🎉', description: 'View your dashboard to track progress.' });
      navigate('/dashboard');
    }
    setIsSaving(false);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const results = calculateResults();
    const levelData = progressionLevels.find(l => l.level === results.recommendedLevel);

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-white/10 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">Assessment Results</span>
            </div>
            <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Assessment Complete</span>
            </div>
            <h1 className="text-4xl font-display font-bold mb-2">Your Recommended Level</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-8 text-center mb-8 glow-primary"
          >
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl font-display font-bold text-white">{results.recommendedLevel}</span>
            </div>
            <h2 className="text-2xl font-display font-bold gradient-text mb-2">{levelData?.name}</h2>
            <p className="text-muted-foreground">{levelData?.description}</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-muted-foreground">
                Average Score: <span className="text-primary font-semibold">{results.average.toFixed(1)}/4</span>
              </p>
            </div>
          </motion.div>

          {/* Skill Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-3xl p-6 mb-8"
          >
            <h3 className="text-xl font-display font-bold mb-4">Skill Breakdown</h3>
            <div className="space-y-3">
              {skills.map(skill => {
                const score = answers[skill.name] || 0;
                const percentage = (score / 4) * 100;
                return (
                  <div key={skill.name} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium truncate">{skill.name}</div>
                    <div className="flex-1">
                      <Progress value={percentage} className="h-2" />
                    </div>
                    <div className="w-20 text-right text-sm text-muted-foreground">
                      {['Developing', 'Competent', 'Proficient', 'Expert'][score - 1]}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Improvement Suggestions */}
          {results.suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-3xl p-6 mb-8"
            >
              <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Areas for Improvement
              </h3>
              <div className="space-y-3">
                {results.suggestions.map(({ skill, suggestion }) => (
                  <div key={skill} className="bg-background/50 rounded-xl p-4 border border-white/5">
                    <p className="font-medium text-primary mb-1">{skill}</p>
                    <p className="text-sm text-muted-foreground">{suggestion}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button variant="outline" onClick={resetQuiz} className="flex-1 gap-2">
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </Button>
            <Button variant="outline" onClick={() => navigate('/compare')} className="flex-1">
              Compare Levels
            </Button>
            <Button onClick={saveResults} disabled={isSaving} className="flex-1 glow-primary">
              {isSaving ? 'Saving...' : user ? 'Save to Dashboard' : 'Sign In to Save'}
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl">Self Assessment</span>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>Exit</Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass rounded-3xl p-8"
          >
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                {currentQ.skillName}
              </span>
              <h2 className="text-2xl font-display font-bold">{currentQ.question}</h2>
            </div>

            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <motion.button
                  key={option.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    answers[currentQ.skillName] === option.value
                      ? 'bg-primary/20 border-primary'
                      : 'bg-background/50 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">{option.label}</span>
                    {answers[currentQ.skillName] === option.value && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{option.description}</p>
                </motion.button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              <Button
                variant="ghost"
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              
              {answers[currentQ.skillName] && currentQuestion < questions.length - 1 && (
                <Button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  className="gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              
              {answers[currentQ.skillName] && currentQuestion === questions.length - 1 && (
                <Button
                  onClick={() => setShowResults(true)}
                  className="gap-2 glow-primary"
                >
                  See Results
                  <Sparkles className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
