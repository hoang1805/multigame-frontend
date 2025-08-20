import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import MainLayout from "./app/layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Caro from "./pages/Caro";
import Line98 from "./pages/Line98";
import { AuthLayout } from "./app/layouts/AuthLayout";
import Register from "./pages/auth/Register";
import Me from "./pages/user/Me";
import { History } from "./pages/History";

export const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        children: [
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
        ],
    },
    {
        element: <MainLayout />,
        children: [
            {path: "/", element: <Navigate to={'/home'}/>},
            {path: "/user/me", element: <ProtectedRoute><Me /></ProtectedRoute>},
            { path: "/home", element: <ProtectedRoute><Home /></ProtectedRoute> },
            { path: "/line98/:id", element: <Line98 /> },
            { path: "/caro/:id", element: <ProtectedRoute><Caro /></ProtectedRoute> },
            { path: "/history", element: <Navigate to={'/history/caro'}/>},
            { path: "/history/:game", element: <ProtectedRoute><History></History></ProtectedRoute>}
        ],
    },
]);

