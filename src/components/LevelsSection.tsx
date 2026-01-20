import { useState } from "react";
import { motion } from "framer-motion";
import { progressionLevels } from "@/data/careerData";
import { LevelCard } from "./LevelCard";
import { SkillsGrid } from "./SkillsGrid";
import { TrendingUp } from "lucide-react";

export function LevelsSection() {
  const [selectedLevel, setSelectedLevel] = useState(1);

  return (
    <section id="levels" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card via-background to-card" />
      
      <div className="container relative z-10 px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Career Progression Path</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Choose Your <span className="gradient-text">Level</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a level to explore the skills and competencies needed to reach it
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Level Cards */}
          <div className="space-y-4">
            {progressionLevels.map((level, index) => (
              <LevelCard
                key={level.level}
                level={level}
                index={index}
                isSelected={selectedLevel === level.level}
                onClick={() => setSelectedLevel(level.level)}
              />
            ))}
          </div>

          {/* Skills Grid */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <SkillsGrid selectedLevel={selectedLevel} />
          </div>
        </div>
      </div>
    </section>
  );
}
