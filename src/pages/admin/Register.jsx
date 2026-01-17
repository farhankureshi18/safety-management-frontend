import { useState,useEffect} from "react";
import { X, Eye, EyeOff, UserPlus } from "lucide-react";
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
import { toast } from "@/components/ui/sonner";
import axios from "axios";
import api from "../../api/axiosInstance";


const Register = ({ onClose,user }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId:"",
    name: "",
    email: "",
    role: "",
    department: "",
    password: "",
  });

  useEffect(() => {
  if (user) {
    setFormData({
      userId: user.userId || "",
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      department: user.department || "",
      password: "", // keep empty while editing
    });
  }
}, [user]);


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     if (user?._id) {
  //       //EDIT USER
  //       await api.put(`/auth/edit/${user._id}`, formData, { withCredentials: true });
  //       toast.success("User updated successfully");  
  //     } else {
  //       // CREATE USER
  //       await api.post("/auth/register", formData, { withCredentials: true });
  //       toast.success("User registered successfully");
  //     }
  //     if (res?.data?.success !== false) {
  //       onClose(); 
  //       }
  //   } catch (err) {
  //     toast.error("Operation failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    if (user?._id) {
      // EDIT USER
      await api.put(`/auth/edit/${user._id}`, formData, { withCredentials: true });
      toast.success("User updated successfully");
      onClose();
      return;
    }
    // CREATE USER
    const res = await api.post("/auth/register", formData, {
      withCredentials: true,
    });
    if (res.status === 201) {
      toast.success("User registered successfully");
      onClose();

      api.post("/auth/send-user-email", {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        password: formData.password,
      }, { withCredentials: true })
      .then(() => {
        toast.success("Credentials email sent successfully");
      })
      .catch((err) => {
        console.error("Email failed:", err);
        toast.error("User created but email not sent");
      });
    } else {
      toast.error(res.data.message || "Registration failed");
    }
  } catch (err) {
    console.error(err);
    toast.error("Operation failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card w-full max-w-md rounded-xl border shadow-lg p-6 relative animate-in fade-in zoom-in">

          {/* Close */}
          <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold">Register New User</h2>
            <p className="text-sm text-muted-foreground">
              Add a new member to the safety management system
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <Label>Full Name</Label>
              <Input
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* User ID */}
            <div>
              <Label>User ID</Label>
              <Input
                placeholder="EMP002"
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="john.doe@company.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            {/* Role & Department */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Role</Label>
               <Select
                value={formData.role}
                onValueChange={(v) =>
                  setFormData({ ...formData, role: v })
                }
              >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(v) =>
                    setFormData({ ...formData, department: v })
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dept" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Password */}
            <div>
              <Label>Password</Label>
              <div className="relative">
               <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={user ? "Leave blank to keep password" : "Create a secure password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pr-12"
                  required={!user}
                />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
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
              <Button type="submit" className="flex-1" disabled={loading}>
                <UserPlus className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : user ? "Update User" : "Create User"}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
