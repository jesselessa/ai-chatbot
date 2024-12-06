import "./rootLayout.css";
import { Link, Outlet } from "react-router-dom";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/clerk-react";

// Import Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) throw new Error("Missing Publishable Key");

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <div className="rootLayout">
        <header>
          {/* Logo */}
          <Link to="/" className="logo">
            <img src="/logo.png" alt="logo" />
            <span> ASK JESSBOT</span>
          </Link>

          {/* User info */}
          <div className="user">
            {/* Clerk prebuild components */}
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>

        {/* All pages - Show navbar on each page */}
        <main>
          <Outlet />
        </main>
      </div>
    </ClerkProvider>
  );
};

export default RootLayout;
