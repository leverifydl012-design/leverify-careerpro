import { motion } from 'framer-motion';
import { Zap, Clock, TrendingUp, Award } from 'lucide-react';

interface ReadinessScoreProps {
  currentLevel: number;
  targetLevel: number;
  gapCount: number;
  totalSkills: number;
}

export default function ReadinessScore({ currentLevel, targetLevel, gapCount, totalSkills }: ReadinessScoreProps) {
  const levelDiff = targetLevel - currentLevel;
  const readiness = Math.max(0, Math.round(((totalSkills - gapCount) / totalSkills) * 100 - (levelDiff - 1) * 15));
  const estimatedMonths = levelDiff * 6 + gapCount * 2;

  const getReadinessColor = (score: number) => {
    if (score >= 70) return 'text-accent';
    if (score >= 40) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getReadinessLabel = (score: number) => {
    if (score >= 70) return 'Well Positioned';
    if (score >= 40) return 'On Track';
    return 'Growth Needed';
  };

  const stats = [
    { icon: Zap, label: 'Readiness Score', value: `${readiness}%`, sub: getReadinessLabel(readiness), color: getReadinessColor(readiness) },
    { icon: Clock, label: 'Est. Timeline', value: `${estimatedMonths}mo`, sub: 'With consistent effort', color: 'text-primary' },
    { icon: TrendingUp, label: 'Skills to Develop', value: `${gapCount}/${totalSkills}`, sub: 'Areas need growth', color: 'text-secondary' },
    { icon: Award, label: 'Level Jump', value: `L${currentLevel} → L${targetLevel}`, sub: `${levelDiff} level${levelDiff > 1 ? 's' : ''} ahead`, color: 'text-accent' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
          className="glass rounded-2xl p-5 text-center"
        >
          <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
          <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
          <p className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}
