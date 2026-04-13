import { motion } from "framer-motion";
import { 
  TrendingUp, BookOpen, Users, Presentation, Code, 
  Brain, Handshake, Star, ArrowRight 
} from "lucide-react";
import { progressionLevels, skills, getSkillsForLevel } from "@/data/careerData";

interface GrowthInsightsProps {
  currentLevel: number;
  targetLevel: number;
  careerTrack: string;
  completedSkills: string[];
  inProgressSkills: string[];
}

const growthStrategies: Record<string, { icon: any; title: string; actions: string[] }[]> = {
  "Domain Knowledge": [
    { icon: Code, title: "Build Technical Depth", actions: [
      "Complete one online certification in your domain this quarter",
      "Write a technical blog post or internal wiki article monthly",
      "Volunteer for the most technically challenging tickets",
    ]},
  ],
  "Communication": [
    { icon: Presentation, title: "Improve Communication", actions: [
      "Present at least once per month in team meetings",
      "Practice active listening by summarizing others' points before responding",
      "Request feedback on your emails and presentations from a trusted peer",
    ]},
  ],
  "Planning": [
    { icon: Brain, title: "Strengthen Planning Skills", actions: [
      "Break every task into subtasks before starting",
      "Create a weekly priority matrix (urgent vs important)",
      "Lead a sprint planning session or project kickoff meeting",
    ]},
  ],
  "Leadership": [
    { icon: Users, title: "Grow Leadership Abilities", actions: [
      "Mentor a junior colleague - schedule weekly 1:1s",
      "Take ownership of a cross-team initiative",
      "Read 'Leaders Eat Last' by Simon Sinek and apply one principle",
    ]},
  ],
  "Solution Oriented": [
    { icon: Brain, title: "Develop Solution Thinking", actions: [
      "For every problem you raise, bring 2-3 possible solutions",
      "Learn a structured problem-solving framework (e.g., 5 Whys, Fishbone)",
      "Document solutions to recurring problems for the team",
    ]},
  ],
  "Impactability": [
    { icon: Star, title: "Increase Your Impact", actions: [
      "Track and document the business value of your work weekly",
      "Share weekly wins in team channel to build visibility",
      "Align every task with a team or company OKR",
    ]},
  ],
  "Company Culture": [
    { icon: Handshake, title: "Champion Company Culture", actions: [
      "Organize or participate in a team-building activity",
      "Recognize a colleague's contribution publicly each week",
      "Volunteer for the diversity & inclusion or culture committee",
    ]},
  ],
};

export function GrowthInsights({ currentLevel, targetLevel, careerTrack, completedSkills, inProgressSkills }: GrowthInsightsProps) {
  const gapSkills = skills
    .map(s => s.name)
    .filter(name => !completedSkills.includes(name) && !inProgressSkills.includes(name));

  const prioritySkills = gapSkills.length > 0 ? gapSkills.slice(0, 3) : skills.map(s => s.name).slice(0, 3);
  const currentLevelData = progressionLevels.find(l => l.level === currentLevel);
  const targetLevelData = progressionLevels.find(l => l.level === targetLevel);

  const progressPercent = completedSkills.length > 0 
    ? Math.round((completedSkills.length / (skills.length)) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Overall Progress Ring */}
      <div className="flex items-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
        <div className="relative w-20 h-20 shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="34" fill="none"
              stroke="hsl(var(--primary))" strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - progressPercent / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-lg">
            {progressPercent}%
          </span>
        </div>
        <div>
          <h4 className="font-display font-bold">
            {currentLevelData?.name} → {targetLevelData?.name}
          </h4>
          <p className="text-sm text-muted-foreground">
            {completedSkills.length} of {skills.length} target skills completed
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Track: {careerTrack === 'ic' ? 'Individual Contributor' : careerTrack === 'dept-lead' ? 'Department Lead' : careerTrack === 'manager' ? 'Manager' : 'Group Manager'}
          </p>
        </div>
      </div>

      {/* Priority Skills to Focus */}
      <div>
        <h4 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Priority Focus Areas
        </h4>
        <div className="space-y-3">
          {prioritySkills.map((skillName) => {
            const strategies = growthStrategies[skillName];
            if (!strategies) return null;
            const strategy = strategies[0];
            return (
              <motion.div
                key={skillName}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-xl bg-background/50 border border-border p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <strategy.icon className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">{strategy.title}</span>
                </div>
                <ul className="space-y-1">
                  {strategy.actions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <ArrowRight className="w-3 h-3 mt-0.5 text-accent shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recommended Resources */}
      <div>
        <h4 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-accent" />
          Recommended Resources
        </h4>
        <div className="space-y-2">
          {[
            { title: "The First 90 Days", author: "Michael Watkins", for: "Level transitions" },
            { title: "Radical Candor", author: "Kim Scott", for: "Communication & Leadership" },
            { title: "Measure What Matters", author: "John Doerr", for: "Planning & Impact" },
          ].map((book, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-lg bg-background/50 border border-border p-3">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-accent" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{book.title}</p>
                <p className="text-xs text-muted-foreground">{book.author} · {book.for}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
