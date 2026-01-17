  import { ManagerLayout } from "@/components/layouts/ManagerLayout";
  import { PageHeader } from "@/components/shared/PageHeader";
  import { StatusBadge } from "@/components/shared/StatusBadge";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import AddHazardPage from "./AddHazardPage";
  import { useNavigate } from "react-router-dom";
  import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
  import { Search, MapPin, Calendar, User, Plus, Edit } from "lucide-react";
  import { useState,useEffect } from "react";
  import axios from "axios";
  import api from "../../api/axiosInstance";




  const getRiskScoreColor = (score) => {
    if (score >= 15) return "bg-destructive text-destructive-foreground";
    if (score >= 8) return "bg-warning text-warning-foreground";
    return "bg-success text-success-foreground";
  };


  export default function HazardManagement() {
    const[showHazardPage,setShowHazardPage]=useState(false)
    const[getHazards,setGetHazards]=useState([]);
    const[editingHazard,setEditingHazard]=useState(null);
    const [searchText, setSearchText] = useState("");
    const [empSearch, setEmpSearch] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [riskFilter, setRiskFilter] = useState("ALL");
    const [notifications, setNotifications] = useState([]);


    const fetchHazards=async()=>{
      try{
        const res=await api.get('/hazard/get');
        setGetHazards(res.data.data); 
        console.log(res,'aaa')
      }catch(err){
        console.error("Fetch Hazard error",err)
      }
    }

    const updateStatus=async(id,status)=>{
      try{
        const res=await api.patch(`/hazard/updStatus/${id}`,{status});
        fetchHazards();
      }catch(err){
        console.log('Status Update Failed',err);
      }
    }

    const searchHazard=async(query)=>{
      if(!query.trim()){
        fetchHazards();
      }
      try{
        setSearchLoading(true);
        const res=await api.get(`/hazard/search?title=${query}`);
        setGetHazards(res.data.data);
      }catch(err){
        console.error("Search hazard error", err);
      }finally {
        setSearchLoading(false);
      }
    }


    const searchHazardByEmp = async (value) => {
      if (!value.trim()) {
        fetchHazards();
        return;
      }
      try {
        const res = await api.get(
          `/hazard/search/employee?name=${value}`
        );
        setGetHazards(res.data.data);
      } catch (err) {
        console.error(err);
        setGetHazards([]);
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


    // const filterByStatus = async (status) => {
    //   if (status === "ALL") {
    //     fetchHazards();
    //     return;
    //   }

    //   try {
    //     const res = await axios.get(
    //       `/hazard/filter/status?status=${status}`
    //     );
    //     setGetHazards(res.data.data);
    //   } catch (err) {
    //     console.error("Status filter error", err);
    //   }
    // };

    // const filterByRisk = async (level) => {
    //   if (level === "ALL") {
    //     fetchHazards();
    //     return;
    //   }
    //   try {
    //     const res = await axios.get(`/hazard/filter/risk?level=${level}`);
    //     setGetHazards(res.data.data);
    //   } catch (err) {
    //     console.error("Risk filter error", err);
    //   }
    // };

    useEffect(()=>{
      fetchHazards();
      fetchNotifications();
    },[])

    return (
      <ManagerLayout>
        <PageHeader
          title="Hazard Management"
          subtitle="Assess risks and manage hazard mitigation"
          action={
            <Button onClick={() => setShowHazardPage(true)}>
              <Plus className="w-4 h-4 mr-2"/>
              Add Hazard
            </Button>
          }
          notifications={notifications}
        />

        {showHazardPage && (
        <AddHazardPage onClose={() =>setShowHazardPage(false)} 
        hazard={editingHazard}/>
        )}


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

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search By Assigned To..."
              className="pl-10"
              value={empSearch}
              onChange={(e) => {
                const value = e.target.value;
                setEmpSearch(value);
                searchHazardByEmp(value);
              }}
            />
          </div>

          <div className="flex gap-3">
            {/* <Select  value={riskFilter}
              onValueChange={(value) => {
                setRiskFilter(value);
                filterByRisk(value);
              }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
              </SelectContent>
            </Select> */}
            {/* <Select  value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  filterByStatus(value);
                }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="chemical">Chemical</SelectItem>
                <SelectItem value="fire">Fire Safety</SelectItem>
                <SelectItem value="facilities">Facilities</SelectItem>
              </SelectContent>
            </Select> */}
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
                <div className="flex lg:flex-col gap-2 lg:justify-center">
                  <Select  defaultValue={hazard.status?.toLowerCase()}
                  onValueChange={(value)=>updateStatus(hazard._id,value)}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="close">Close</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm"  
                  onClick={()=>{setEditingHazard(hazard)
                      setShowHazardPage(true);
                    }}>
                    <Edit className="w-4 h-4 mr-2"/>
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ManagerLayout>
    );
  }



