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




export default function ReportsReview() {
  const [reports, setReports] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [viewLabel, setViewLabel] = useState("Showing all reports");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [openView, setOpenView] = useState(false);


  /*Pagination constant value */
  const ITEMS_PER_PAGE = 6;
  const totalReports = reports.length;
  const totalPages = Math.ceil(totalReports / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedReports = reports.slice(startIndex, endIndex);



  const fetchAllReports=async()=>{
    try{  
      const res=await axios.get('http://localhost:5000/report/all');
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
      const res=await axios.get(`http://localhost:5000/report/search?title=${searchTitle}`);
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
      const res=await axios.get(`http://localhost:5000/report/filter/status/${value}`);
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
      const res=await axios.get(`http://localhost:5000/report/filter/priority/${value}`);
      setReports(res.data.data);
       setViewLabel(`Showing results filtered by Priority: ${value}`);
    }catch(err){
      console.log(err);
      setReports([]);
    }

  }

  const handleAction = async (id, status) => {
  try {
    await axios.patch(`http://localhost:5000/report/status/${id}`,{ status:status });
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


  useEffect(()=>{
    fetchAllReports();
  },[])

  useEffect(() => {
  setCurrentPage(1);
}, [reports]);



  return (
    <ManagerLayout>
      <PageHeader
        title="Reports Review"
        subtitle="Review and process submitted safety reports"
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


      {/*View Box*/}
      {openView && selectedReport && (
            <Dialog open={openView} onOpenChange={setOpenView}>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>{selectedReport.reportTitle}</DialogTitle>
                </DialogHeader>

              {/* IMAGE */}
             {selectedReport?.attachment?.url ? (
              <img
                src={selectedReport.attachment.url}
                alt="report"
                className="w-full h-48 object-contain rounded"
              />
            ) : (
              <p className="text-sm text-muted-foreground">No attachment</p>
            )}


              {/* DETAILS */}
              <div className="space-y-2 text-sm">
                <p><b>Category:</b> {selectedReport.category}</p>
                <p><b>Priority:</b> {selectedReport.priority}</p>
                <p><b>Status:</b> {selectedReport.status}</p>
                <p><b>Location:</b> {selectedReport.location}</p>
                <p><b>Description:</b> {selectedReport.description}</p>

                <hr />

                <p><b>Reported By:</b> {selectedReport.reportedBy?.name}</p>
                <p><b>Department:</b> {selectedReport.reportedBy?.department}</p>
                <p>
                  <b>Date:</b>{" "}
                  {new Date(selectedReport.createdAt).toLocaleString()}
                </p>
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


