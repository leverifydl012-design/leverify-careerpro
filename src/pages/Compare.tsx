import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  progressionLevels,
  skills,
  careerTracks,
  getUpgradeRequirements,
  getTrackLevels,
} from '@/data/careerData';
import CompareHeader from '@/components/compare/CompareHeader';

export default function Compare() {
  const navigate = useNavigate();
  const [careerTrack, setCareerTrack] = useState('ic');
  const trackLevels = getTrackLevels(careerTrack);
  const [currentLevel, setCurrentLevel] = useState(trackLevels[0]);
  const [targetLevel, setTargetLevel] = useState(trackLevels[1] ?? trackLevels[0]);

  const currentLevelData = progressionLevels.find(l => l.level === currentLevel);
  const targetLevelData  = progressionLevels.find(l => l.level === targetLevel);
  const upgradeRequirements = getUpgradeRequirements(currentLevel, targetLevel, careerTrack);
  const needsUpgradeCount = upgradeRequirements.filter(r => r.needsUpgrade).length;

  const handleTrackChange = (newTrack: string) => {
    setCareerTrack(newTrack);
    const levels = getTrackLevels(newTrack);
    setCurrentLevel(levels[0]);
    setTargetLevel(levels[1] ?? levels[0]);
  };

  const handleCurrentChange = (newLevel: number) => {
    setCurrentLevel(newLevel);
    if (targetLevel <= newLevel) {
      const next = trackLevels.find(l => l > newLevel);
      if (next) setTargetLevel(next);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CompareHeader />

      <main className="container mx-auto px-6 py-12 max-w-3xl">

        {/* Selectors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 mb-8"
        >
          <h1 className="text-3xl font-display font-bold gradient-text mb-2 text-center">
            Compare Levels
          </h1>
          <p className="text-muted-foreground text-center mb-8 max-w-xl mx-auto">
            See exactly which skills you need to develop to move to your next level.
          </p>

          {/* Career Track */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted-foreground mb-2">Career Track</label>
            <Select value={careerTrack} onValueChange={handleTrackChange}>
              <SelectTrigger className="bg-background/50 border-border h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {careerTracks.map(track => (
                  <SelectItem key={track.id} value={track.id}>{track.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current → Target */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <div className="w-full md:w-56">
              <label className="block text-sm font-medium text-muted-foreground mb-2">Current Level</label>
              <Select
                value={String(currentLevel)}
                onValueChange={v => handleCurrentChange(Number(v))}
              >
                <SelectTrigger className="bg-background/50 border-border h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {progressionLevels
                    .filter(l => trackLevels.includes(l.level) && l.level < trackLevels[trackLevels.length - 1])
                    .map(level => (
                      <SelectItem key={level.level} value={String(level.level)}>
                        {level.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center pt-5">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
            </div>

            <div className="w-full md:w-56">
              <label className="block text-sm font-medium text-muted-foreground mb-2">Target Level</label>
              <Select
                value={String(targetLevel)}
                onValueChange={v => setTargetLevel(Number(v))}
              >
                <SelectTrigger className="bg-background/50 border-border h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {progressionLevels
                    .filter(l => trackLevels.includes(l.level) && l.level > currentLevel)
                    .map(level => (
                      <SelectItem key={level.level} value={String(level.level)}>
                        {level.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Current vs Target overview cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <div className="glass rounded-2xl p-5 border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">You are at</p>
            <h2 className="text-2xl font-display font-bold">{currentLevelData?.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{currentLevelData?.description}</p>
          </div>
          <div className="glass rounded-2xl p-5 border-2 border-primary/40 glow-primary">
            <p className="text-xs text-primary uppercase tracking-wider mb-1">You are aiming for</p>
            <h2 className="text-2xl font-display font-bold">{targetLevelData?.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{targetLevelData?.description}</p>
          </div>
        </motion.div>

        {/* Required Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-display font-bold">
              Skills Required for {targetLevelData?.name}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            {needsUpgradeCount > 0
              ? `${needsUpgradeCount} skill${needsUpgradeCount > 1 ? 's' : ''} need${needsUpgradeCount === 1 ? 's' : ''} to be upgraded to reach ${targetLevelData?.name}.`
              : `You already meet all skill requirements for ${targetLevelData?.name}.`}
          </p>

          <div className="space-y-3">
            {upgradeRequirements.map((req, index) => {
              const skillData = skills.find(s => s.name === req.skillName);
              if (!skillData) return null;

              return (
                <motion.div
                  key={req.skillName}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className={`rounded-xl p-4 border flex items-start gap-4 ${
                    req.needsUpgrade
                      ? 'bg-primary/5 border-primary/40'
                      : 'bg-accent/5 border-accent/30'
                  }`}
                >
                  <div className={`mt-0.5 shrink-0 ${req.needsUpgrade ? 'text-primary' : 'text-accent'}`}>
                    {req.needsUpgrade
                      ? <AlertCircle className="w-5 h-5" />
                      : <CheckCircle2 className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{req.skillName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                        req.needsUpgrade
                          ? 'bg-primary/20 text-primary'
                          : 'bg-accent/20 text-accent'
                      }`}>
                        {req.toLevel}
                      </span>
                      {req.needsUpgrade && (
                        <span className="text-xs text-muted-foreground">
                          (currently {req.fromLevel})
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {skillData.levels[req.toLevel]?.skills[0]}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary" />
              Needs upgrade
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              Already met
            </span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="glass rounded-3xl p-8 inline-block w-full">
            <h3 className="text-xl font-display font-bold mb-2">Ready to start your journey?</h3>
            <p className="text-muted-foreground mb-6">Create an account to track your progress and set goals.</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/quiz')}>Take Assessment</Button>
              <Button onClick={() => navigate('/auth')} className="glow-primary">Get Started</Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
