import { ManagerLayout } from "@/components/layouts/ManagerLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Bell,
  AlertTriangle,
  FileText,
  CheckCircle,
  Clock,
  Settings,
  Check,
  X,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "report",
    title: "New Safety Report Submitted",
    message: "Mike Johnson submitted a new safety report for review: Chemical spill near loading dock.",
    time: "10 minutes ago",
    isRead: false,
    icon: FileText,
    iconColor: "text-info",
    iconBg: "bg-info/10",
  },
  {
    id: 2,
    type: "hazard",
    title: "High-Risk Hazard Escalated",
    message: "Hazard HZD-012 has been escalated to high risk. Immediate action required.",
    time: "1 hour ago",
    isRead: false,
    icon: AlertTriangle,
    iconColor: "text-destructive",
    iconBg: "bg-destructive/10",
  },
  {
    id: 3,
    type: "action",
    title: "Corrective Action Overdue",
    message: "Action ACT-049 (Repair chemical containment basin) is now overdue by 2 days.",
    time: "2 hours ago",
    isRead: false,
    icon: Clock,
    iconColor: "text-warning",
    iconBg: "bg-warning/10",
  },
  {
    id: 4,
    type: "action",
    title: "Action Completed",
    message: "Sarah Miller marked ACT-046 (Safety training for new equipment) as complete.",
    time: "5 hours ago",
    isRead: true,
    icon: CheckCircle,
    iconColor: "text-success",
    iconBg: "bg-success/10",
  },
  {
    id: 5,
    type: "report",
    title: "Report Requires Attention",
    message: "RPT-477 has been pending review for more than 24 hours.",
    time: "1 day ago",
    isRead: true,
    icon: Bell,
    iconColor: "text-muted-foreground",
    iconBg: "bg-muted",
  },
  {
    id: 6,
    type: "system",
    title: "Weekly Safety Summary Available",
    message: "Your weekly safety performance summary is ready for review.",
    time: "2 days ago",
    isRead: true,
    icon: FileText,
    iconColor: "text-accent",
    iconBg: "bg-accent/10",
  },
];

export default function ManagerNotifications() {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <ManagerLayout>
      <PageHeader
        title="Notifications"
        subtitle={`You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
        action={
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        }
      />

      {/* Quick Actions */}
      <div className="mb-6 flex items-center gap-3">
        <Button variant="outline" size="sm">
          <Check className="w-4 h-4 mr-2" />
          Mark All Read
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <X className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Notifications List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <div
              key={notification.id}
              className={`p-4 sm:p-5 hover:bg-muted/30 transition-colors cursor-pointer ${
                !notification.isRead ? "bg-accent/5" : ""
              }`}
            >
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${notification.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${notification.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`font-medium ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.isRead && (
                        <span className="w-2 h-2 rounded-full bg-accent" />
                      )}
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      <div className="mt-6 text-center">
        <Button variant="outline">Load More</Button>
      </div>
    </ManagerLayout>
  );
}
