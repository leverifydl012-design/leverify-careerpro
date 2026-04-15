import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { progressionLevels, skills } from '@/data/careerData';
import CompareHeader from '@/components/compare/CompareHeader';
import LevelSelector from '@/components/compare/LevelSelector';
import ReadinessScore from '@/components/compare/ReadinessScore';
import SkillRadarChart from '@/components/compare/SkillRadarChart';
import LevelComparisonCards from '@/components/compare/LevelComparisonCards';
import SkillGapAnalysis from '@/components/compare/SkillGapAnalysis';
import GrowthRoadmap from '@/components/compare/GrowthRoadmap';

const levelToKey = (level: number): string => {
  const map: Record<number, string> = { 1: 'standard', 2: 'effective', 3: 'effective', 4: 'advanced', 5: 'expert' };
  return map[level] || 'standard';
};

export default function Compare() {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [targetLevel, setTargetLevel] = useState(2);

  const currentLevelData = progressionLevels.find(l => l.level === currentLevel);
  const targetLevelData = progressionLevels.find(l => l.level === targetLevel);

  const currentKey = levelToKey(currentLevel);
  const targetKey = levelToKey(targetLevel);
  const gapCount = currentKey !== targetKey ? skills.length : 0;

  const handleCurrentChange = (newLevel: number) => {
    setCurrentLevel(newLevel);
    if (targetLevel <= newLevel) setTargetLevel(Math.min(newLevel + 1, 5));
  };

  return (
    <div className="min-h-screen bg-background">
      <CompareHeader />

      <main className="container mx-auto px-6 py-12">
        <LevelSelector
          currentLevel={currentLevel}
          targetLevel={targetLevel}
          onCurrentChange={handleCurrentChange}
          onTargetChange={setTargetLevel}
        />

        <ReadinessScore
          currentLevel={currentLevel}
          targetLevel={targetLevel}
          gapCount={gapCount}
          totalSkills={skills.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <SkillRadarChart currentLevel={currentLevel} targetLevel={targetLevel} />
          </div>
          <div className="lg:col-span-2">
            <LevelComparisonCards
              currentLevelData={currentLevelData}
              targetLevelData={targetLevelData}
              currentLevel={currentLevel}
              targetLevel={targetLevel}
            />
            <GrowthRoadmap currentLevel={currentLevel} targetLevel={targetLevel} />
          </div>
        </div>

        <SkillGapAnalysis currentLevel={currentLevel} targetLevel={targetLevel} />

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12 text-center">
          <div className="glass rounded-3xl p-8 inline-block">
            <h3 className="text-xl font-display font-bold mb-2">Ready to start your journey?</h3>
            <p className="text-muted-foreground mb-6">Create an account to track your progress and set goals.</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => navigate('/quiz')}>Take Assessment Quiz</Button>
              <Button onClick={() => navigate('/auth')} className="glow-primary">Get Started</Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
