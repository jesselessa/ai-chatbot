import "./dashboardLayout.css";
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

// Components
import Loader from "../../components/loader/Loader.jsx";
import Menu from "../../components/menu/Menu.jsx";

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
          <Loader />
        </div>
      ) : (
        <div className="dashboardLayout">
          <Menu />

          <div className="content">
            {/* <Outlet /> acts as a placeholder where the child routes defined in the React Router configuration will be rendered */}
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardLayout;
