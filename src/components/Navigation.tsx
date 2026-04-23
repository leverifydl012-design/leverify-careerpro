import { motion } from "framer-motion";
import { Menu, X, User, LogOut, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.png";

const navItems = [
  { label: "Levels", href: "#levels" },
  { label: "Roles", href: "#tracks" },
  { label: "Skills", href: "#skills" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 glass"
    >
      <div className="container px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logoImg} alt="Career Progression" className="h-9 w-auto" />
            <span className="font-display font-bold text-lg">Career Progression</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Link to="/compare" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Compare
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="gap-2">
                  <User className="w-4 h-4" />
                  Dashboard
                </Button>
                <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate('/auth')} className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border"
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/compare"
              onClick={() => setIsOpen(false)}
              className="block py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Compare Levels
            </Link>
            <div className="pt-4 mt-4 border-t border-border">
              {user ? (
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { navigate('/dashboard'); setIsOpen(false); }}>
                    Dashboard
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => { signOut(); setIsOpen(false); }}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button className="w-full" onClick={() => { navigate('/auth'); setIsOpen(false); }}>
                  Sign In / Sign Up
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
