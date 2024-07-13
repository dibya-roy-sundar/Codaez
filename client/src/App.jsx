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
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify'

const Layout = () => {
    return (
        <div className='app'>
            <ToastContainer autoClose={3000} draggablePercent={50} limit={3} theme='dark' stacked />
            {/* <Navbar /> */}
            {/* <Sidebar /> */}
            <Outlet />
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
                element: <><Navbar /><Sidebar /><Dashboard /></>
            },
            {
                path: "/leaderboard",
                element: <><Navbar /><Sidebar /><Leaderboard /></>
            },
            {
                path: "/auth",
                element: <Auth />
            },
            {
                path: "/profile/:username",
                element: <><Navbar /><Sidebar /><Profile /></>
            },
            {
                path: "/completeprofile",
                element: <CompleteProfile />
            },
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
