  import { ManagerLayout } from "@/components/layouts/ManagerLayout";
  import { PageHeader } from "@/components/shared/PageHeader";
  import { KPICard } from "@/components/shared/KPICard";
  import { StatusBadge } from "@/components/shared/StatusBadge";
  import {
    FileText,
    AlertTriangle,
    Clock,
    CheckCircle,
    ArrowRight,
  } from "lucide-react";
  import { Link } from "react-router-dom";
  import { Button } from "@/components/ui/button";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import api from "../../api/axiosInstance";
  import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
  } from "recharts";




  export default function ManagerDashboard() {
    const [pendingReports, setPendingReports] = useState([]);
    const [openHazards, setOpenHazards] = useState([]);
    const [overdueActions, setOverdueActions] = useState([]);
    const [resolvedThisWeek, setResolvedThisWeek] = useState(0);
    const [actions, setActions] = useState([]);
    const [actionsByEmployee, setActionsByEmployee] = useState([]);
    const [hazardsSummary, setHazardsSummary] = useState([]);
    const [notifications, setNotifications] = useState([]);



    useEffect(() => {
      fetchPendingReports();
      fetchOpenHazards();
      fetchActions();

    fetchActionsByEmployeeChart();
    fetchHazardsSummaryChart();
    fetchNotifications();
    }, []);

  const fetchActionsByEmployeeChart = async () => {
    try {
      const res = await api.get("/charts/actions-by-employee", {
        withCredentials: true
      });

      setActionsByEmployee(res.data.data || []);
    } catch (err) {
      console.error("Actions by employee chart error", err);
    }
  };

  const fetchHazardsSummaryChart = async () => {
    try {
      const res = await api.get("/charts/hazards-summary", {
        withCredentials: true
      });

      setHazardsSummary(res.data.data || []);
    } catch (err) {
      console.error("Hazards summary chart error", err);
    }
  };




  //Pending reports
    const fetchPendingReports = async () => {
    try {
      const res = await api.get('/report/all', { withCredentials: true });
      const reportsArray = res.data.data || []; //access array inside object
      const pending = reportsArray.filter(
        (r) => r.status && r.status.toLowerCase().includes("pending")
      );
      const mapped = pending.slice(0, 4).map((r) => ({
        reportedBy: r.reportedBy?.name || "Unknown",
        priority: r.priority.toLowerCase(),
        title: r.reportTitle || "No Title",
        submitted: timeAgo(r.createdAt),
      }));
      // console.log("Pending Reports to set:", mapped);
      setPendingReports(mapped);
    } catch (err) {
      console.error("Pending reports error", err);
    }
  };


  //Open Hazard
    const fetchOpenHazards = async () => {
    try {
      const res = await api.get('/hazard/get', { withCredentials: true });
      const hazardsArray = res.data.data || []; // access array inside object
      const open = hazardsArray.filter((h) => h.status === 'Open' || h.status === 'open');
      const mapped = open.slice(0, 4).map((h) => ({
        id: h.hazardId || h._id,
        riskLevel: h.riskLevel || "Low",
        title: h.hazardTitle || "No Title",
        daysOpen: daysBetween(h.createdAt),
      }));
      // console.log("Open Hazards to set:", mapped);
      setOpenHazards(mapped);
    } catch (err) {
      console.error("Open hazards error", err);
    }
  };

  //Delayed Actions
  const fetchActions=async()=>{
    try{
      const res = await api.get("/action/getOutdatedAction",{ withCredentials: true });
      setOverdueActions(res.data.data);
    }catch(err){
      console.error(err);
    }
  }

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


    //Helpers
    const daysBetween = (date) => {
      const diff = Date.now() - new Date(date).getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    };

    const timeAgo = (date) => {
      const hours = Math.floor(
        (Date.now() - new Date(date)) / (1000 * 60 * 60)
      );
      return `${hours} hours ago`;
    };

    const isThisWeek = (date) => {
      const now = new Date();
      const startOfWeek = new Date(
        now.setDate(now.getDate() - now.getDay())
      );
      return date >= startOfWeek;
    };


    return (
      <ManagerLayout>
        <PageHeader
          title="Manager Dashboard"
          subtitle="Overview of your safety management responsibilities"
          notifications={notifications}
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Link to="/manager/reports"><KPICard
            title="New Reports"
            value={pendingReports.length}
            subtitle="Pending review"
            icon={FileText}
            variant="accent"
          /></Link>
          <Link to="/manager/hazards"><KPICard
            title="Open Hazards"
            value={openHazards.length}
            subtitle="High priority"
            icon={AlertTriangle}
            variant="warning"
          /></Link>
          <Link to="/manager/actions"><KPICard
            title="Overdue Actions"
            value={overdueActions.length}
            subtitle="Needs attention"
            icon={Clock}
            variant="destructive"
          /></Link>
          {/* <KPICard
            title="Resolved This Week"
            value={resolvedThisWeek}
            subtitle="Great progress!"
            icon={CheckCircle}
          /> */}
        </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    
              {/* Actions by Employee */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Actions Completed by Employee
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={actionsByEmployee}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                    <XAxis dataKey="name" stroke="#A1A1AA" />
                    <YAxis stroke="#A1A1AA" />
                    <Tooltip />

                    <Bar dataKey="completedCount" radius={[6, 6, 0, 0]}>
                      {actionsByEmployee.map((_, index) => (
                        <Cell
                          key={index}
                          fill={["#22C55E", "#0EA5E9", "#6366F1", "#F59E0B"][index % 4]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

                {/* Hazards Summary */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Hazards Summary
                </h3>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hazardsSummary}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                    <XAxis dataKey="status" stroke="#A1A1AA" />
                    <YAxis stroke="#A1A1AA" />
                    <Tooltip />

                    <Bar
                      dataKey="count"
                      fill="#F59E0B"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>



        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Reports */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Pending Reports
              </h3>
              <Link
                to="/manager/reports"
                className="text-sm text-accent hover:text-accent/80 font-medium"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {pendingReports.map((report) => (
                <div
                  key={report.id}
                  className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-muted-foreground">
                      {report.id}
                    </span>
                      <StatusBadge status={report.priority} />
                  </div>
                  <p className="text-sm font-medium text-foreground line-clamp-1">
                    {report.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {report.submitted}
                  </p>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/manager/reports">
                Review Reports
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Open Hazards */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Open Hazards
              </h3>
              <Link
                to="/manager/hazards"
                className="text-sm text-accent hover:text-accent/80 font-medium"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {openHazards.map((hazard) => (
                <div
                  key={hazard.id}
                  className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-muted-foreground">
                      {hazard.id}
                    </span>
                    <StatusBadge status={hazard.riskLevel} />
                  </div>
                  <p className="text-sm font-medium text-foreground line-clamp-1">
                    {hazard.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Open for {hazard.daysOpen} days
                  </p>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/manager/hazards">
                Manage Hazards
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Overdue Actions */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-destructive"  />
                Overdue Actions
              </h3>
              <Link
                to="/manager/actions"
                className="text-sm text-accent hover:text-accent/80 font-medium"
              >
                View all
              </Link>
            </div>

            {overdueActions.length > 0 ? (
              <div className="space-y-3">
                {overdueActions.map((action) => (
                  <div
                    key={action.id}
                    className="p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        {action.actionId}
                      </span>
                      <StatusBadge status="overdue" />
                    </div>
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      {action.title}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        {action.assigneeName}
                      </p>
                      <span className="text-xs text-destructive font-medium">
                        {action.daysOverdue} days overdue
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success" />
                <p className="text-sm">All actions on track!</p>
              </div>
            )}

            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/manager/actions">
                View All Actions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </ManagerLayout>
    );
  }
