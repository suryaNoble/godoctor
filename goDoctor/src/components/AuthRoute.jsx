import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const AuthRoute = () => {
  const { token } = useContext(AppContext);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
