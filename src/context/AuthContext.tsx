import { createContext } from "react";
import type { AuthError, AuthResponse, User } from "@supabase/supabase-js";

export interface Profile {
    id: string;
    first_name: string;
    level: "nyb" | "med" | "avc";
    city: string;
    role: "player" | "admin";
}

export interface AuthContextValue {
    currentUser: User | null;
    profile: Profile | null;
    role: "player" | "admin" | null;
    login: (email: string, password: string) => Promise<AuthResponse>;
    logout: () => Promise<{ error: AuthError | null }>;
    signup: (email: string, password: string, firstName: string, city: string, level: string) => Promise<AuthResponse>;
    refreshProfile: () => Promise<void>;
    isProfileLoading: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
