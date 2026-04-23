import { motion } from "framer-motion";
import { skills } from "@/data/careerData";
import { 
  Brain, 
  MessageSquare, 
  Calendar, 
  Zap, 
  Lightbulb, 
  Heart, 
  Users,
  ArrowRight
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

const skillColors = [
  "from-level-1 to-level-2",
  "from-level-2 to-level-3",
  "from-level-3 to-level-4",
  "from-level-4 to-level-5",
  "from-level-5 to-primary",
  "from-primary to-secondary",
  "from-secondary to-accent",
];

export function SkillsShowcase() {
  const [activeSkill, setActiveSkill] = useState<number | null>(null);

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
      
      <div className="container relative z-10 px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Core Competencies</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Master These <span className="gradient-text">7 Skills</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every career level requires proficiency across these core competencies
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {skills.map((skill, index) => {
            const Icon = skillIcons[skill.name];
            const isActive = activeSkill === index;

            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveSkill(isActive ? null : index)}
                className="cursor-pointer group"
              >
                <div className={`relative h-full rounded-3xl p-6 transition-all duration-300 ${
                  isActive 
                    ? "glass glow-primary" 
                    : "bg-card/50 hover:bg-card border border-border/50"
                }`}>
                  {/* Gradient Accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r ${skillColors[index]} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${skillColors[index]} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-display font-bold mb-2">{skill.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {skill.description}
                  </p>

                  {/* Expand Indicator */}
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    <span>Learn more</span>
                    <ArrowRight className={`w-4 h-4 transition-transform ${isActive ? "rotate-90" : "group-hover:translate-x-1"}`} />
                  </div>

                  {/* Expanded Content */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-6 pt-6 border-t border-border"
                    >
                      <div className="space-y-4">
                        {(["standard", "effective", "advanced", "expert"] as const).map((level) => (
                          <div key={level}>
                            <h4 className="text-sm font-semibold text-primary capitalize mb-2">
                              {skill.levels[level].name}
                            </h4>
                            <ul className="space-y-1">
                              {skill.levels[level].skills.slice(0, 3).map((s, idx) => (
                                <li key={idx} className="text-xs text-muted-foreground">
                                  • {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
