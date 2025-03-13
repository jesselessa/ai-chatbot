import { useState } from "react";
import "./rootLayout.css";
import { Link, Outlet } from "react-router-dom";
import { ClerkProvider, SignedIn, UserButton } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Image
import bigLogo from "../../../src/assets/logo-big.png";

// Import Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) throw new Error("Missing Publishable Key");

// Create a client
const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <QueryClientProvider client={queryClient}>
        <div className="rootLayout">
          <header>
            {/* Logo */}
            <Link to="/" className="logo">
              <img src={bigLogo} alt="logo" />
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

          {/* Show header on each page */}
          <main>
            {/* <Outlet /> acts as a placeholder where the child routes defined in the React Router configuration will be rendered */}
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
