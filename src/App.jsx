import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Login from "./pages/Login";
import Forgetpass from "./pages/forgetpass";
import Register from "./pages/admin/Register";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AllReports from "./pages/admin/AllReports";
import HazardsOverview from "./pages/admin/HazardsOverview";
import Documents from "./pages/admin/Documents";
// import AuditLogs from "./pages/admin/AuditLogs";

// Manager Pages
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ReportsReview from "./pages/manager/ReportsReview";
import HazardManagement from "./pages/manager/HazardManagement";
import CorrectiveActions from "./pages/manager/CorrectiveActions";
import ManagerNotifications from "./pages/manager/ManagerNotifications";

// Employee Pages
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import SubmitReport from "./pages/employee/SubmitReport";
import MyActions from "./pages/employee/MyActions";
import EmployeeNotifications from "./pages/employee/EmployeeNotifications";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Default redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<Forgetpass />} />


          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/reports" element={<AllReports />} />
          <Route path="/admin/hazards" element={<HazardsOverview />} />
          <Route path="/admin/documents" element={<Documents />} />
          {/* <Route path="/admin/audit-logs" element={<AuditLogs />} /> */}
          

          {/* Manager Routes */}
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/manager/reports" element={<ReportsReview />} />
          <Route path="/manager/hazards" element={<HazardManagement />} />
          <Route path="/manager/actions" element={<CorrectiveActions />} />
          {/* <Route path="/manager/notifications" element={<ManagerNotifications />} /> */}

          {/* Employee Routes */}
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/employee/submit-report" element={<SubmitReport />} />
          <Route path="/employee/my-actions" element={<MyActions />} />
          {/* <Route path="/employee/notifications" element={<EmployeeNotifications />} /> */}

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

