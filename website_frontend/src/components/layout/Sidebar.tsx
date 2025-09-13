import { NavLink, useNavigate } from "react-router-dom";
import { 
  Home, 
  Users, 
  BarChart3, 
  Shield, 
  Settings,
  User,
  Trophy,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Athletes", href: "/athletes", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Verification", href: "/verification", icon: Shield },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Simulate logout
    navigate("/");
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
      <div className="flex h-16 items-center px-6 bg-gradient-primary">
        <h1 className="text-xl font-bold text-white">Sport Score Guard</h1>
      </div>
      
      <nav className="mt-6 px-3">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="mt-8 px-3">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-3"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </nav>
    </div>
  );
};