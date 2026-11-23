import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type { LoginFormData } from "../../types/form.types";
import useAuth from "../../hooks/useAuth";

const LoginPage = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>();
    const { login } = useAuth();
    const navigate = useNavigate();

    // Körs när man trycker på Logga in och alla fält är ifyllda
    const onLogin: SubmitHandler<LoginFormData> = async ({ email, password }) => {
        setErrorMessage(null);
        const { error } = await login(email, password);

        if (error) {
            setErrorMessage("Fel e-post eller lösenord.");
            return;
        }

        navigate("/");
    };

    const inputClass = (hasError: boolean) =>
        "h-14 w-full rounded-2xl border bg-[#1E2A47] px-5 text-base sm:text-lg text-white placeholder:text-[#A3AEC4] " +
        "outline-none transition focus:border-[#8AB0E3] focus:ring-4 focus:ring-[#8AB0E3]/25 " +
        (hasError ? "border-red-400" : "border-[#2A3655]");

    // Rubriken ovanför varje fält
    const labelClass = "flex flex-col gap-2.5 text-base sm:text-lg font-bold text-white";

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-2 py-6 sm:px-4 sm:py-10">
            <div className="relative w-full max-w-xl rounded-[28px] border border-[#2A3655] bg-[#172241] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-10">
                {/* Stäng-kryss uppe i högra hörnet */}
                <Link
                    to="/"
                    aria-label="Stäng och gå till startsidan"
                    className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white/80 transition hover:bg-white/20 hover:text-white"
                >
                    ✕
                </Link>

                {/* Rubrik */}
                <div className="mb-8 pr-10">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Logga in</h1>
                    <p className="mt-2 text-base text-[#A3AEC4] sm:text-lg">Välkommen tillbaka.</p>
                </div>

                {/* Felmeddelande */}
                {errorMessage && <p className="mb-6 rounded-2xl bg-red-500/15 p-4 font-semibold text-red-300">{errorMessage}</p>}

                <form onSubmit={handleSubmit(onLogin)} className="flex flex-col gap-5 sm:gap-6" noValidate>
                    <label className={labelClass}>
                        E-post
                        <input
                            type="email"
                            autoComplete="email"
                            placeholder="din@epost.se"
                            className={inputClass(!!errors.email)}
                            {...register("email", { required: "Skriv din e-post" })}
                        />
                        {errors.email && <span className="text-sm font-medium text-red-300 sm:text-base">{errors.email.message}</span>}
                    </label>

                    <label className={labelClass}>
                        Lösenord
                        <input
                            type="password"
                            autoComplete="current-password"
                            className={inputClass(!!errors.password)}
                            {...register("password", { required: "Skriv ditt lösenord" })}
                        />
                        {errors.password && <span className="text-sm font-medium text-red-300 sm:text-base">{errors.password.message}</span>}
                    </label>

                    {/* Ljusblå knapp med mörk text */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 h-14 w-full rounded-2xl bg-[#8AB0E3] text-lg font-extrabold text-navy transition hover:brightness-105 disabled:opacity-60 sm:h-16 sm:text-xl"
                    >
                        {isSubmitting ? "Loggar in …" : "Logga in"}
                    </button>
                </form>

                <p className="mt-6 text-center text-base text-[#A3AEC4] sm:text-lg">
                    Har du inget konto?{" "}
                    <Link to="/skapa-konto" className="whitespace-nowrap font-bold text-[#8AB0E3] underline underline-offset-4">
                        Skapa konto
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
