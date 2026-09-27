import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Component này KHÔNG tự render nội dung - nó chỉ "gác cổng".
// <Outlet /> = chỗ React Router chèn route con vào (Dashboard, Study, Arena...)
export default function ProtectedRoute() {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}