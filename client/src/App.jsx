import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import RootLayout from "./layouts/rootLayout/RootLayout.jsx";
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout.jsx";
import Home from "./pages/home/Home.jsx";
import SignInPage from "./pages/signInPage/SignInPage.jsx";
import SignUpPage from "./pages/signUpPage/SignUpPage.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import ChatPage from "./pages/chatPage/ChatPage.jsx";
import TermsOfService from "./pages/termsOfService/TermsOfService.jsx";
import PrivacyPolicy from "./pages/privacyPolicy/PrivacyPolicy.jsx";

// Router
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/sign-in/*", element: <SignInPage /> }, // '*' represesents every child of this page
      { path: "/sign-up/*", element: <SignUpPage /> },
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/dashboard/chats/:chatId", element: <ChatPage /> },
        ],
      },
    ],
  },
  { path: "/terms-of-service", element: <TermsOfService /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  { path: "*", element: <Home /> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
