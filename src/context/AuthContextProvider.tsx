import { AuthContext, type Profile } from "./AuthContext";
import { supabase } from "../lib/supabaseClient";
import { useCallback, useEffect, useState, type PropsWithChildren } from "react";
import type { User } from "@supabase/supabase-js";

// Hämtar en profil från databasen. Ändrar inget state själv.
const getProfile = async (userId: string) => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();

    if (error) console.log("Kunde inte hämta profilen:", error);
    return data as Profile | null;
};

const AuthContextProvider = ({ children }: PropsWithChildren) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);

    // Kollar om någon är inloggad
    const [isLoading, setIsLoading] = useState(true);
    // Hämtar profilen (namn, ort, nivå och roll)
    const [isProfileLoading, setIsProfileLoading] = useState(true);

    const login = (email: string, password: string) => {
        return supabase.auth.signInWithPassword({ email, password });
    };

    const logout = () => {
        return supabase.auth.signOut();
    };

    const signup = (email: string, password: string, firstName: string, city: string, level: string) => {
        return supabase.auth.signUp({
            email,
            password,
            options: {
                data: { first_name: firstName, city: city, level: level },
            },
        });
    };

    // Hämtar profilen igen, t.ex. efter att man har sparat på profilsidan
    const refreshProfile = useCallback(async () => {
        if (!currentUser) return;
        const data = await getProfile(currentUser.id);
        setProfile(data);
    }, [currentUser]);

    // 1. Lyssna på inloggning och utloggning
    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            console.log("Authstate changed:", { event, email: session?.user.email });

            const user = session?.user ?? null;
            setCurrentUser(user);

            if (user) {
                // Någon är inloggad: profilen ska hämtas
                setIsProfileLoading(true);
            } else {
                // Ingen är inloggad: ingen profil
                setProfile(null);
                setIsProfileLoading(false);
            }

            setIsLoading(false); // nu vet vi om någon är inloggad
        });

        return () => data.subscription.unsubscribe();
    }, []);

    // 2. Hämta profilen när användaren ändras.
    //    State ändras bara i .then, alltså efter att hämtningen är klar.
    useEffect(() => {
        if (!currentUser) return;

        let cancelled = false;

        getProfile(currentUser.id).then((data) => {
            if (cancelled) return; // användaren hann byta, ignorera svaret
            setProfile(data);
            setIsProfileLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, [currentUser]);

    // Spinner medan appen kollar om någon är inloggad
    if (isLoading) {
        return (
            <div className="flex justify-center py-20" role="status">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#1F5FA0]" />
                <span className="sr-only">Laddar</span>
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                profile,
                role: profile?.role ?? null,
                isProfileLoading,
                login,
                logout,
                signup,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
