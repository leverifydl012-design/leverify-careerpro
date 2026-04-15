import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { progressionLevels } from '@/data/careerData';

interface LevelSelectorProps {
  currentLevel: number;
  targetLevel: number;
  onCurrentChange: (level: number) => void;
  onTargetChange: (level: number) => void;
}

export default function LevelSelector({ currentLevel, targetLevel, onCurrentChange, onTargetChange }: LevelSelectorProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-8 mb-8">
      <h1 className="text-3xl font-display font-bold gradient-text mb-2 text-center">
        Career Level Comparison
      </h1>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Discover the exact skills, mindset shifts, and growth areas needed to reach your next level.
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
        <div className="w-full md:w-64">
          <label className="block text-sm font-medium text-muted-foreground mb-2">Current Level</label>
          <Select value={String(currentLevel)} onValueChange={(v) => {
            const newLevel = Number(v);
            onCurrentChange(newLevel);
          }}>
            <SelectTrigger className="bg-background/50 border-border h-14 text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {progressionLevels.slice(0, 4).map(level => (
                <SelectItem key={level.level} value={String(level.level)}>{level.name}</SelectItem>
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
          <Select value={String(targetLevel)} onValueChange={(v) => onTargetChange(Number(v))}>
            <SelectTrigger className="bg-background/50 border-border h-14 text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {progressionLevels.filter(l => l.level > currentLevel).map(level => (
                <SelectItem key={level.level} value={String(level.level)}>{level.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );
}
