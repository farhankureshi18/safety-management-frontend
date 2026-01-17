import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoutes";

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
import AdminNotifications from "./pages/admin/AdminNotification";

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
          <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}>
                    <UserManagement />
                  </ProtectedRoute>} />
          <Route path="/admin/reports"element={<ProtectedRoute allowedRoles={["admin"]}>
                    <AllReports />
                  </ProtectedRoute>}  />
          <Route path="/admin/hazards" element={<ProtectedRoute allowedRoles={["admin"]}>
                    <HazardsOverview />
                  </ProtectedRoute>}  />
          <Route path="/admin/documents"element={<ProtectedRoute allowedRoles={["admin","manager"]}>
                    <Documents />
                  </ProtectedRoute>}  />
          <Route path="/admin/notifications"element={<ProtectedRoute allowedRoles={["admin"]}>
                    <AdminNotifications />
                  </ProtectedRoute>}  />
          {/* <Route path="/admin/audit-logs" element={<AuditLogs />} /> */}
          

          {/* Manager Routes */}
          <Route path="/manager" element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>}/>
          <Route path="/manager/reports"element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ReportsReview />
            </ProtectedRoute>} />
          <Route path="/manager/hazards" element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <HazardManagement />
            </ProtectedRoute>} />
          <Route path="/manager/actions"element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <CorrectiveActions />
            </ProtectedRoute>} />
          <Route path="/manager/notifications"element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerNotifications />
            </ProtectedRoute>} />

          {/* Employee Routes */}
          <Route path="/employee" element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>}/>
          <Route path="/employee/submit-report"element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <SubmitReport />
            </ProtectedRoute>} />
          <Route path="/employee/my-actions" element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <MyActions />
          </ProtectedRoute>} />
           <Route path="/employee/notifications" element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeNotifications />
          </ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

