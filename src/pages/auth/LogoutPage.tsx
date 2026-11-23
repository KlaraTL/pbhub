import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const LogoutPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logout().then(() => {
            navigate("/logga-in", { replace: true });
        });
    }, [logout, navigate]);

    return <p className="py-10 text-center">Loggar ut...</p>;
};

export default LogoutPage;
