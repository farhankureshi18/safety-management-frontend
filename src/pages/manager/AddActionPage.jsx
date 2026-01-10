import { useState,useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import api from "../../api/axiosInstance";
import {toast} from "@/components/ui/sonner"



const AddActionModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    actionId: "",
    hazardId: "",
    riskScore: 0,
    category: "",
    title: "",
    description: "",
    location: "",
    assignedTo: "",
    dueDate: "",
  });
  //GET api in Select Emp
  const [employees, setEmployees] = useState([]);
  const [loadingEmp, setLoadingEmp] = useState(false);

  //GET api in Select HazradID
  const [hazards, setHazards] = useState([]);
  const [loadingHazards, setLoadingHazards] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        dueDate: new Date(formData.dueDate),
      };
      const res = await api.post("/action/create",payload);
      toast.success("Action created successfully");
      onClose();
    } catch (err) {
      console.error("Error creating action", err.response?.data || err);
      toast.error("Failed to create action");
    }
};

const fetchEmployees = async () => {  
  try {
    setLoadingEmp(true);
    const res = await api.get("/hazard/getAllEmp");
    console.log(res)
    setEmployees(res.data.data);
  } catch (error) {
    console.error("Error fetching employees", error);
  } finally {
    setLoadingEmp(false);
  }
 };

 const fetchHazards = async () => {
  try {
    setLoadingHazards(true);
    const res = await api.get("/hazard/get");
    setHazards(res.data.data); 
  } catch (error) {
    console.error("Error fetching hazards", error);
  } finally {
    setLoadingHazards(false);
  }
};

 useEffect(() => {
  fetchEmployees();
  fetchHazards();
}, []);


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
            <h2 className="text-xl font-bold">Add Corrective Action</h2>
            <p className="text-sm text-muted-foreground">
              Create an action linked to a hazard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* IDs & Risk */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Action ID</Label>
                <Input
                  placeholder="ACT-050"
                  onChange={(e) =>setFormData({ ...formData, actionId: e.target.value })}/>
              </div>

             <div>
                <Label>Hazard</Label>
                <Select value={formData.hazardId}
                  onValueChange={(v) => setFormData({ ...formData, hazardId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Hazard" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingHazards && (
                      <SelectItem value="loading" disabled>
                        Loading hazards...
                      </SelectItem>
                    )}
                    {!loadingHazards && hazards.length === 0 && (
                      <SelectItem value="no-data" disabled>
                        No hazards found
                      </SelectItem>
                    )}
                    {hazards.map((hazard) => (
                      <SelectItem key={hazard._id} value={hazard._id}>
                        {hazard.hazardId} — {hazard.hazardTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Risk Score</Label>
                <Input
                  placeholder="16"
                  onChange={(e) =>
                    setFormData({ ...formData, riskScore: Number(e.target.value)})
                  }
                />
              </div>
              <div>
              </div>
            </div>

            {/* Category */}
            <div>
              <Label>Category</Label>
              <Select
                onValueChange={(v) =>
                  setFormData({ ...formData, category: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Electrical" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="fire">Fire</SelectItem>
                  <SelectItem value="chemical">Chemical</SelectItem>
                  <SelectItem value="mechanical">Mechanical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div>
              <Label>Action Title</Label>
              <Input
                placeholder="Exposed Wiring in Storage Room C"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                placeholder="Electrical wiring exposed through damaged conduit, posing shock risk."
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Location */}
            <div>
              <Label>Location</Label>
              <Input
                placeholder="Building A, Storage Room C"
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            {/* Assignment */}
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
                  onChange={(e) =>setFormData({ ...formData, dueDate: e.target.value })}/>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" onClick={handleSubmit}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Add Action
              </Button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default AddActionModal;
