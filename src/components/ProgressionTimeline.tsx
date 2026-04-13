import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ArrowRight, Star, Lock, Zap } from 'lucide-react';
import { progressionLevels } from '@/data/careerData';

interface UserSkill {
  id: string;
  skill_id: string;
  level: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

interface ProgressionTimelineProps {
  currentLevel: number;
  targetLevel: number;
  userSkills: UserSkill[];
  totalSkillsPerLevel: number;
}

export default function ProgressionTimeline({ 
  currentLevel, 
  targetLevel, 
  userSkills, 
  totalSkillsPerLevel 
}: ProgressionTimelineProps) {
  const allLevels = progressionLevels;
  
  const getCompletionForLevel = (level: number) => {
    const completed = userSkills.filter(s => s.level === level && s.status === 'completed').length;
    const inProgress = userSkills.filter(s => s.level === level && s.status === 'in_progress').length;
    return { completed, inProgress, total: totalSkillsPerLevel };
  };

  const getLevelStatus = (level: number) => {
    if (level < currentLevel) return 'completed';
    if (level === currentLevel) return 'current';
    if (level <= targetLevel) return 'target';
    return 'locked';
  };

  const statusConfig = {
    completed: {
      icon: CheckCircle2,
      dotClass: 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]',
      lineClass: 'bg-green-500',
      labelClass: 'text-green-400',
      badge: 'Completed',
    },
    current: {
      icon: Zap,
      dotClass: 'bg-primary shadow-[0_0_24px_hsl(var(--primary)/0.5)]',
      lineClass: 'bg-gradient-to-b from-primary to-primary/30',
      labelClass: 'text-primary',
      badge: 'You Are Here',
    },
    target: {
      icon: Star,
      dotClass: 'bg-secondary/60 border-2 border-secondary shadow-[0_0_16px_hsl(var(--secondary)/0.3)]',
      lineClass: 'bg-secondary/30',
      labelClass: 'text-secondary',
      badge: 'Next Step',
    },
    locked: {
      icon: Lock,
      dotClass: 'bg-muted border border-muted-foreground/20',
      lineClass: 'bg-muted',
      labelClass: 'text-muted-foreground',
      badge: 'Future',
    },
  };

  return (
    <div className="relative">
      <div className="flex flex-col gap-0">
        {allLevels.map((level, index) => {
          const status = getLevelStatus(level.level);
          const config = statusConfig[status];
          const Icon = config.icon;
          const completion = getCompletionForLevel(level.level);
          const progressPct = completion.total > 0 
            ? Math.round((completion.completed / completion.total) * 100) 
            : 0;
          const isLast = index === allLevels.length - 1;
          const isTarget = level.level === targetLevel;

          return (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="relative flex gap-5"
            >
              {/* Vertical line + dot */}
              <div className="flex flex-col items-center">
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${config.dotClass} transition-all duration-500`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {!isLast && (
                  <div className={`w-0.5 flex-1 min-h-[48px] ${config.lineClass} transition-all duration-500`} />
                )}
              </div>

              {/* Card content */}
              <div className={`flex-1 pb-6 ${isLast ? '' : ''}`}>
                <div className={`rounded-2xl p-4 border transition-all duration-300 ${
                  status === 'current' 
                    ? 'bg-primary/5 border-primary/30 shadow-lg shadow-primary/5' 
                    : status === 'completed'
                    ? 'bg-green-500/5 border-green-500/20'
                    : isTarget
                    ? 'bg-secondary/5 border-secondary/20'
                    : 'bg-background/50 border-white/5 opacity-60'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-display font-bold text-sm ${config.labelClass}`}>
                        {level.name}
                      </h3>
                      {isTarget && status !== 'completed' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/20 text-secondary font-medium">
                          TARGET
                        </span>
                      )}
                      {status === 'current' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium animate-pulse">
                          CURRENT
                        </span>
                      )}
                    </div>
                    {(status === 'current' || status === 'target') && (
                      <span className="text-xs text-muted-foreground">
                        {completion.completed}/{completion.total} skills
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{level.description}</p>

                  {/* Progress bar for current & target levels */}
                  {(status === 'current' || status === 'target') && (
                    <div className="space-y-1">
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPct}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className={`h-full rounded-full ${
                            status === 'current' ? 'bg-primary' : 'bg-secondary'
                          }`}
                        />
                      </div>
                      {completion.inProgress > 0 && (
                        <p className="text-[10px] text-muted-foreground">
                          {completion.inProgress} in progress
                        </p>
                      )}
                    </div>
                  )}

                  {status === 'completed' && (
                    <p className="text-[10px] text-green-400 font-medium">✓ All skills mastered</p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
