import "./App.css";
import Auth from "./Pages/Auth/Auth";
import Dashboard from "./Pages/Dashboard/Dashboard";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import Leaderboard from "./Pages/Leaderboard/Leaderboard";
import Profile from "./Pages/Profile/Profile";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import CompleteProfile from "./components/Register/CompleteProfile";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Error_404 from "./Pages/404Page/Error_404";
import Protected from "./Protected";
import initializeAnalytics, { trackPageView } from './analytics.js';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="app">
      <ToastContainer
        autoClose={3000}
        draggablePercent={50}
        limit={3}
        theme="dark"
        stacked
      />
      {/* <Navbar /> */}
      {/* <Sidebar /> */}
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/dashboard",
        element: (
          <Protected>
            <>
              <Navbar />
              <Sidebar />
              <Dashboard />
            </>
          </Protected>
        ),
      },
      {
        path: "/leaderboard",
        element: (
          <Protected>
            <>
              <Navbar />
              <Sidebar />
              <Leaderboard />
            </>
          </Protected>
        ),
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/profile/:username",
        element: (
          <Protected>
            <>
              <Navbar />
              <Sidebar />
              <Profile />
            </>
          </Protected>
        ),
      },
      {
        path: "/completeprofile",
        element:
          <CompleteProfile />
      },
      {
        path: "404", element: (
          <>
            <Navbar />
            <Error_404 />
          </>)
      },
      { path: "*", element: <Navigate to="/404" replace /> },
    ],
  },
]);




const TrackPageView = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

function App() {
  useEffect(() => {
    initializeAnalytics();
  }, []);

  return (
    <>
      <TrackPageView />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
