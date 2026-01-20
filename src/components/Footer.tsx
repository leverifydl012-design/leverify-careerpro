import { Rocket, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 border-t border-border bg-card/30">
      <div className="container px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Rocket className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">CareerPath</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <a href="#levels" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Levels
            </a>
            <a href="#tracks" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Tracks
            </a>
            <a href="#skills" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Skills
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-destructive fill-destructive" /> for career growth
          </p>
        </div>
      </div>
    </footer>
  );
}
