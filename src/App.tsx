import Navigation from "./pages/partials/Navigation";
import { HomePage } from "./pages/HomePage";
import { Route, Routes } from "react-router-dom";
import ExplorePage from "./pages/ExplorePage";
import MyGamesPage from "./pages/MyGamesPage";
import ChatPage from "./pages/ChatPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/auth/LoginPage";

const App = () => {
    return (
        <>
            {/* Navbaren visas högst upp på alla sidor */}
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/my-games" element={<MyGamesPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </main>
        </>
    );
};

export default App;
