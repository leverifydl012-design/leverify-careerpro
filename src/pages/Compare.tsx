import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, TrendingUp, Target, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { progressionLevels, skills, getLevelProgression } from '@/data/careerData';

export default function Compare() {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetLevel, setTargetLevel] = useState(2);

  const progression = getLevelProgression(currentLevel, targetLevel);
  const currentLevelData = progressionLevels.find(l => l.level === currentLevel);
  const targetLevelData = progressionLevels.find(l => l.level === targetLevel);

  const getLevelKey = (level: number): 'standard' | 'effective' | 'advanced' | 'expert' => {
    const mapping: { [key: number]: 'standard' | 'effective' | 'advanced' | 'expert' } = {
      1: 'standard',
      2: 'effective',
      3: 'effective',
      4: 'advanced',
      5: 'expert'
    };
    return mapping[level] || 'standard';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10 bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl">Compare Levels</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
            <Button variant="ghost" onClick={() => navigate('/quiz')}>Take Quiz</Button>
            <Button variant="outline" onClick={() => navigate('/auth')}>Sign In</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Level Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 mb-8"
        >
          <h1 className="text-3xl font-display font-bold gradient-text mb-6 text-center">
            Compare Career Levels
          </h1>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
            Select your current level and your target level to see exactly what skills you need to develop for your next promotion.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-muted-foreground mb-2">Current Level</label>
              <Select value={String(currentLevel)} onValueChange={(v) => {
                const newLevel = Number(v);
                setCurrentLevel(newLevel);
                if (targetLevel <= newLevel) {
                  setTargetLevel(Math.min(newLevel + 1, 5));
                }
              }}>
                <SelectTrigger className="bg-background/50 border-white/10 h-14 text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {progressionLevels.slice(0, 4).map(level => (
                    <SelectItem key={level.level} value={String(level.level)}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
            </div>

            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-muted-foreground mb-2">Target Level</label>
              <Select value={String(targetLevel)} onValueChange={(v) => setTargetLevel(Number(v))}>
                <SelectTrigger className="bg-background/50 border-white/10 h-14 text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {progressionLevels.filter(l => l.level > currentLevel).map(level => (
                    <SelectItem key={level.level} value={String(level.level)}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Level Cards Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-6 border-2 border-muted/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-muted/20 flex items-center justify-center text-xl font-bold">
                {currentLevel}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Level</p>
                <h2 className="text-xl font-display font-bold">{currentLevelData?.name}</h2>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">{currentLevelData?.description}</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm"><span className="text-muted-foreground">Tracks:</span> {currentLevelData?.availableIn.join(', ')}</p>
              <p className="text-sm"><span className="text-muted-foreground">Proficiency:</span> {currentLevelData?.requiredProficiency}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-6 border-2 border-primary/50 glow-primary"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-xl font-bold gradient-text">
                {targetLevel}
              </div>
              <div>
                <p className="text-sm text-primary">Target Level</p>
                <h2 className="text-xl font-display font-bold">{targetLevelData?.name}</h2>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">{targetLevelData?.description}</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-sm"><span className="text-muted-foreground">Tracks:</span> {targetLevelData?.availableIn.join(', ')}</p>
              <p className="text-sm"><span className="text-muted-foreground">Proficiency:</span> {targetLevelData?.requiredProficiency}</p>
            </div>
          </motion.div>
        </div>

        {/* Skill Gap Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
            <Target className="w-6 h-6 text-primary" />
            Skills to Develop
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({skills.length} skill areas)
            </span>
          </h2>

          <div className="space-y-4">
            {skills.map((skill, index) => {
              const currentLevelKey = getLevelKey(currentLevel);
              const targetLevelKey = getLevelKey(targetLevel);
              const currentSkillData = skill.levels[currentLevelKey];
              const targetSkillData = skill.levels[targetLevelKey];

              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="glass rounded-2xl overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-display font-bold">{skill.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{skill.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="px-3 py-1 rounded-full bg-muted/20">{currentSkillData.name}</span>
                        <ArrowRight className="w-4 h-4 text-primary" />
                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary">{targetSkillData.name}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Current Skills */}
                      <div className="bg-background/30 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Current: {currentSkillData.name}
                        </h4>
                        <ul className="space-y-2">
                          {currentSkillData.skills.map((s, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-muted-foreground mt-1">•</span>
                              <span className="text-muted-foreground">{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Target Skills */}
                      <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                        <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Develop: {targetSkillData.name}
                        </h4>
                        <ul className="space-y-2">
                          {targetSkillData.skills.map((s, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <Sparkles className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="glass rounded-3xl p-8 inline-block">
            <h3 className="text-xl font-display font-bold mb-2">Ready to start your journey?</h3>
            <p className="text-muted-foreground mb-6">Create an account to track your progress and set goals.</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/quiz')}>
                Take Assessment Quiz
              </Button>
              <Button onClick={() => navigate('/auth')} className="glow-primary">
                Get Started
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
