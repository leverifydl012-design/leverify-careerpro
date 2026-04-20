import { motion } from "framer-motion";
import { ChevronRight, Users, Briefcase, Award, Crown, Star, ArrowUpRight, Sparkles, Trophy } from "lucide-react";
import { progressionLevels, type ProgressionLevel } from "@/data/careerData";

const levelIcons = [Star, Briefcase, Award, Crown, Users, Trophy];
const levelColors = [
  "from-level-1 to-level-2",
  "from-level-2 to-level-3",
  "from-level-3 to-level-4",
  "from-level-4 to-level-5",
  "from-level-5 to-primary",
  "from-primary to-secondary",
];

const levelHighlights = [
  "Core skills • Fundamentals",
  "Growing expertise • Independence",
  "Mentoring • Advanced capabilities",
  "Leading initiatives • Org impact",
  "Strategy • High-performing teams",
  "Executive mastery • Organizational leadership",
];

interface LevelCardProps {
  level: ProgressionLevel;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

export function LevelCard({ level, index, isSelected, onClick }: LevelCardProps) {
  const Icon = levelIcons[index];
  const totalLevels = progressionLevels.length;
  const progressPercent = ((index + 1) / totalLevels) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.01, x: 4 }}
      onClick={onClick}
      className={`relative cursor-pointer group ${isSelected ? "z-10" : ""}`}
    >
      {/* Connector Line */}
      {index < totalLevels - 1 && (
        <div className="absolute left-8 top-full w-0.5 h-4 bg-gradient-to-b from-border to-transparent z-0" />
      )}

      <div
        className={`relative rounded-2xl p-5 transition-all duration-300 overflow-hidden ${
          isSelected
            ? "glass border border-primary/40 shadow-lg shadow-primary/10"
            : "bg-card/50 hover:bg-card/80 border border-border/50"
        }`}
      >
        {/* Animated gradient bg on selected */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none"
          />
        )}

        <div className="relative flex items-start gap-4">
          {/* Icon with level number badge */}
          <div className="relative shrink-0">
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${levelColors[index]} transition-transform duration-300 ${
                isSelected ? "scale-105 shadow-lg" : "group-hover:scale-105"
              }`}
            >
              <Icon className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {level.level}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-display font-bold truncate">{level.name}</h3>
              {isSelected ? (
                <Sparkles className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
              )}
            </div>
            <p className="text-muted-foreground text-sm line-clamp-1 mb-3">
              {level.description}
            </p>

            {/* Mini progress bar */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progressPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-mono">{Math.round(progressPercent)}%</span>
            </div>

            {/* Track badges */}
            <div className="flex flex-wrap gap-1.5">
              {level.availableIn.map((track) => (
                <span
                  key={track}
                  className={`px-2.5 py-0.5 text-xs font-medium rounded-full transition-colors ${
                    isSelected
                      ? "bg-primary/15 text-primary border border-primary/20"
                      : "bg-muted/80 text-muted-foreground"
                  }`}
                >
                  {track}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative mt-5 pt-5 border-t border-border/50"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-xl p-3">
                <h4 className="text-xs font-semibold text-primary mb-1.5 uppercase tracking-wider">Proficiency</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{level.requiredProficiency}</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-3">
                <h4 className="text-xs font-semibold text-primary mb-1.5 uppercase tracking-wider">Key Focus</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{levelHighlights[index]}</p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">Roles</h4>
              <div className="flex flex-wrap gap-2">
                {level.availableIn.map((track) => (
                  <span
                    key={track}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary/10 text-primary border border-primary/20"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    {track}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
