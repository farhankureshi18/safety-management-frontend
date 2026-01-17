import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { Bell, FileText, CheckCircle } from "lucide-react";
import axios from 'axios'
import api from "../../api/axiosInstance";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);

  // Map icons to notification types
  const iconMap = {
    "Report Reviewed": FileText,
    "Action Assigned": CheckCircle,
    "Report Resolved": Bell,
  };

  // Fetch notifications for Admin
   const fetchNotifications = async () => {
    try {
      const res = await api.get(
        "/notifications/Admin",
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

  // Mark notification as read
const markAsRead = async (id, isRead) => {
  if (isRead) return; // prevent duplicate calls

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
      "Error marking as read:",
      err.response?.data || err.message
    );
  }
};


  return (
    <AdminLayout>
      <PageHeader title="Notifications" 
      subtitle="Stay updated on your reports and actions" 
      notifications={notifications}   
      />
      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        {notifications.map((n) => {
          const Icon = iconMap[n.title] || Bell; // fallback icon
          return (
        <div
          key={n._id}
          className={`p-4 flex gap-4 ${
            !n.isRead ? "bg-accent/5" : ""
          }`}
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

            <p className="text-sm text-muted-foreground">{n.description}</p>

            <div className="mt-2">
              {n.isRead ? (
                <span className="text-xs text-green-600 font-medium">
                  ✔ Read
                </span>
              ) : (
                <button
                  onClick={() => markAsRead(n._id, n.isRead)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
