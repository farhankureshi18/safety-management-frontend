import { ManagerLayout } from "@/components/layouts/ManagerLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Dialog,DialogContent,DialogHeader,DialogTitle} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast";
import {Select,SelectContent,  SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axiosInstance";




export default function ReportsReview() {
  const [reports, setReports] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [viewLabel, setViewLabel] = useState("Showing all reports");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [notifications, setNotifications] = useState([]);


  /*Pagination constant value */
  const ITEMS_PER_PAGE = 6;
  const totalReports = reports.length;
  const totalPages = Math.ceil(totalReports / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReports = reports.slice(startIndex, endIndex);



  const fetchAllReports=async()=>{
    try{  
      const res=await api.get('/report/all');
            console.log(res.data.data)
      setReports(res.data.data);
      setViewLabel("Showing all reports");
    }catch(err){
      console.error(err);
    }
  }

  const handleSearch=async()=>{
    if(!searchTitle.trim()){
      fetchAllReports();
      return;
    }
    try{
      const res=await api.get(`/report/search?title=${searchTitle}`);
      setReports(res.data.data);
      setViewLabel(`Showing results for search: "${searchTitle}"`);
    }catch(err){
      console.log(err);
      setReports([]);
    }
  }

  const handleStatusFilter=async(value)=>{
    setStatus(value);
    if(value === 'all'){
      fetchAllReports();
      return;
    }
    try{
      const res=await api.get(`/report/filter/status/${value}`);
      setReports(res.data.data);
      setViewLabel(`Showing results filtered by Status: ${value}`);
    }catch(err){
      console.log(err);
      setReports([]);
    }
  }

  const handlePriorityFilter=async(value)=>{
    setPriority(value);
    if(value === 'all'){
      fetchAllReports();
      return;
    }
    try{
      const res=await api.get(`/report/filter/priority/${value}`);
      setReports(res.data.data);
       setViewLabel(`Showing results filtered by Priority: ${value}`);
    }catch(err){
      console.log(err);
      setReports([]);
    }

  }

  const handleAction = async (id, status) => {
  try {
    await api.patch(`/report/status/${id}`,{ status:status });
      setReports((prevReports) =>
      prevReports.map((report) =>
        report._id === id ? { ...report, status: status } : report
      )
    );
    // Toast.success(`Report ${status}`);
      toast({
      title: `Report ${status}`,
      description: `The report has been ${status.toLowerCase()} successfully`,
    });
    } catch (err) {
       toast({
      title: "Error",
      description: "Something went wrong",
    });
  }
};

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


  useEffect(()=>{
    fetchAllReports();
    fetchNotifications();
  },[])

  useEffect(() => {
  setCurrentPage(1);
}, [reports]);



  return (
    <ManagerLayout>
      <PageHeader
        title="Reports Review"
        subtitle="Review and process submitted safety reports"
        notifications={notifications}
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
        placeholder="Search By Entering Title"
        className="pl-10"
        value={searchTitle}
        onChange={(e)=>setSearchTitle(e.target.value)}
        onKeyDown={(e)=>e.key === 'Enter' && handleSearch()}
      />
        </div>
        {/* filter by priority */}
        <div className="flex gap-3">
          <Select defaultValue="Pending" onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          {/* filter by priority */}
          <Select   defaultValue='all' onValueChange={handlePriorityFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

        <div className="mb-4 text-sm text-muted-foreground">
          {viewLabel}
        </div>


         {openView && selectedReport && (
  <Dialog open={openView} onOpenChange={setOpenView}>
    <DialogContent className="max-w-3xl p-0 overflow-hidden">

      {/* ===== Header ===== */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold tracking-tight">
          {selectedReport.reportTitle}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Report ID • {selectedReport._id.slice(-6)}
        </p>
      </div>

      {/* ===== Image Section ===== */}
      {selectedReport?.attachment?.url ? (
        <div className="bg-muted">
          <img
            src={selectedReport.attachment.url}
            alt="Report Attachment"
            className="w-full max-h-[280px] object-contain mx-auto"
          />
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
          No attachment available
        </div>
      )}

      {/* ===== Body ===== */}
      <div className="p-6 space-y-6">

        {/* Status Row */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary">
            {selectedReport.category}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium
              ${selectedReport.priority === "Critical"
                ? "bg-red-100 text-red-700"
                : selectedReport.priority === "High"
                ? "bg-orange-100 text-orange-700"
                : selectedReport.priority === "Medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-muted text-muted-foreground"
              }`}
          >
            {selectedReport.priority} Priority
          </span>

          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            {selectedReport.status}
          </span>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-1">
            Description
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {selectedReport.description || "No description provided"}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="font-medium mt-1">
              {selectedReport.location || "N/A"}
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Reported Date</p>
            <p className="font-medium mt-1">
              {new Date(selectedReport.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Reported By</p>
            <p className="font-medium mt-1">
              {selectedReport.reportedBy?.name || "N/A"}
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Department</p>
            <p className="font-medium mt-1">
              {selectedReport.reportedBy?.department || "N/A"}
            </p>
          </div>
        </div>

      </div>
    </DialogContent>
  </Dialog>
      )}


      {/* Reports Cards */}
      <div className="space-y-4">
       {Array.isArray(reports) && reports.length > 0 ? (
        paginatedReports.map((report) => (
          <div
            key={report._id}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex flex-col lg:flex-row gap-4">

              {/* Main Content */}
              <div className="flex-1">

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                {report._id.slice(-6)}
              </span>

              <StatusBadge status={report.status?.toLowerCase()} />

              <span className={`text-xs font-medium px-2 py-0.5 rounded
                ${report.priority === "Critical"
                  ? "bg-destructive/10 text-destructive"
                  : report.priority === "High"
                  ? "bg-warning/10 text-warning"
                  : report.priority === "Medium"
                  ? "bg-info/10 text-info"
                  : "bg-muted text-muted-foreground"
                }`}>
                {report.priority}
              </span>

              <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                {report.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold mb-2">
              {report.reportTitle}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-3">
              {report.description}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>
                Reported by:
                <span className="font-medium text-foreground ml-1">
                  {report.reportedBy?.name || "N/A"}
                </span>
              </span>

              <span>•</span>
              <span>{report.reportedBy?.department || "N/A"}</span>

              <span>•</span>
              <span>
                {new Date(report.createdAt).toLocaleDateString()}
              </span>

              {report.attachment && (
                <>
                  <span>•</span>
                  <span>{report.attachment.size}</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex lg:flex-col gap-2 lg:w-32">
            <Button variant="outline" size="sm" onClick={()=>{setSelectedReport(report);
              setOpenView(true)
            }}>
              <Eye className="w-4 h-4 mr-2" /> View
            </Button>

            <Button
              size="sm"
              className="bg-success"
              onClick={() => handleAction(report._id, "Approved")}
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Approved
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              onClick={() => handleAction(report._id, "Rejected")}
            >
              <XCircle className="w-4 h-4 mr-2" /> Reject
            </Button>

          </div>
        </div>
      </div>
    ))
    ) : (
      <p className="text-center text-muted-foreground">
        No reports found
      </p>
    )}

      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-
          {Math.min(endIndex, totalReports)} of {totalReports} reports
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </ManagerLayout>
  );
}


