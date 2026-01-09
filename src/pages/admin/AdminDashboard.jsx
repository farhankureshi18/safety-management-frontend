import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { KPICard } from "@/components/shared/KPICard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Users, FileText, AlertTriangle, CheckCircle, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from "axios";


export default function AdminDashboard() {
  const[reports,setReports]=useState([]);
  const[users,setUsers]=useState(0);
  const[reportCount,setReportCount]=useState(0);
  const[hazardCount,setHazardCount]=useState(0);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    fetchAllReports();
    fetchUsers();
    fetchReports();
    fetchHazard();
    fetchRecentActivity();
  }, []);

   const fetchAllReports=async()=>{
    try{  
      const res=await axios.get('https://safety-management-system-backend.onrender.com/report/all');
      console.log(res.data.data)
      setReports(res.data.data);
    }catch(err){
      console.error(err);
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://safety-management-system-backend.onrender.com/auth/users',{ withCredentials: true });
      //console.log(res.data.totalUsers)
      setUsers(res.data.totalUsers);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const fetchReports=async()=>{
     try {
      const res = await axios.get('https://safety-management-system-backend.onrender.com/report/all',{ withCredentials: true });
      //console.log(res.data.totalUsers)
       setReportCount(res.data.count);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  }

  const fetchHazard=async()=>{
     try {
      const res = await axios.get('https://safety-management-system-backend.onrender.com/hazard/get',{ withCredentials: true });
      const hazard=res.data.data || [];
      const activeCount=hazard.filter((h)=> h.status?.toLowerCase() === 'open').length;
      setHazardCount(activeCount);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  }

  const fetchRecentActivity=async()=>{
    try{
      setLoading(true);
      const res=await axios.get('https://safety-management-system-backend.onrender.com/activity/recent',{withCredentials:true});
      //console.log(res.data)
      if (res.data.success) {
          setActivities(res.data.data); 
        }
      setLoading(false);
    }catch(err){
       console.error("Failed to fetch activities:", err);
       setLoading(false);
    }
  }



  const recentReports = [...reports]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 5);

  return (
    <AdminLayout>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Overview of your safety management system"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <KPICard title="Total Users" value={users} subtitle="12 new this month" icon={Users} />
        <KPICard title="Total Reports" value={reportCount} subtitle="38 pending review" icon={FileText} />
        <KPICard title="Active Hazards" value={hazardCount} subtitle="5 high priority" icon={AlertTriangle} variant="warning" />
        {/* <KPICard title="Resolved This Month" value={67} subtitle="94% resolution rate" icon={CheckCircle} variant="accent" /> */}
      </div>

      {/* Charts and Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Recent Reports</h3>
            <Link to="/admin/reports" className="text-sm text-accent hover:text-accent/80 font-medium">View all</Link>
          </div>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div
                  key={report._id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        {report.reportId || report._id.slice(-6)}
                      </span>
                      <StatusBadge status={report.status} />
                    </div>

                    <p className="text-sm font-medium text-foreground truncate">
                      {report.reportTitle }
                    </p>
                  </div>

                  <span className="text-xs text-muted-foreground ml-4">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
        </div>

        {/* Quick Stats */}
        {/* <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">System Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-sm text-muted-foreground">Reports Processed</span>
                </div>
                <span className="text-sm font-medium text-foreground">98%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-warning" />
                  <span className="text-sm text-muted-foreground">Avg Response Time</span>
                </div>
                <span className="text-sm font-medium text-foreground">4.2 hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-info" />
                  <span className="text-sm text-muted-foreground">User Adoption</span>
                </div>
                <span className="text-sm font-medium text-foreground">87%</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" /> Trending Issues
            </h3>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium text-foreground">PPE Compliance</p>
                <p className="text-muted-foreground text-xs">+15% reports this week</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground">Equipment Maintenance</p>
                <p className="text-muted-foreground text-xs">+8% reports this week</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground">Fire Safety</p>
                <p className="text-muted-foreground text-xs">+3% reports this week</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Activity Timeline */}
      {/* <div className="mt-6 bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" /> Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            { action: "New user registered", user: "Emily Watson", time: "10 minutes ago" },
            { action: "Report #482 closed", user: "System", time: "25 minutes ago" },
            { action: "Hazard escalated to high priority", user: "Safety Manager", time: "1 hour ago" },
            { action: "Corrective action completed", user: "John Smith", time: "2 hours ago" },
          ].map((activity, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-foreground">{activity.action}</p>
                <p className="text-xs text-muted-foreground">by {activity.user} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div> */}

   <div className="mt-6 bg-card rounded-xl border border-border p-6">
    <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
      <Clock className="w-5 h-5 text-muted-foreground" /> Recent Activity
    </h3>

    {loading ? (
      <p className="text-sm text-muted-foreground">Loading...</p>
    ) : (
      <div className="space-y-4">
        {activities.map((activity) => {
          const timeAgo = new Date(activity.createdAt).toLocaleString(); // you can replace with fancy time ago
          return (
            <div key={activity._id} className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground">
                  by {activity.performedBy?.name || "System"} • {timeAgo}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
    </AdminLayout>
  );
}
