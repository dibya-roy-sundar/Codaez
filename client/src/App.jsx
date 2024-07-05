import './App.css'
import Auth from './Pages/Auth/Auth';
import Dashboard from "./Pages/Dashboard/Dashboard";
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Landing from './Pages/Landing/Landing';
import Leaderboard from './Pages/Leaderboard/Leaderboard';
import Profile from './Pages/Profile/Profile';
import Navbar from './Pages/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar';

import CompleteProfile from './components/Register/CompleteProfile';
import Register from './components/Register/Register';

const Layout = () => {
    return (
        <div className='app'>
            <Navbar />
            <Sidebar />
            <Outlet />
            {/* <Footer /> */}
        </div>
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Landing />
            },
            {
                path: "/dashboard",
                element: <Dashboard />
            },
            {
                path: "/leaderboard",
                element: <Leaderboard />
            },
            {
                path: "/auth",
                element: <Auth />
            },
            {
                path: "/profile",
                element: <Profile />
            },
            {
                path: "/completeprofile",
                element: <CompleteProfile />
            }, {
                path: '/register',
                element: <Register />
            }
        ]
    },
])

function App() {

    return (
        <>
            <div>
                <RouterProvider router={router} />
            </div>
        </>
    )
}

export default App
