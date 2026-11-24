import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const LogoutPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            await logout();
            navigate("/", { replace: true });
        };

        handleLogout();
    }, [logout, navigate]);

    return <p className="py-20 text-center font-semibold">Loggar ut …</p>;
};

export default LogoutPage;
