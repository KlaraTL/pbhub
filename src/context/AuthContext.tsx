// Get from the tables - profiles
export interface AuthContextValue {
    currentUser: User | null;
    profile: Profile | null;
    role: "player" | "admin" | null;

    login: (email: string, password: string) => Promise<AuthResponse>;
    logout: () => Promise<{ error: AuthError | null }>;
    signup: (email: string, password: string, Firstname: string, city: string, level: string) => Promise<AuthResponse>;
}
