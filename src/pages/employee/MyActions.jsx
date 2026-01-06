import { useEffect, useState } from "react";
import axios from "axios";

import { EmployeeLayout } from "@/components/layouts/EmployeeLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar,Loader } from "lucide-react";

export default function MyActions() {
  const [actions, setActions] = useState([]);
  const[loadingId,setLoadingId]=useState([]);

  useEffect(() => {
    fetchMyActions();
  }, []);

  const fetchMyActions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/action/get",
        {
          withCredentials: true, //to sent cookie from browser
        }
      );

      setActions(res.data.actions);
    } catch (error) {
      console.error("Error fetching actions:", error);
    }
  };

  const updateStatus=async(id,status)=>{
    try{
      setLoadingId((prev)=>[...prev,id]);
      await axios.patch(`http://localhost:5000/action/updstatus/${id}`,{status},{withCredentials:true});
      setActions((prev) =>
      prev.map((action) =>
        action._id === id ? { ...action, status } : action
      )
    );
    }catch(err){
      console.error("Failed to update status:", error);
    } finally {
    setLoadingId((prev) => prev.filter((lid) => lid !== id)); // stop loading
  }
  }

  return (
    <EmployeeLayout>
      <PageHeader
        title="My Actions"
        subtitle="View and complete your assigned tasks"
      />

      <div className="space-y-4">
        {actions.map((action) => (
          <div
            key={action._id}
            className="bg-card rounded-xl border border-border p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    {action.actionId}
                  </span>
                  <StatusBadge status={action.status} />
                </div>

                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {action.description}
                </p>

                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  Due: {new Date(action.dueDate).toLocaleDateString()}
                </span>
              </div>

              
              <div className="flex gap-2 mt-2 sm:mt-0">
              <Button
                size="sm"
                className="bg-success hover:bg-success/90"
                disabled={loadingId.includes(action._id)}
                onClick={() => updateStatus(action._id, "Completed")}
              >
                {loadingId.includes(action._id) && action.status !== "Completed" ? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Completed
              </Button>

              <Button
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700/90"
                disabled={loadingId.includes(action._id)}
                onClick={() => updateStatus(action._id, "In Progress")}
              >
                {loadingId.includes(action._id) && action.status !== "In Progress" ? (
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Loader className="w-4 h-4 mr-2" />
                )}
                In-Progress
              </Button>
            </div>

            </div>
          </div>
        ))}
      </div>
    </EmployeeLayout>
  );
}
