import { cn } from "@/lib/utils";
import { Shield, Users, User } from "lucide-react";

const roleConfig = {
  admin: {
    label: "Admin",
    className: "bg-primary/10 text-primary border-primary/20",
    icon: Shield,
  },
  manager: {
    label: "Manager",
    className: "bg-accent/10 text-accent border-accent/20",
    icon: Users,
  },
  employee: {
    label: "Employee",
    className: "bg-secondary text-secondary-foreground border-border",
    icon: User,
  },
};

export function RoleBadge({ role, showIcon = false, className }) {
  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "status-badge border gap-1.5",
        config.className,
        className
      )}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {config.label}
    </span>
  );
}
