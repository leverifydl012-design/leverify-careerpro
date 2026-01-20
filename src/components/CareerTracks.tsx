import { motion } from "framer-motion";
import { careerTracks } from "@/data/careerData";
import { Users, User, Briefcase, Building2, ArrowRight } from "lucide-react";

const trackIcons = {
  "ic": User,
  "dept-lead": Briefcase,
  "manager": Users,
  "group-manager": Building2,
};

const trackGradients = {
  "ic": "from-level-1 to-level-2",
  "dept-lead": "from-level-2 to-level-3",
  "manager": "from-level-4 to-level-5",
  "group-manager": "from-secondary to-primary",
};

export function CareerTracks() {
  return (
    <section id="tracks" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl" />
      
      <div className="container relative z-10 px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <ArrowRight className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Career Paths</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Choose Your <span className="gradient-text">Track</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Different paths for different ambitions - find the one that fits your goals
          </p>
        </motion.div>

        {/* Track Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {careerTracks.map((track, index) => {
            const Icon = trackIcons[track.id as keyof typeof trackIcons];
            const gradient = trackGradients[track.id as keyof typeof trackGradients];

            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="relative h-full glass rounded-3xl p-6 overflow-hidden">
                  {/* Gradient Glow */}
                  <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity`} />
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-display font-bold mb-2">{track.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{track.description}</p>

                  {/* Levels */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Available Levels
                    </div>
                    <div className="flex gap-2">
                      {track.levels.map((level) => (
                        <span
                          key={level}
                          className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold"
                        >
                          {level}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="mt-6 h-1 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(track.levels.length / 5) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className={`h-full bg-gradient-to-r ${gradient}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
