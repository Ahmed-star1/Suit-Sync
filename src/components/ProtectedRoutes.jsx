import React from "react";
import { Navigate } from "react-router-dom";
import { getAccessToken } from "../Redux/Utils/localStore";

const PrivateRoute = ({ children }) => {
  const token = getAccessToken();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default PrivateRoute;