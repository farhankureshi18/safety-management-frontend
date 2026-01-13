import { EmployeeLayout } from "@/components/layouts/EmployeeLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { KPICard } from "@/components/shared/KPICard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FileText, CheckSquare, Bell, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance";





export default function EmployeeDashboard() {
  const[reports,setReports]=useState([]);
  const[actions,setActions]=useState([]);
  const[loading,setLoading]=useState(false);

   useEffect(()=>{
    fetchDashBoardData();
  },[])

  const fetchDashBoardData = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token"); 
    if (!token) throw new Error("No token found");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const reportRes = await api.get('/report/getById/me', config);
    const actionRes = await api.get('/action/getById/me', config);
    setReports(Array.isArray(reportRes.data) ? reportRes.data : []);
    setActions(Array.isArray(actionRes.data) ? actionRes.data : []);
  } catch (err) {
    console.error("Dashboard fetch error:", err);
  } finally {
    setLoading(false);
  }
};



  const pendingActions=actions.filter((a)=>a.status === "In Progress" || a.status === 'Pending');

    if (loading) {
  return (
    <EmployeeLayout>
      <p className="text-center mt-20 text-muted-foreground">
        Loading dashboard...
      </p>
    </EmployeeLayout>
  )
}
  

  return (
    <EmployeeLayout>
      <PageHeader
        title="My Dashboard"
        subtitle="Your safety overview and assigned tasks"
        action={
          <Button asChild>
            <Link to="/employee/submit-report">
              <Plus className="w-4 h-4 mr-2" />
              New Report
            </Link>
          </Button>
        }
      />
     

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <KPICard
          title="My Reports"
          value={reports.length}
          subtitle={`${reports.filter(r => r.status === "Pending").length} pending`}
          icon={FileText}
        />

        <KPICard title="My Actions" value={actions.length} subtitle={`${pendingActions.length} in progress`} icon={CheckSquare} variant="warning" />
        <KPICard title="Pending Actions" value={pendingActions.length} subtitle="Need attention" icon={Bell} variant="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">My Recent Reports</h3>
          <div className="space-y-3">
            {reports.map((r)=>(
               <div key={r._id}  className="p-3 rounded-lg bg-muted/30 flex justify-between">
                  <div>
                    <p className="text-sm font-medium"> {r.reportTitle}</p>
                    <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
               </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-4">My Assigned Actions</h3>
          <div className="space-y-3">
            {actions.map((a)=>(
              <div key={a._id} className="p-3 rounded-lg bg-muted/30 flex justify-between">
                 <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Due: {a.dueDate
                      ? new Date(a.dueDate).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
 