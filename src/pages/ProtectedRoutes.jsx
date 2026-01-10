import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import api from "../../api/axiosInstance";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        const userRole = res.data.user.role;

        if (!allowedRoles.includes(userRole)) {
          setStatus("unauthorized");
        } else {
          setStatus("authorized");
        }
      })
      .catch(() => {
        setStatus("unauthorized");
      });
  }, []);

  if (status === "loading") return null;

  if (status === "unauthorized") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
