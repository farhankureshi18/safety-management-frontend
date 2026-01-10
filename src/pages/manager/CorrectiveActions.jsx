import { ManagerLayout } from "@/components/layouts/ManagerLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, User, Plus, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import AddActionPage from "./AddActionPage";
import axios from "axios";
import api from "../../api/axiosInstance";


const getStatusUI = (status) => {
  switch (status) {
    case "Completed":
      return (
        <div className="flex items-center gap-1.5 text-success font-medium">
          <CheckCircle className="w-5 h-5" />
        </div>
      );
    case "Rejected":
      return (
        <div className="flex items-center gap-1.5 text-destructive font-medium">
          <AlertCircle className="w-5 h-5" />
        </div>
      );
    case "In Progress":
      return (
        <div className="flex items-center gap-1.5 text-warning font-medium">
          <Clock className="w-5 h-5" />
        </div>
      );
    case "Pending":
    default:
      return (
        <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
          <Clock className="w-5 h-5" />
        </div>
      );
  }
};

const progressMap = {
  Pending: 20,
  "In Progress": 60,
  Completed: 100,
  Rejected: 0,
};

export default function CorrectiveActions() {
  const [showActionPage, setShowActionPage] = useState(false);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [loadingEmp, setLoadingEmp] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterEmployee, setFilterEmployee] = useState("all");

  // Fetch all actions
  const fetchActions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/action/getAllAction");
      setActions(res.data.data);
    } catch (error) {
      console.error("Error fetching actions", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all employees for the dropdown
  const fetchEmployees = async () => {
    try {
      setLoadingEmp(true);
      const res = await api.get("/hazard/getAllEmp");
      setEmployees(res.data.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    } finally {
      setLoadingEmp(false);
    }
  };

  // Delete action
  const handleDelete = async (id) => {
    try {
      await api.delete(`/action/delete/${id}`);
      setActions((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // Search action by title
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchText(value);

    // Reset filters when searching
    setFilterStatus("all");
    setFilterEmployee("all");

    try {
      if (value.trim() === "") {
        fetchActions();
        return;
      }
      const res = await api.get(`/action/search?title=${value}`);
      setActions(res.data.data);
    } catch (err) {
      console.error("Error searching actions", err);
    }
  };

  // Apply filters (status + assigned employee)
  const applyFilters = async (status = filterStatus, assignedTo = filterEmployee) => {
    try {
      setLoading(true);

      // Only status filter
      if (status !== "all" && assignedTo === "all") {
        const res = await api.get(`/action/filter/status?status=${status}`);
        setActions(res.data.data);
        return;
      }

      // Only employee filter
      if (status === "all" && assignedTo !== "all") {
        const res = await api.get(`action/filter/assigned?assignedTo=${assignedTo}`);
        setActions(res.data.data);
        return;
      }

      // Both filters
      if (status !== "all" && assignedTo !== "all") {
        const res = await api.get(`/action/filter/status?status=${status}`);
        const filtered = res.data.data.filter((a) => a.assignedTo?._id === assignedTo);
        setActions(filtered);
        return;
      }

      // No filters
      fetchActions();
    } catch (err) {
      console.error("Error applying filters", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
    fetchEmployees();
  }, []);

  return (
    <ManagerLayout>
      <PageHeader
        title="Corrective Actions"
        subtitle="Track and manage assigned corrective actions"
        action={
          <Button onClick={() => setShowActionPage(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Action
          </Button>
        }
      />
      {showActionPage && <AddActionPage onClose={() => setShowActionPage(false)} />}

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search actions..."
            className="pl-10"
            value={searchText}
            onChange={handleSearch}
          />
        </div>

        <div className="flex gap-3">
          {/* Status Filter */}
          <Select
            onValueChange={(value) => {
              setFilterStatus(value);
              applyFilters(value, filterEmployee);
            }}
            value={filterStatus}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          {/* Employee Filter */}
          <Select
            onValueChange={(value) => {
              setFilterEmployee(value);
              applyFilters(filterStatus, value);
            }}
            value={filterEmployee}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>

                {loadingEmp && (
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                )}

                {!loadingEmp && employees.length === 0 && (
                  <SelectItem value="no-data" disabled>
                    No employees found
                  </SelectItem>
                )}

                {employees.map((emp) => (
                  <SelectItem key={emp._id} value={emp._id}>
                    {emp.name} ({emp.email})
                  </SelectItem>
                ))}
              </SelectContent>
          </Select>
        </div>
      </div>

      {/* Actions List */}
      <div className="space-y-4">
        {actions.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">No Actions Found</div>
        ) : (
          actions.map((action) => (
            <div
              key={action._id}
              className={`bg-card rounded-xl border p-5 ${
                action.status === "overdue" ? "border-destructive/30 bg-destructive/5" : "border-border"
              }`}
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {getStatusUI(action.status)}
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {action.actionId}
                    </span>
                    <StatusBadge  status={action.status} />
                    {action.linkedHazard && (
                      <span className="text-xs text-accent font-medium">→ {action.linkedHazard}</span>
                    )}
                  </div>

                  <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{action.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{action.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          action.progress === 100
                            ? "bg-success"
                            : action.status === "overdue"
                            ? "bg-destructive"
                            : "bg-accent"
                        }`}
                        style={{ width: `${action.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {action.assignedTo?.name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Due: {new Date(action.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2 lg:justify-center">
                  {action.status !== "resolved" && (
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(action._id)}>
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </ManagerLayout>
  );
}
