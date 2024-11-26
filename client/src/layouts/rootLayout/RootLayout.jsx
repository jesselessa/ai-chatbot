import "./rootLayout.css";
import { Link, Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="rootLayout">
      <header>
        {/* Logo */}
        <Link to="/" className="logo">
          <img src="/logo.png" alt="logo" />
          <span>AI Chat Bot</span>
        </Link>
        {/* User info */}
        <div className="user">User</div>
      </header>

      {/* All pages - Navbar on each page */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
