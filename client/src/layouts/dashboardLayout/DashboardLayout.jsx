import "./dashboardLayout.css";
import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

// Components
import Loader from "../../components/loader/Loader.jsx";
import Menu from "../../components/menu/Menu.jsx";
import Burger from "../../components/burger/Burger.jsx";

const DashboardLayout = () => {
  const [isBurgerClicked, setIsBurgerClicked] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 800);

  const { isLoaded, userId } = useAuth();
  const navigate = useNavigate();

  // Redirect unauthenticated user to SignIn page
  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  useEffect(() => {
    const handleResize = () => {
      const newIsSmallScreen = window.innerWidth <= 800;
      setIsSmallScreen(newIsSmallScreen);

      // Open menu by default on large screens
      if (!newIsSmallScreen) {
        setIsBurgerClicked(true);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => {
    setIsBurgerClicked(!isBurgerClicked);
  };

  return (
    <>
      {!isLoaded ? (
        <div className="loadingPage">
          <Loader />
        </div>
      ) : (
        <div className="dashboardLayout">
          {isSmallScreen && (
            <Burger isOpen={isBurgerClicked} onClick={toggleMenu} />
          )}

          {/* Show Menu, either on small screens when burger is clicked, or always on large screens */}
          {((isSmallScreen && isBurgerClicked) || !isSmallScreen) && (
            <Menu onClose={() => setIsBurgerClicked(false)} />
          )}

          <div className="content">
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardLayout;
