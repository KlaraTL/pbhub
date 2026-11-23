export type LoginFormData = {
    email: string;
    password: string;
};

export type SignupFormData = {
    firstName: string;
    email: string;
    password: string;
    confirmPassword: string;
    city: string;
    level: "nyb" | "med" | "avc";
};

export type UpdateProfileFormData = {
    firstName?: string;
    city?: string;
    level?: "nyb" | "med" | "avc";
    password: string;
    confirmPassword: string;
};
