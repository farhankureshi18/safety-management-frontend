import { EmployeeLayout } from "@/components/layouts/EmployeeLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Bell, FileText, CheckCircle } from "lucide-react";

const notifications = [
  { id: 1, title: "Report Reviewed", message: "Your report RPT-475 is now being processed.", time: "2 hours ago", icon: FileText, read: false },
  { id: 2, title: "Action Assigned", message: "You have been assigned a new corrective action.", time: "1 day ago", icon: CheckCircle, read: false },
  { id: 3, title: "Report Resolved", message: "RPT-470 has been marked as resolved.", time: "3 days ago", icon: Bell, read: true },
];

export default function EmployeeNotifications() {
  return (
    <EmployeeLayout>
      <PageHeader title="Notifications" subtitle="Stay updated on your reports and actions" />
      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div key={n.id} className={`p-4 flex gap-4 ${!n.read ? "bg-accent/5" : ""}`}>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">{n.title}</h4>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{n.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </EmployeeLayout>
  );
}
