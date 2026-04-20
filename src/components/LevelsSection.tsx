import { useState } from "react";
import { motion } from "framer-motion";
import { progressionLevels } from "@/data/careerData";
import { LevelCard } from "./LevelCard";
import { SkillsGrid } from "./SkillsGrid";
import { TrendingUp, Layers, ArrowUpRight } from "lucide-react";

export function LevelsSection() {
  const [selectedLevel, setSelectedLevel] = useState(1);

  return (
    <section id="levels" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-card via-background to-card" />
      {/* Decorative grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

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

          {/* Level quick-jump pills */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {progressionLevels.map((level) => (
              <motion.button
                key={level.level}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedLevel(level.level)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedLevel === level.level
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  L{level.level}
                </span>
                {selectedLevel === level.level && (
                  <motion.div
                    layoutId="level-pill-indicator"
                    className="absolute inset-0 rounded-full bg-primary -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Progress bar showing progression */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          className="mb-12 max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Level 1</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              Level 6 <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--gradient-primary)' }}
              initial={{ width: "0%" }}
              animate={{ width: `${(selectedLevel / 6) * 100}%` }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.8 }}
            />
          </div>
          <div className="flex justify-between mt-1">
            {progressionLevels.map((level) => (
              <button
                key={level.level}
                onClick={() => setSelectedLevel(level.level)}
                className={`w-4 h-4 rounded-full border-2 transition-all -mt-3 ${
                  level.level <= selectedLevel
                    ? "bg-primary border-primary scale-110"
                    : "bg-card border-border hover:border-muted-foreground"
                }`}
              />
            ))}
          </div>
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
