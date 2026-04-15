import { motion } from 'framer-motion';
import { Star, Award, Crown, Gem, Trophy } from 'lucide-react';
import { ProgressionLevel } from '@/data/careerData';

const levelIcons = [Star, Award, Crown, Gem, Trophy];
const levelGradients = [
  'from-blue-500/20 to-cyan-500/20',
  'from-teal-500/20 to-emerald-500/20',
  'from-green-500/20 to-lime-500/20',
  'from-purple-500/20 to-pink-500/20',
  'from-rose-500/20 to-orange-500/20',
];

interface Props {
  currentLevelData?: ProgressionLevel;
  targetLevelData?: ProgressionLevel;
  currentLevel: number;
  targetLevel: number;
}

export default function LevelComparisonCards({ currentLevelData, targetLevelData, currentLevel, targetLevel }: Props) {
  const CurIcon = levelIcons[currentLevel - 1] || Star;
  const TarIcon = levelIcons[targetLevel - 1] || Star;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-3xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${levelGradients[currentLevel - 1]} flex items-center justify-center`}>
            <CurIcon className="w-7 h-7 text-secondary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Level</p>
            <h2 className="text-xl font-display font-bold">{currentLevelData?.name}</h2>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{currentLevelData?.description}</p>
        <div className="space-y-2 pt-3 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Available Tracks</span>
            <span>{currentLevelData?.availableIn.join(', ')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Proficiency Required</span>
            <span className="text-secondary">{currentLevelData?.requiredProficiency}</span>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass rounded-3xl p-6 border-2 border-primary/40 glow-primary">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${levelGradients[targetLevel - 1]} flex items-center justify-center`}>
            <TarIcon className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-xs text-primary uppercase tracking-wider">Target Level</p>
            <h2 className="text-xl font-display font-bold">{targetLevelData?.name}</h2>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{targetLevelData?.description}</p>
        <div className="space-y-2 pt-3 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Available Tracks</span>
            <span>{targetLevelData?.availableIn.join(', ')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Proficiency Required</span>
            <span className="text-primary">{targetLevelData?.requiredProficiency}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
