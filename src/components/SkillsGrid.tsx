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
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Target,
} from "lucide-react";
import { useState } from "react";

const skillIcons: { [key: string]: React.ElementType } = {
  "Domain Knowledge": Brain,
  Communication: MessageSquare,
  Planning: Calendar,
  Impactability: Zap,
  "Solution Oriented": Lightbulb,
  "Company Culture": Heart,
  Leadership: Users,
};

const skillColors: { [key: string]: string } = {
  "Domain Knowledge": "from-blue-500 to-cyan-400",
  Communication: "from-violet-500 to-purple-400",
  Planning: "from-emerald-500 to-green-400",
  Impactability: "from-amber-500 to-yellow-400",
  "Solution Oriented": "from-orange-500 to-red-400",
  "Company Culture": "from-pink-500 to-rose-400",
  Leadership: "from-indigo-500 to-blue-400",
};

const proficiencyPercent: { [key: string]: number } = {
  standard: 25,
  effective: 50,
  advanced: 75,
  expert: 100,
};

interface SkillsGridProps {
  selectedLevel: number;
}

export function SkillsGrid({ selectedLevel }: SkillsGridProps) {
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const levelData = progressionLevels.find((l) => l.level === selectedLevel);
  const skillRequirements = getSkillsForLevel(selectedLevel);

  return (
    <motion.div
      key={selectedLevel}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-6 md:p-8 border border-border/50"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="text-2xl font-display font-bold">{levelData?.name}</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            Skills required to reach this level
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-primary">
            {skillRequirements.length} Skills
          </span>
        </div>
      </div>

      {/* Overall proficiency indicator */}
      <div className="mb-6 p-3 rounded-xl bg-muted/30 border border-border/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Required Proficiency
          </span>
          <span className="text-xs font-bold text-primary">
            {skillRequirements[0]?.requiredLevel.charAt(0).toUpperCase() +
              skillRequirements[0]?.requiredLevel.slice(1)}
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--gradient-primary)" }}
            initial={{ width: 0 }}
            animate={{
              width: `${proficiencyPercent[skillRequirements[0]?.requiredLevel] || 25}%`,
            }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-2">
        {skillRequirements.map(({ skill, requiredLevel }, index) => {
          const Icon = skillIcons[skill.name] || Brain;
          const isExpanded = expandedSkill === skill.name;
          const levelKey = requiredLevel as keyof typeof skill.levels;
          const levelInfo = skill.levels[levelKey];
          const colorGradient = skillColors[skill.name] || "from-primary to-secondary";
          const pct = proficiencyPercent[requiredLevel] || 25;

          return (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <button
                onClick={() =>
                  setExpandedSkill(isExpanded ? null : skill.name)
                }
                className={`w-full text-left rounded-xl p-4 transition-all duration-200 ${
                  isExpanded
                    ? "bg-primary/8 border border-primary/25 shadow-sm"
                    : "bg-muted/30 hover:bg-muted/50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Skill icon with gradient bg */}
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${colorGradient} shadow-sm shrink-0`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-sm">{skill.name}</h4>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isExpanded
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {requiredLevel}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-primary" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Skill proficiency bar */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-muted/50 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${colorGradient}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{
                            delay: index * 0.05 + 0.2,
                            duration: 0.5,
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground w-7 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-3 border-t border-border/50">
                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                          {skill.description}
                        </p>
                        <div className="space-y-2">
                          {levelInfo.skills.map((skillItem, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex items-start gap-2 group/item"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                              <span className="text-xs leading-relaxed">
                                {skillItem}
                              </span>
                            </motion.div>
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

      {/* Footer note */}
      <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
        <TrendingUp className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="text-primary font-semibold">Note:</span>{" "}
          {levelData?.requiredProficiency}
        </p>
      </div>
    </motion.div>
  );
}
