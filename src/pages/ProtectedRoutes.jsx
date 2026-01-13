import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axiosInstance"

const roleHome = {
  admin: "/admin",
  manager: "/manager",
  employee: "/employee",
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [status, setStatus] = useState("loading");
  const [redirectPath, setRedirectPath] = useState("/login");

  useEffect(() => {
    const token = localStorage.getItem("token");
    api.get("/auth/me")
      .then((res) => {
        const userRole = res.data.user.role;

       if (allowedRoles.includes(userRole)) {
          setStatus("authorized");
        } 
        else {
          setRedirectPath(roleHome[userRole]);
          setStatus("unauthorized");
        }
      })
      .catch(() => {
        setRedirectPath("/login");
        setStatus("unauthorized");
      });
  }, [allowedRoles]);

  if (status === "loading") return null;

  if (status === "unauthorized") {
      return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
