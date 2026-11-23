import { Route, Routes } from "react-router-dom";
import Navigation from "./pages/partials/Navigation";

import { HomePage } from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import MyGamesPage from "./pages/MyGamesPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";

import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignUpPage";
import LogoutPage from "./pages/auth/LogoutPage";

const App = () => {
    return (
        <>
            <Navigation />

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <Routes>
                    {/* Öppna sidor */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/utforska" element={<ExplorePage />} />
                    <Route path="/chatt" element={<ChatPage />} />
                    <Route path="/logga-in" element={<LoginPage />} />
                    <Route path="/skapa-konto" element={<SignupPage />} />
                    <Route path="/logga-ut" element={<LogoutPage />} />

                    {/* Skyddade sidor (kräver inloggning) */}
                    <Route element={<ProtectedRoutes />}>
                        <Route path="/mina-spel" element={<MyGamesPage />} />
                        <Route path="/profil" element={<ProfilePage />} />
                    </Route>

                    {/* Fallback om sidan inte finns */}
                    <Route path="*" element={<p className="py-10 text-center">Sidan finns inte.</p>} />
                </Routes>
            </main>
        </>
    );
};

export default App;
