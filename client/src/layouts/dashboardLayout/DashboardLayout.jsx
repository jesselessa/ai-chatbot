import "./dashboardLayout.css";
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

// Component
import Loader from "../../components/loader/Loader.jsx";

const DashboardLayout = () => {
  const { isLoaded, userId } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  return (
    <>
      {!isLoaded ? (
        <div className="loadingPage">
          <Loader
            width="50px"
            height="50px"
            border="5px solid transparent"
            borderLeftColor="white"
          />
        </div>
      ) : (
        <div className="dashboardLayout">
          <div className="menu">MENU</div>

          <div className="content">
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardLayout;
