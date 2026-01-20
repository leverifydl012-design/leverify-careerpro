import { motion, AnimatePresence } from "framer-motion";
import { skills, getSkillsForLevel, progressionLevels } from "@/data/careerData";
import { 
  Brain, 
  MessageSquare, 
  Calendar, 
  Zap, 
  Lightbulb, 
  Heart, 
  Users,
  ChevronDown,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";

const skillIcons: { [key: string]: React.ElementType } = {
  "Domain Knowledge": Brain,
  "Communication": MessageSquare,
  "Planning": Calendar,
  "Impactability": Zap,
  "Solution Oriented": Lightbulb,
  "Company Culture": Heart,
  "Leadership": Users,
};

interface SkillsGridProps {
  selectedLevel: number;
}

export function SkillsGrid({ selectedLevel }: SkillsGridProps) {
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const levelData = progressionLevels.find(l => l.level === selectedLevel);
  const skillRequirements = getSkillsForLevel(selectedLevel);

  return (
    <motion.div
      key={selectedLevel}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-6 md:p-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-display font-bold mb-2">
          {levelData?.name}
        </h3>
        <p className="text-muted-foreground">
          Skills required to reach this level
        </p>
      </div>

      {/* Skills */}
      <div className="space-y-3">
        {skillRequirements.map(({ skill, requiredLevel }, index) => {
          const Icon = skillIcons[skill.name] || Brain;
          const isExpanded = expandedSkill === skill.name;
          const levelKey = requiredLevel as keyof typeof skill.levels;
          const levelData = skill.levels[levelKey];

          return (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => setExpandedSkill(isExpanded ? null : skill.name)}
                className={`w-full text-left rounded-xl p-4 transition-all ${
                  isExpanded 
                    ? "bg-primary/10 border border-primary/30" 
                    : "bg-muted/50 hover:bg-muted border border-transparent"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isExpanded ? "bg-primary text-primary-foreground" : "bg-card"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{skill.name}</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {requiredLevel} Level Required
                    </p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`} />
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-4">
                          {skill.description}
                        </p>
                        <div className="space-y-2">
                          {levelData.skills.map((skillItem, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                              <span className="text-sm">{skillItem}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Level Proficiency Note */}
      <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
        <p className="text-sm text-muted-foreground">
          <span className="text-primary font-semibold">Note:</span> {levelData?.requiredProficiency}
        </p>
      </div>
    </motion.div>
  );
}
