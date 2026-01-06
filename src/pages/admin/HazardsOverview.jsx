import { AdminLayout } from "@/components/layouts/AdminLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { Search, MapPin, Calendar, User, Plus, Edit,AlertTriangle } from "lucide-react";
import { useState,useEffect } from "react";
import axios from "axios";
import { KPICard } from "@/components/shared/KPICard";


  const getRiskScoreColor = (score) => {
    if (score >= 15) return "bg-destructive text-destructive-foreground";
    if (score >= 8) return "bg-warning text-warning-foreground";
    return "bg-success text-success-foreground";
  };


  export default function HazardManagement() {
    const[getHazards,setGetHazards]=useState([]);
    const[searchText, setSearchText] = useState("");
    const[searchLoading, setSearchLoading] = useState(false);
    const [riskFilter, setRiskFilter] = useState("ALL");

    const fetchHazards=async()=>{
      try{
        const res=await axios.get('http://localhost:5000/hazard/get');
        setGetHazards(res.data.data); 
        console.log(res.data.data,'aaa')
      }catch(err){
        console.error("Fetch Hazard error",err)
      }
    }
 
    const searchHazard=async(query)=>{
      if(!query.trim()){
        fetchHazards();
      }
      try{
        setSearchLoading(true);
        const res=await axios.get(`http://localhost:5000/hazard/search?title=${query}`);
        setGetHazards(res.data.data);
      }catch(err){
        console.error("Search hazard error", err);
      }finally {
        setSearchLoading(false);
      }
    }
  
    useEffect(()=>{
      fetchHazards();
    },[])


    const totalHazards = getHazards.length;

    const criticalCount = getHazards.filter(
      (h) => h.riskLevel?.toLowerCase() === "critical"
    ).length;

    const highRiskCount = getHazards.filter(
      (h) => h.riskLevel?.toLowerCase() === "high"
    ).length;

    const mediumLowCount = getHazards.filter(
      (h) =>h.riskLevel?.toLowerCase() === "medium" ||
        h.riskLevel?.toLowerCase() === "low"
    ).length;


    return (
   <AdminLayout>
      <PageHeader title="Hazards Overview" subtitle="Monitor and manage identified hazards across all locations" />

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard title="Total Hazards" value={totalHazards} icon={AlertTriangle} />
        <KPICard title="Critical" value={criticalCount} variant="destructive" icon={AlertTriangle} />
        <KPICard title="High Risk" value={highRiskCount} variant="warning" icon={AlertTriangle} />
        <KPICard title="Medium/Low" value={mediumLowCount} variant="accent" icon={AlertTriangle} />
      </div>
        

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search hazards..." className="pl-10" 
            value={searchText}
            onChange={(e)=>{
              const value=e.target.value;
              setSearchText(value);
              searchHazard(value);
            }}/>
          </div>
        </div>

        {/* Hazards List */}
        <div className="space-y-4">
          {getHazards.map((hazard) => (
            <div
              key={hazard._id}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Risk Score */}
                <div className="flex lg:flex-col items-center gap-3 lg:gap-1">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getRiskScoreColor(hazard.riskScore)}`}>
                    <span className="text-xl font-bold">{hazard.riskScore}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Risk Score</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {hazard.hazardId}
                    </span>
                    <StatusBadge status={hazard.status?.toLowerCase()} />
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                      {hazard.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {hazard.hazardTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {hazard.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {hazard.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {hazard.assignedTo?.name || "Unassigned"}
                    </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Due: {hazard.dueDate
                      ? new Date(hazard.dueDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                  </div>
                </div>
                {/* Actions */}
                  <div
                    className="flex lg:flex-col gap-2 lg:justify-center text-sm border p-3 rounded"  >
                    <h1 className="font-semibold text-muted-foreground">Reported By</h1>
                    <p className="font-medium">
                      {hazard?.createdBy?.name}
                    </p>
                    <span>
                      Date: {new Date(hazard.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    );
  }



