import { motion } from 'framer-motion';
import { skills } from '@/data/careerData';

interface SkillRadarChartProps {
  currentLevel: number;
  targetLevel: number;
}

const proficiencyValue: Record<string, number> = {
  standard: 25,
  effective: 50,
  advanced: 75,
  expert: 100,
};

const levelToKey = (level: number): string => {
  const map: Record<number, string> = { 1: 'standard', 2: 'effective', 3: 'effective', 4: 'advanced', 5: 'expert' };
  return map[level] || 'standard';
};

export default function SkillRadarChart({ currentLevel, targetLevel }: SkillRadarChartProps) {
  const cx = 200, cy = 200, r = 150;
  const n = skills.length;
  const currentKey = levelToKey(currentLevel);
  const targetKey = levelToKey(targetLevel);

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const dist = (value / 100) * r;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const makePolygon = (key: string) =>
    skills.map((_, i) => {
      const pt = getPoint(i, proficiencyValue[key]);
      return `${pt.x},${pt.y}`;
    }).join(' ');

  const gridLevels = [25, 50, 75, 100];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-3xl p-6"
    >
      <h3 className="text-lg font-display font-bold mb-4 text-center">Skill Radar Overview</h3>
      <div className="flex justify-center">
        <svg viewBox="0 0 400 400" className="w-full max-w-[360px]">
          {/* Grid */}
          {gridLevels.map(level => (
            <polygon
              key={level}
              points={skills.map((_, i) => {
                const pt = getPoint(i, level);
                return `${pt.x},${pt.y}`;
              }).join(' ')}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
              opacity="0.5"
            />
          ))}

          {/* Axis lines */}
          {skills.map((_, i) => {
            const pt = getPoint(i, 100);
            return <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />;
          })}

          {/* Target polygon */}
          <motion.polygon
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            points={makePolygon(targetKey)}
            fill="hsl(var(--primary) / 0.15)"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeDasharray="6 3"
          />

          {/* Current polygon */}
          <motion.polygon
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            points={makePolygon(currentKey)}
            fill="hsl(var(--secondary) / 0.2)"
            stroke="hsl(var(--secondary))"
            strokeWidth="2"
          />

          {/* Labels */}
          {skills.map((skill, i) => {
            const pt = getPoint(i, 120);
            return (
              <text
                key={skill.name}
                x={pt.x}
                y={pt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="hsl(var(--muted-foreground))"
                fontSize="10"
                fontFamily="Space Grotesk"
              >
                {skill.name}
              </text>
            );
          })}

          {/* Dots */}
          {skills.map((_, i) => {
            const ptC = getPoint(i, proficiencyValue[currentKey]);
            const ptT = getPoint(i, proficiencyValue[targetKey]);
            return (
              <g key={i}>
                <circle cx={ptC.x} cy={ptC.y} r="4" fill="hsl(var(--secondary))" />
                <circle cx={ptT.x} cy={ptT.y} r="4" fill="hsl(var(--primary))" />
              </g>
            );
          })}
        </svg>
      </div>
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary" /> Current</span>
        <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary" /> Target</span>
      </div>
    </motion.div>
  );
}
