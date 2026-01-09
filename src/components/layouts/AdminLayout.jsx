import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  AlertTriangle,
  FolderOpen,
  ClipboardList,
  Menu,
  X,  
  Shield,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";



const adminNavItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/users", label: "User Management", icon: Users },
  { path: "/admin/reports", label: "All Reports", icon: FileText },
  { path: "/admin/hazards", label: "Hazards Overview", icon: AlertTriangle },
  { path: "/admin/documents", label: "Documents", icon: FolderOpen },
  // { path: "/admin/audit-logs", label: "Audit Logs", icon: ClipboardList },
];

export function AdminLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);     //return user from /auth/me

  const location = useLocation();
  const navigate=useNavigate();

  const isActivePath = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get("https://safety-management-system-backend.onrender.com/auth/me", {
        withCredentials: true
      });
      setUser(res.data.user);
    } catch (error) {
      console.error("Failed to fetch user info", error);
    }
  };

  const handleLogout = () => {
  toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">
          Are you sure you want to logout?
        </p>
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => toast.dismiss(t)}
            className="px-3 py-1 text-sm rounded-md border">
            Cancel
          </Button>
          <Button onClick={async () => {
              try {
                await axios.post(
                  "https://safety-management-system-backend.onrender.com/auth/logout",
                  {},
                  { withCredentials: true }
                );
                toast.dismiss(t);
                navigate("/login", { replace: true });
              } catch (error) {
                toast.error("Logout failed");
                console.error("Logout failed", error);
              }
            }}
            className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700" >
            Logout
          </Button>
        </div>
      </div>
    ),
    {
      duration: Infinity, 
    }
  );
};

  useEffect(()=>{
    fetchUser();
  },[])

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-sidebar-foreground">SafetyMS</h2>
            <p className="text-xs text-sidebar-muted">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn("nav-link group", isActive && "nav-link-active")}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <ChevronRight className="w-4 h-4 text-sidebar-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-9 h-9 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-foreground">
              {user ? user.name.split(" ").map(n => n[0]).join("") : "??"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user ? user.name : "Loading..."}
            </p>
            <p className="text-xs text-sidebar-muted truncate">
              {user ? (user.role === "admin" ? "Administrator" :
                      user.role === "manager" ? "Manager" :
                      "Employee") : "Loading..."} 
            </p>
          </div>
        <Button variant="ghost" onClick={handleLogout}
          size="icon" className="text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent" asChild >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

    </>
  );

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-sidebar border-r border-sidebar-border">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-40 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(true)}
          className="mr-4"
        >
          <Menu className="w-6 h-6" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">SafetyMS</span>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-over Menu */}
      <aside
        className={cn(
          "lg:hidden fixed inset-y-0 left-0 w-72 bg-sidebar z-50 flex flex-col transform transition-transform duration-300 ease-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <X className="w-5 h-5" />
        </Button>
        <NavContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64">
        <div className="pt-20 lg:pt-8 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
