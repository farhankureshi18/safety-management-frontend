import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, ArrowRight } from "lucide-react";
import forgetpass from "./forgetpass";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import api from '../api/axiosInstance'


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate=useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("/auth/login", { email, password });
    
    const token = res.data.token;
    const user = res.data.user;

    // Store in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    toast.success("Login Successfully");

    if (user.role === "admin") navigate("/admin");
    else if (user.role === "manager") navigate("/manager");
    else navigate("/employee");
  } catch (err) {
    console.log(err);
    toast.error(err.response?.data?.message || "Login failed");
  }
};
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-accent" />
          <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-accent" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
              <Shield className="w-8 h-8 text-accent-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-primary-foreground">SafetyMS</h1>
          </div>
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">
            Safety Management<br />Made Simple
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            Report safety issues, assess risks, and prevent workplace accidents with our comprehensive safety management platform.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">SafetyMS</h1>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forget-password"
                  className="text-sm text-accent hover:text-accent/80 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-medium">
              Sign In
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
