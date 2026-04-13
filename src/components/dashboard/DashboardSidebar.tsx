import { 
  LayoutDashboard, Target, Sparkles, TrendingUp, Trophy,
  BookOpen, MessageSquare, Settings, LogOut, Home, GitCompare, HelpCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "skills", label: "My Skills", icon: Sparkles },
  { id: "roadmap", label: "Career Roadmap", icon: TrendingUp },
  { id: "goals", label: "Goals & Milestones", icon: Target },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "coach", label: "AI Career Coach", icon: MessageSquare, highlight: true },
  { id: "growth", label: "Growth Insights", icon: BookOpen },
];

const quickLinks = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Compare Levels", icon: GitCompare, path: "/compare" },
  { label: "Self Assessment", icon: HelpCircle, path: "/quiz" },
];

export function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card/30 flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg">CareerPath</span>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Dashboard</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              activeTab === item.id
                ? "bg-primary/15 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            } ${item.highlight ? "relative" : ""}`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
            {item.highlight && (
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium">AI</span>
            )}
          </button>
        ))}

        <div className="pt-4 mt-4 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Quick Links</p>
          {quickLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              <link.icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Sign Out */}
      <div className="p-3 border-t border-border">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
