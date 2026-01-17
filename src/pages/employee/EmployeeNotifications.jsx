import { useEffect, useState } from "react";
import axios from "axios";
import { EmployeeLayout } from "@/components/layouts/EmployeeLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Bell, FileText, CheckCircle } from "lucide-react";
import api from "../../api/axiosInstance";

export default function EmployeeNotifications() {
  const [notifications, setNotifications] = useState([]);

  // icon mapping based on title
  const getIcon = (title) => {
    if (title.toLowerCase().includes("action")) return CheckCircle;
    if (title.toLowerCase().includes("report")) return FileText;
    return Bell;
  };

  // fetch employee notifications
  const fetchNotifications = async () => {
    try {
      const res = await api.get(
        "/notifications/Employee",
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

  // mark notification as read
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
      console.error(
        "Error marking notification as read:",
        err.response?.data || err.message
      );
    }
  };

  

  return (
    <EmployeeLayout>
      <PageHeader
        title="Notifications"
        subtitle="Stay updated on your reports and actions"
        notifications={notifications}  
      />

      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        {notifications.map((n) => {
          const Icon = getIcon(n.title);

          return (
            <div
              key={n._id}
              className={`p-4 flex gap-4 ${
                !n.isRead ? "bg-accent/5 cursor-pointer" : ""
              }`}
              onClick={() => markAsRead(n._id, n.isRead)}
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">{n.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
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
          );
        })}
      </div>
    </EmployeeLayout>
  );
}
