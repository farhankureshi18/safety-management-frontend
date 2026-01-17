import { useEffect, useState } from "react";
import axios from "axios";
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

export default function ManagerNotifications() {
  const [notifications, setNotifications] = useState([]);

  // icon mapping based on title keywords
  const getIconConfig = (title) => {
    if (title.toLowerCase().includes("hazard"))
      return { icon: AlertTriangle, bg: "bg-destructive/10", color: "text-destructive" };
    if (title.toLowerCase().includes("action"))
      return { icon: CheckCircle, bg: "bg-success/10", color: "text-success" };
    if (title.toLowerCase().includes("report"))
      return { icon: FileText, bg: "bg-info/10", color: "text-info" };
    return { icon: Bell, bg: "bg-muted", color: "text-muted-foreground" };
  };

  // fetch manager notifications
  const fetchNotifications = async () => {
    try {
      const res = await api.get(
        "/notifications/Manager",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err.response?.data);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // mark as read
  const markAsRead = async (id, isRead) => {
    if (isRead) return;

    try {
      await api.put(
        `/notifications/read/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err.response?.data);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <ManagerLayout>
      <PageHeader
        title="Notifications"
        subtitle={`You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
        notifications={notifications}
      />

      {/* Notifications */}
      <div className="bg-card rounded-xl border border-border overflow-hidden divide-y divide-border">
        {notifications.map((n) => {
          const { icon: Icon, bg, color } = getIconConfig(n.title);

          return (
            <div
              key={n._id}
              className={`p-4 sm:p-5 transition-colors ${
                !n.isRead ? "bg-accent/5 cursor-pointer hover:bg-muted/30" : ""
              }`}
              onClick={() => markAsRead(n._id, n.isRead)}
            >
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`font-medium ${!n.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                      {n.title}
                    </h4>

                    <div className="flex items-center gap-2">
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-accent" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {n.description}
                  </p>

                  <div className="mt-2">
                    {n.isRead ? (
                      <span className="text-xs text-green-600 font-medium">
                        ✔ Read
                      </span>
                    ) : (
                      <span className="text-xs text-blue-600">
                        Mark as read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ManagerLayout>
  );
}
