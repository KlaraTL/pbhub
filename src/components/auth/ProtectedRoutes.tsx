import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// Släpper bara in inloggade i skyddade ruttgrupper. Andra skickas till inloggningssidan.
const ProtectedRoutes = () => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to="/logga-in" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;