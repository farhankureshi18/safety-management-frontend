import { useState,useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import {toast} from "@/components/ui/sonner"



const AddHazardModal = ({ onClose,hazard }) => {
  const [formData, setFormData] = useState({
  hazardId: "",
  hazardTitle: "",
  description: "",
  category: "",
  riskScore: "",
  riskLevel: "",
  location: "",
  assignedTo: "",
  dueDate: "",
});

const [employees, setEmployees] = useState([]);
const [loadingEmp, setLoadingEmp] = useState(false);

  const fetchEmployees = async () => {  
  try {
    setLoadingEmp(true);
    const res = await axios.get("https://safety-management-system-backend.onrender.com/hazard/getAllEmp");
    console.log(res)
    setEmployees(res.data.data);
  } catch (error) {
    console.error("Error fetching employees", error);
  } finally {
    setLoadingEmp(false);
  }
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (hazard?._id) {
      await axios.put(`https://safety-management-system-backend.onrender.comhazard/update/${hazard._id}`,formData );
        toast.success("Hazard updated successfully");
    } else {
      await axios.post("https://safety-management-system-backend.onrender.com/hazard/create",formData, { withCredentials: true });
      toast.success("Hazard created successfully");
    }
    onClose();
  } catch (err) {
    toast.error("Failed to save hazard");
    console.error(err);
  }
};

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
  if (hazard) {
    setFormData({
      hazardId: hazard.hazardId || "",
      hazardTitle: hazard.hazardTitle || "",
      description: hazard.description || "",
      category: hazard.category || "",
      riskScore: hazard.riskScore || "",
      riskLevel: hazard.riskLevel || "",
      location: hazard.location || "",
      assignedTo: hazard.assignedTo?._id || "",
      dueDate: hazard.dueDate
        ? new Date(hazard.dueDate).toISOString().split("T")[0]
        : "",
    });
  }
}, [hazard]);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card w-full max-w-lg rounded-xl border shadow-lg p-6 relative animate-in fade-in zoom-in">

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold">Add New Hazard</h2>
            <p className="text-sm text-muted-foreground">
              Record and track a workplace hazard
            </p>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hazard ID</Label>
                <Input placeholder='HZ-012' value={formData.hazardId} onChange={(e)=>setFormData({...formData,hazardId:e.target.value})} />
              </div>
              <div>
                <Label>Risk Score</Label>
                <Input
                  placeholder="16"
                  onChange={(e)=>setFormData({...formData,riskScore:Number(e.target.value)})}
                />
              </div>
            </div>

            <div>
              <Label>Hazard Title</Label>
              <Input
                placeholder="Exposed Wiring in Storage Room C"
                value={formData.hazardTitle}
                onChange={(e) =>
                  setFormData({ ...formData, hazardTitle: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Electrical wiring exposed through damaged conduit..."
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, category: v })} value={formData.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="fire">Fire</SelectItem>
                    <SelectItem value="chemical">Chemical</SelectItem>
                    <SelectItem value="mechanical">Mechanical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Risk Level</Label>
                <Select   value={formData.riskLevel} onValueChange={(v) => setFormData({ ...formData, riskLevel: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Location</Label>
              <Input
                placeholder="Building A, Storage Room C"
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Assigned To</Label>
              <Select value={formData.assignedTo} onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
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
              <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                required
              />
            </div>
          </div>
            
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
             <Button type="submit" className="flex-1">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {hazard ? "Update Hazard" : "Add Hazard"}
            </Button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default AddHazardModal;
