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






export default function ManagerDashboard() {
  const [pendingReports, setPendingReports] = useState([]);
  const [openHazards, setOpenHazards] = useState([]);
  const [overdueActions, setOverdueActions] = useState([]);
  const [resolvedThisWeek, setResolvedThisWeek] = useState(0);
   const [actions, setActions] = useState([]);

  useEffect(() => {
    fetchPendingReports();
    fetchOpenHazards();
    fetchActions();
  }, []);

//Pending reports
  const fetchPendingReports = async () => {
  try {
    const res = await axios.get('https://safety-management-system-backend.onrender.com/report/all', { withCredentials: true });
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
    const res = await axios.get('https://safety-management-system-backend.onrender.com/hazard/get', { withCredentials: true });
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
    const res = await axios.get("https://safety-management-system-backend.onrender.com/action/getOutdatedAction",{ withCredentials: true });
    setOverdueActions(res.data.data);
  }catch(err){
    console.error(err);
  }
}

//resolve this week
// const resolveActionInWeek=async()=>{
//   try{
//     const res = await axios.get("https://safety-management-system-backend.onrender.com/actions", { withCredentials: true });
//     const actionsData = res.data.data || [];
//     setActions(actionsData);
//     const count = calculateResolvedThisWeek(actionsData);
//     setResolvedThisWeek(count);
//   }catch(err){
//      console.error("Error fetching resolved actions:", err);
//   }
// }


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
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <KPICard
          title="New Reports"
          value={pendingReports.length}
          subtitle="Pending review"
          icon={FileText}
          variant="accent"
        />
        <KPICard
          title="Open Hazards"
          value={openHazards.length}
          subtitle="High priority"
          icon={AlertTriangle}
          variant="warning"
        />
        <KPICard
          title="Overdue Actions"
          value={overdueActions.length}
          subtitle="Needs attention"
          icon={Clock}
          variant="destructive"
        />
        {/* <KPICard
          title="Resolved This Week"
          value={resolvedThisWeek}
          subtitle="Great progress!"
          icon={CheckCircle}
        /> */}
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
