import "./dashboardLayout.css";
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const DashboardLayout = () => {
  //! The 'useAuth()' hook provides information about the current auth state, as well as helper methods to manage the current active session.
  // 'isLoaded' : a boolean that until Clerk loads and initializes, will be set to false. Once Clerk loads, it will be set to true.
  // 'userId' : the current user ID
  const { isLoaded, userId } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  if (!isLoaded) return "Loading...";

  return (
    <div className="dashboardLayout">
      <div className="menu">MENU</div>

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
