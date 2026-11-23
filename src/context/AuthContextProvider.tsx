import { AuthContext, type Profile } from "./AuthContext";

import { useCallback, useEffect, useState, type PropsWithChildren } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

const AuthContextProvider = ({ children }: PropsWithChildren) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Logga in med e-post och lösenord
    const login = (email: string, password: string) => {
        return supabase.auth.signInWithPassword({ email, password });
    };

    // Logga ut
    const logout = () => {
        return supabase.auth.signOut();
    };

    // Skapa konto. Förnamn, ort och nivå sparas i profiles av triggern i databasen.
    const signup = (email: string, password: string, firstName: string, city: string, level: string) => {
        return supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    city: city,
                    level: level,
                },
            },
        });
    };

    // Hjälpfunktion för att hämta profilen för ett specifikt userId
    const getProfileById = useCallback(async (userId: string) => {
        const { data: userData, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();

        if (error) {
            console.error("Error fetching profile:", error);
            return null;
        }

        return userData;
    }, []);

    // Manuell refresh
    const refreshProfile = useCallback(async () => {
        if (!currentUser) {
            setProfile(null);
            return;
        }

        const userData = await getProfileById(currentUser.id);
        console.log("userdata:", userData);
        setProfile(userData);
    }, [currentUser, getProfileById]);

    // Lyssna på inloggning, utloggning och sidomladdning
    useEffect(() => {
        let isMounted = true;

        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!isMounted) return;

            setIsLoading(true);

            console.log("Authstate changed:", {
                event,
                id: session?.user.id,
                email: session?.user.email,
            });

            const user = session?.user ?? null;
            setCurrentUser(user);

            if (!user) {
                setProfile(null);
                setIsLoading(false);
                return;
            }

            const userData = await getProfileById(user.id);
            if (!isMounted) return;

            console.log("userdata:", userData);
            setProfile(userData);
            setIsLoading(false);
        });

        return () => {
            isMounted = false;
            data.subscription.unsubscribe();
        };
    }, [getProfileById]);

    // Visa en spinner medan vi kollar session och hämtar profil
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
