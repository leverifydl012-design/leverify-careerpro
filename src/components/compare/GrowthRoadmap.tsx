import { motion } from 'framer-motion';
import { MapPin, Flag, ChevronRight } from 'lucide-react';
import { progressionLevels } from '@/data/careerData';

interface Props {
  currentLevel: number;
  targetLevel: number;
}

export default function GrowthRoadmap({ currentLevel, targetLevel }: Props) {
  const steps = progressionLevels.filter(l => l.level >= currentLevel && l.level <= targetLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-3xl p-6 mb-8"
    >
      <h3 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" />
        Your Growth Roadmap
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-primary to-accent" />

        <div className="space-y-6">
          {steps.map((step, i) => {
            const isStart = i === 0;
            const isEnd = i === steps.length - 1;
            const isMid = !isStart && !isEnd;

            return (
              <motion.div
                key={step.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="relative flex items-start gap-4 pl-2"
              >
                <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isStart ? 'bg-secondary text-secondary-foreground' :
                  isEnd ? 'bg-primary text-primary-foreground glow-primary' :
                  'bg-muted text-foreground'
                }`}>
                  {isEnd ? <Flag className="w-4 h-4" /> : <span className="text-sm font-bold">{step.level}</span>}
                </div>

                <div className={`flex-1 rounded-xl p-4 ${
                  isEnd ? 'bg-primary/10 border border-primary/30' :
                  isStart ? 'bg-secondary/10 border border-secondary/30' :
                  'bg-muted/20 border border-border'
                }`}>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-sm">{step.name}</h4>
                    {isStart && <span className="text-xs px-2 py-0.5 bg-secondary/20 rounded-full text-secondary">You are here</span>}
                    {isEnd && <span className="text-xs px-2 py-0.5 bg-primary/20 rounded-full text-primary">Goal</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                  {!isEnd && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <ChevronRight className="w-3 h-3" />
                      <span>~6 months focused growth</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
