import { motion } from "framer-motion";
import { ChevronRight, Users, Briefcase, Award, Crown, Star } from "lucide-react";
import { progressionLevels, type ProgressionLevel } from "@/data/careerData";

const levelIcons = [Star, Briefcase, Award, Crown, Users];
const levelColors = [
  "from-level-1 to-level-2",
  "from-level-2 to-level-3",
  "from-level-3 to-level-4",
  "from-level-4 to-level-5",
  "from-level-5 to-primary",
];

interface LevelCardProps {
  level: ProgressionLevel;
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

export function LevelCard({ level, index, isSelected, onClick }: LevelCardProps) {
  const Icon = levelIcons[index];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`relative cursor-pointer group ${isSelected ? "z-10" : ""}`}
    >
      {/* Connector Line */}
      {index < progressionLevels.length - 1 && (
        <div className="absolute left-8 top-full w-0.5 h-8 bg-gradient-to-b from-border to-transparent" />
      )}

      <div
        className={`relative rounded-2xl p-6 transition-all duration-300 ${
          isSelected
            ? "glass glow-primary border-primary/50"
            : "bg-card/50 hover:bg-card border border-border/50"
        }`}
      >
        {/* Gradient Border on Selected */}
        {isSelected && (
          <div className="absolute inset-0 rounded-2xl gradient-border pointer-events-none" />
        )}

        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br ${levelColors[index]} shrink-0`}
          >
            <Icon className="w-8 h-8 text-primary-foreground" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-display font-bold truncate">{level.name}</h3>
              <ChevronRight
                className={`w-5 h-5 transition-transform ${
                  isSelected ? "rotate-90 text-primary" : "text-muted-foreground"
                }`}
              />
            </div>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {level.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {level.availableIn.map((track) => (
                <span
                  key={track}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground"
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
            className="mt-6 pt-6 border-t border-border"
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-primary mb-2">Required Proficiency</h4>
                <p className="text-sm text-muted-foreground">{level.requiredProficiency}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-primary mb-2">Career Tracks Available</h4>
                <div className="flex flex-wrap gap-2">
                  {level.availableIn.map((track) => (
                    <span
                      key={track}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-primary/10 text-primary border border-primary/20"
                    >
                      {track}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
