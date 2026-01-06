import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, UserPlus, Edit, Trash2, Eye, Settings, LogIn, LogOut, FileText, Shield } from "lucide-react";

const auditLogs = [
  { id: 1, action: "User Created", description: "New user account created for emily.w@company.com", user: "John Doe", userRole: "Admin", timestamp: "Dec 27, 2024 14:32:15", ip: "192.168.1.45", icon: UserPlus, category: "User Management" },
  { id: 2, action: "Report Submitted", description: "Safety report RPT-482 submitted for Warehouse B incident", user: "Mike Johnson", userRole: "Employee", timestamp: "Dec 27, 2024 13:18:42", ip: "192.168.1.112", icon: FileText, category: "Reports" },
  { id: 3, action: "Login Success", description: "User successfully authenticated", user: "Sarah Miller", userRole: "Manager", timestamp: "Dec 27, 2024 09:05:33", ip: "192.168.1.78", icon: LogIn, category: "Authentication" },
  { id: 4, action: "Permission Changed", description: "Role updated from Employee to Manager for robert.c@company.com", user: "John Doe", userRole: "Admin", timestamp: "Dec 26, 2024 16:45:21", ip: "192.168.1.45", icon: Shield, category: "Security" },
  { id: 5, action: "Document Deleted", description: "Removed outdated policy document: Safety_Policy_2023.pdf", user: "John Doe", userRole: "Admin", timestamp: "Dec 26, 2024 11:22:08", ip: "192.168.1.45", icon: Trash2, category: "Documents" },
  { id: 6, action: "Report Updated", description: "Status changed from Open to In Progress for RPT-478", user: "Sarah Miller", userRole: "Manager", timestamp: "Dec 26, 2024 10:15:44", ip: "192.168.1.78", icon: Edit, category: "Reports" },
  { id: 7, action: "Logout", description: "User session ended", user: "Emily Watson", userRole: "Employee", timestamp: "Dec 25, 2024 18:30:12", ip: "192.168.1.95", icon: LogOut, category: "Authentication" },
  { id: 8, action: "Settings Modified", description: "Email notification preferences updated", user: "John Doe", userRole: "Admin", timestamp: "Dec 25, 2024 14:08:55", ip: "192.168.1.45", icon: Settings, category: "System" },
];

export default function AuditLogs() {
  return (
    <AdminLayout>
      <PageHeader
        title="Audit Logs"
        subtitle="Track all system activities and user actions"
        action={
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search logs..." className="pl-10" />
        </div>
        <div className="flex gap-3">
          <Select>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="users">User Management</SelectItem>
              <SelectItem value="reports">Reports</SelectItem>
              <SelectItem value="documents">Documents</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Audit Log Timeline */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="divide-y divide-border">
          {auditLogs.map((log) => {
            const Icon = log.icon;
            return (
              <div key={log.id} className="p-4 sm:p-5 hover:bg-muted/30 transition-colors">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{log.action}</h4>
                        <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                          {log.category}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{log.description}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>
                        By: <span className="font-medium text-foreground">{log.user}</span> ({log.userRole})
                      </span>
                      <span className="hidden sm:inline">IP: {log.ip}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="hidden sm:flex flex-shrink-0">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing 1-8 of 1,247 logs</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
