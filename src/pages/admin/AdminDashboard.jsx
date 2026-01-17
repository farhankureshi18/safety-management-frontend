import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { KPICard } from "@/components/shared/KPICard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Users, FileText, AlertTriangle, CheckCircle, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from "axios";
import api from '../../api/axiosInstance'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";



export default function AdminDashboard() {
  const[reports,setReports]=useState([]);
  const[users,setUsers]=useState([]);
  const[userCount,setUserCount]=useState(0);
  const[reportCount,setReportCount]=useState(0);
  const[hazardCount,setHazardCount]=useState(0);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docCount, setDocCount] = useState(0);
  const[trendingIssue,setTrendingIssue]=useState([]);

  const [reportsChart, setReportsChart] = useState([]);
  const [actionsChart, setActionsChart] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchAllReports();
    fetchUsers();
    fetchReports();
    fetchHazard();
    fetchRecentActivity();
    fetchDocCounts();
    getTrendIssue();
    fetchCharts();
  }, []);

   const fetchReportsChart = async () => {
  try {
    const res = await api.get("/charts/reports-monthly", {
      withCredentials: true,
    });

    const formatted = res.data.data.map(item => ({
      month: item.month,
      value: item.count
    }));

    setReportsChart(formatted);
  } catch (err) {
    console.error("Reports chart error", err);
  }
};

  const fetchActionsChart = async () => {
  try {
    const res = await api.get("/charts/actions-by-employee", {
      withCredentials: true,
    });
    const formatted = res.data.data.map(item => ({
      name: item.name,
      value: item.completedCount
    }));
    setActionsChart(formatted);
  } catch (err) {
    console.error("Actions chart error", err);
  }
};

  const fetchCharts = async () => {
    setChartLoading(true);
    await Promise.all([fetchReportsChart(), fetchActionsChart()]);
    setChartLoading(false);
  };


   const fetchAllReports=async()=>{
    try{  
      const res=await api.get('/report/all');
      console.log(res.data.data)
      setReports(res.data.data);
    }catch(err){
      console.error(err);
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users',{ withCredentials: true });
      //console.log(res.data.totalUsers)
      setUserCount(res.data.totalUsers); //count of users
      setUsers(res.data.users) //in array
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const fetchReports=async()=>{
     try {
      const res = await api.get('/report/all',{ withCredentials: true });
      //console.log(res.data.totalUsers)
       setReportCount(res.data.count);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  }

  const fetchHazard=async()=>{
     try {
      const res = await api.get('/hazard/get',{ withCredentials: true });
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
      const res=await api.get('/activity/recent',{withCredentials:true});
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


  const fetchDocCounts = async () => {
    try {
      const res = await api.get("/documents/getAllDocuments", { withCredentials: true });
      setDocCount(res.data.totalDocuments);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch documents count");
    }
  };

  
  const getTrendIssue = async () => {
  try {
    const res = await api.get("/hazard/trendingIssue", {
      withCredentials: true,
    });

    if (res.data.success) {
      setTrendingIssue(res.data.data);
    }
  } catch (err) {
    console.error("Failed to fetch trending issues", err);
  }
};

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



  const recentReports = [...reports]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 5);

const recentUsers = users
  .slice()
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 5);


  return (
    <AdminLayout>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Overview of your safety management system"
         notifications={notifications}  
      />


      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/admin/users"><KPICard title="Total Users" value={userCount} subtitle="12 new this month" icon={Users} /></Link>
        <Link to="/admin/reports"><KPICard title="Total Reports" value={reportCount} subtitle="38 pending review" icon={FileText}/></Link>
        <Link to="/admin/hazards"><KPICard title="Active Hazards" value={hazardCount} subtitle="5 high priority" icon={AlertTriangle} variant="warning" /></Link>
        <Link to="/admin/documents"><KPICard title="Documents Uploaded" value={docCount} subtitle="2 Important Docs" icon={CheckCircle} variant="accent"/> </Link>
      </div>


      {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Reports Monthly Chart */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">
              Reports Per Month
            </h3>

            {chartLoading ? (
              <p className="text-sm text-muted-foreground">Loading chart...</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Actions by Employee Chart */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">
              Completed Actions by Employee
            </h3>

            {chartLoading ? (
              <p className="text-sm text-muted-foreground">Loading chart...</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={actionsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>



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
        <div className="space-y-6">
           <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Recent Users
            </h3>

            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div
                key={user._id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-medium text-foreground capitalize">
                    {user.role}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

         <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" /> Trending Issues
            </h3>

            {trendingIssue.length === 0 ? (
              <p className="text-sm text-muted-foreground">No trending issues</p>
            ) : (
              <div className="space-y-3">
                {trendingIssue.map((issue) => (
                  <div key={issue._id} className="text-sm">
                    <p className="font-medium text-foreground">
                      {issue.hazardTitle}
                    </p>

                    <p className="text-muted-foreground text-xs">
                      Risk: <span className="font-medium">{issue.riskLevel}</span> •
                      Score: {issue.riskScore}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

     
    
    {/* Recent Activity */}
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
