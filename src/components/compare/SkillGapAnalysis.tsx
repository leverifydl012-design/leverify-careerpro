import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ArrowRight, CheckCircle2, Sparkles, ChevronDown, ChevronUp, BookOpen, Lightbulb, Users, Brain, BarChart3, Shield, Rocket } from 'lucide-react';
import { skills } from '@/data/careerData';
import { Progress } from '@/components/ui/progress';

const skillIcons: Record<string, React.ElementType> = {
  'Domain Knowledge': Brain,
  'Communication': Users,
  'Planning': BarChart3,
  'Impactability': Rocket,
  'Solution Oriented': Lightbulb,
  'Company Culture': Shield,
  'Leadership': BookOpen,
};

const proficiencyValue: Record<string, number> = {
  standard: 25,
  effective: 50,
  advanced: 75,
  expert: 100,
};

const levelToKey = (level: number): 'standard' | 'effective' | 'advanced' | 'expert' => {
  const map: Record<number, 'standard' | 'effective' | 'advanced' | 'expert'> = { 1: 'standard', 2: 'effective', 3: 'effective', 4: 'advanced', 5: 'expert' };
  return map[level] || 'standard';
};

interface Props {
  currentLevel: number;
  targetLevel: number;
}

export default function SkillGapAnalysis({ currentLevel, targetLevel }: Props) {
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const currentKey = levelToKey(currentLevel);
  const targetKey = levelToKey(targetLevel);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-3">
        <Target className="w-6 h-6 text-primary" />
        Detailed Skill Gap Analysis
      </h2>
      <p className="text-muted-foreground text-sm mb-6">Click any skill to see current vs. target requirements with actionable growth tips.</p>

      <div className="space-y-4">
        {skills.map((skill, index) => {
          const Icon = skillIcons[skill.name] || Brain;
          const currentData = skill.levels[currentKey];
          const targetData = skill.levels[targetKey];
          const currentVal = proficiencyValue[currentKey];
          const targetVal = proficiencyValue[targetKey];
          const gap = targetVal - currentVal;
          const hasGap = gap > 0;
          const isExpanded = expandedSkill === skill.name;

          return (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className={`glass rounded-2xl overflow-hidden transition-all ${hasGap ? 'border-l-4 border-l-primary/60' : 'border-l-4 border-l-accent/60'}`}
            >
              <button
                onClick={() => setExpandedSkill(isExpanded ? null : skill.name)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-muted/10 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${hasGap ? 'bg-primary/15' : 'bg-accent/15'}`}>
                    <Icon className={`w-5 h-5 ${hasGap ? 'text-primary' : 'text-accent'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-display font-bold">{skill.name}</h3>
                      {!hasGap && <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">No gap</span>}
                      {hasGap && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">+{gap}% growth needed</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-xs">
                        <Progress value={currentVal} className="h-2 bg-muted" />
                      </div>
                      <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 max-w-xs">
                        <Progress value={targetVal} className="h-2 bg-muted" />
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{currentData.name} → {targetData.name}</span>
                    </div>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-4">
                      <p className="text-sm text-muted-foreground">{skill.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-background/40 rounded-xl p-4">
                          <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-secondary" />
                            Current: {currentData.name}
                          </h4>
                          <ul className="space-y-2">
                            {currentData.skills.map((s, i) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <span className="text-muted-foreground mt-0.5">✓</span>
                                <span className="text-muted-foreground">{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                          <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Target: {targetData.name}
                          </h4>
                          <ul className="space-y-2">
                            {targetData.skills.map((s, i) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <Sparkles className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Actionable tips */}
                      {hasGap && (
                        <div className="bg-accent/5 rounded-xl p-4 border border-accent/20">
                          <h4 className="text-sm font-semibold text-accent mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            How to close this gap
                          </h4>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            {skill.name === 'Domain Knowledge' && (
                              <>
                                <li>• Take advanced certifications in your domain</li>
                                <li>• Contribute to cross-team architecture reviews</li>
                                <li>• Publish internal knowledge-base articles</li>
                              </>
                            )}
                            {skill.name === 'Communication' && (
                              <>
                                <li>• Practice presenting in team meetings weekly</li>
                                <li>• Seek 360° feedback on communication style</li>
                                <li>• Mentor a junior colleague for 3 months</li>
                              </>
                            )}
                            {skill.name === 'Planning' && (
                              <>
                                <li>• Lead sprint planning for your team</li>
                                <li>• Create quarterly OKRs with measurable results</li>
                                <li>• Study project management frameworks (Agile/PRINCE2)</li>
                              </>
                            )}
                            {skill.name === 'Impactability' && (
                              <>
                                <li>• Document the business impact of every project you deliver</li>
                                <li>• Volunteer for high-visibility initiatives</li>
                                <li>• Build a stakeholder map and present outcomes regularly</li>
                              </>
                            )}
                            {skill.name === 'Solution Oriented' && (
                              <>
                                <li>• Practice root-cause analysis (5 Whys, fishbone diagrams)</li>
                                <li>• Propose 3 solutions for every problem you raise</li>
                                <li>• Join cross-functional hackathons or brainstorming sessions</li>
                              </>
                            )}
                            {skill.name === 'Company Culture' && (
                              <>
                                <li>• Organize a team culture event or workshop</li>
                                <li>• Lead a D&I initiative or ethics training session</li>
                                <li>• Document and share team values and rituals</li>
                              </>
                            )}
                            {skill.name === 'Leadership' && (
                              <>
                                <li>• Take on a project lead role for a small initiative</li>
                                <li>• Complete a leadership development program</li>
                                <li>• Build a personal development plan and review monthly</li>
                              </>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
