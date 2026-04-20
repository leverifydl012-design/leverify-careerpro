import { 
  LayoutDashboard, Target, Sparkles, TrendingUp,
  MessageSquare, LogOut, Home, GitCompare, HelpCircle,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import logoImg from "@/assets/logo.png";

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, description: "Your career snapshot" },
  { id: "skills", label: "My Skills", icon: Sparkles, description: "Track skill progress" },
  { id: "roadmap", label: "Career Roadmap", icon: TrendingUp, description: "Visualize your path" },
  { id: "goals", label: "Personal Development", icon: Target, description: "Set & track goals" },
  { id: "coach", label: "AI Career Coach", icon: MessageSquare, highlight: true, description: "Get AI advice" },
];

const quickLinks = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Compare Levels", icon: GitCompare, path: "/compare" },
  { label: "Self Assessment", icon: HelpCircle, path: "/quiz" },
];

export function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${collapsed ? 'w-[72px]' : 'w-64'} shrink-0 border-r border-border bg-sidebar-background flex flex-col h-full transition-all duration-300`}>
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <img src={logoImg} alt="Leverify" className="h-8 w-auto shrink-0" />
          {!collapsed && <span className="font-display font-bold text-lg whitespace-nowrap">Leverify CareerPro</span>}
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className="w-7 h-7 rounded-lg hover:bg-muted/50 flex items-center justify-center text-muted-foreground shrink-0">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Level indicator */}
      {!collapsed && (
        <div className="mx-3 mt-3 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Current Level</p>
          <p className="font-display font-bold text-sm text-primary">Level {profile?.current_level || 1}</p>
          <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${((profile?.current_level || 1) / 5) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Main Menu */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {!collapsed && <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2 mt-1">Dashboard</p>}
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            title={collapsed ? item.label : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
              activeTab === item.id
                ? "bg-primary/15 text-primary font-medium shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
            } ${item.highlight ? "relative" : ""}`}
          >
            <item.icon className={`w-4 h-4 shrink-0 ${activeTab === item.id ? 'text-primary' : 'group-hover:text-foreground'}`} />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.highlight && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium">AI</span>
                )}
              </>
            )}
          </button>
        ))}

        <div className={`pt-3 mt-3 border-t border-border ${collapsed ? '' : ''}`}>
          {!collapsed && <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Quick Links</p>}
          {quickLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              title={collapsed ? link.label : undefined}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
            >
              <link.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </button>
          ))}
        </div>
      </nav>

      {/* Sign Out */}
      <div className="p-3 border-t border-border">
        <button
          onClick={signOut}
          title={collapsed ? 'Sign Out' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
