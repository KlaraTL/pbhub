import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import type { SignupFormData } from "../../types/form.types";
import { supabase } from "../../lib/supabaseClient";
import useAuth from "../../hooks/useAuth";

const SignupPage = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [cities, setCities] = useState<{ name: string }[]>([]);
    const {
        handleSubmit,
        register,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormData>({
        // Orten är tom från början, så att man skriver in den själv
        defaultValues: { level: "nyb" },
    });
    const { signup } = useAuth();
    const navigate = useNavigate();

    // Hämta orterna till förslagslistan
    useEffect(() => {
        supabase
            .from("cities")
            .select()
            .then(({ data }) => {
                if (data) setCities(data);
            });
    }, []);

    const onSignup: SubmitHandler<SignupFormData> = async (formData) => {
        setErrorMessage(null);

        // Hitta orten med rätt stavning från databasen, t.ex. "malmö" blir "Malmö"
        const city = cities.find((c) => c.name.toLowerCase() === formData.city.trim().toLowerCase())?.name;

        if (!city) {
            setErrorMessage("Välj en ort från listan.");
            return;
        }

        const { error } = await signup(formData.email, formData.password, formData.firstName.trim(), city, formData.level);

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        navigate("/");
    };

    // Mörka fält med ljus text. Blå ram när man klickar i fältet, röd vid fel.
    const inputClass = (hasError: boolean) =>
        "h-14 w-full rounded-2xl border bg-[#1E2A47] px-5 text-lg text-white placeholder:text-[#A3AEC4] " +
        "outline-none transition focus:border-[#8AB0E3] focus:ring-4 focus:ring-[#8AB0E3]/25 " +
        (hasError ? "border-red-400" : "border-[#2A3655]");

    // Rubriken ovanför varje fält
    const labelClass = "flex flex-col gap-3 text-lg font-bold text-white";

    // Nivåerna som runda knappar
    const levels = [
        { value: "nyb", label: "Nybörjare" },
        { value: "med", label: "Medel" },
        { value: "avc", label: "Avancerad" },
    ];

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
            <div className="w-full max-w-xl rounded-[28px] border border-[#2A3655] bg-[#172241] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-10">
                {/* Rubrik */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white">Skapa ditt konto</h1>
                </div>

                {/* Felmeddelande */}
                {errorMessage && <p className="mb-6 rounded-2xl bg-red-500/15 p-4 font-semibold text-red-300">{errorMessage}</p>}

                <form onSubmit={handleSubmit(onSignup)} className="flex flex-col gap-6" noValidate>
                    <label className={labelClass}>
                        Förnamn
                        <input
                            autoComplete="given-name"
                            className={inputClass(!!errors.firstName)}
                            {...register("firstName", { required: "Skriv ditt förnamn" })}
                        />
                        {errors.firstName && <span className="text-base font-medium text-red-300">{errors.firstName.message}</span>}
                    </label>

                    <label className={labelClass}>
                        E-post
                        <input
                            type="email"
                            autoComplete="email"
                            className={inputClass(!!errors.email)}
                            {...register("email", { required: "Skriv din e-post" })}
                        />
                        {errors.email && <span className="text-base font-medium text-red-300">{errors.email.message}</span>}
                    </label>

                    <label className={labelClass}>
                        Ort
                        <input
                            list="city-list"
                            autoComplete="off"
                            placeholder="t.ex. Malmö"
                            className={inputClass(!!errors.city)}
                            {...register("city", {
                                required: "Skriv din ort",
                                // Godkänn bara en ort som finns i listan, oavsett stora eller små bokstäver
                                validate: (value) =>
                                    cities.some((c) => c.name.toLowerCase() === value.trim().toLowerCase()) || "Välj en ort från listan",
                            })}
                        />
                        {/* Förslagen som visas medan man skriver */}
                        <datalist id="city-list">
                            {cities.map((c) => (
                                <option key={c.name} value={c.name} />
                            ))}
                        </datalist>
                        {errors.city && <span className="text-base font-medium text-red-300">{errors.city.message}</span>}
                    </label>

                    <label className={labelClass}>
                        Lösenord
                        <input
                            type="password"
                            autoComplete="new-password"
                            className={inputClass(!!errors.password)}
                            {...register("password", {
                                required: "Skriv ett lösenord",
                                minLength: { value: 8, message: "Minst 8 tecken" },
                            })}
                        />
                        <span className="text-base font-semibold text-[#A3AEC4]">Minst 8 tecken</span>
                        {errors.password && <span className="text-base font-medium text-red-300">{errors.password.message}</span>}
                    </label>

                    <label className={labelClass}>
                        Bekräfta lösenord
                        <input
                            type="password"
                            autoComplete="new-password"
                            className={inputClass(!!errors.confirmPassword)}
                            {...register("confirmPassword", {
                                required: "Skriv lösenordet igen",
                                validate: (value) => value === watch("password") || "Lösenorden matchar inte",
                            })}
                        />
                        {errors.confirmPassword && <span className="text-base font-medium text-red-300">{errors.confirmPassword.message}</span>}
                    </label>

                    {/* Nivå som runda knappar. Varje knapp är en dold radioknapp,
              och peer-checked färgar den valda gul. */}
                    <fieldset>
                        <legend className="mb-4 text-2xl font-extrabold text-white">Din nivå</legend>
                        <div className="flex flex-wrap gap-3">
                            {levels.map((l) => (
                                <label key={l.value} className="cursor-pointer">
                                    <input type="radio" value={l.value} className="peer sr-only" {...register("level")} />
                                    <span
                                        className="inline-flex h-14 items-center rounded-full border border-[#2A3655] px-7 text-lg font-bold text-white transition
                               hover:border-[#A3AEC4]
                               peer-checked:border-ball peer-checked:bg-ball peer-checked:text-navy
                               peer-focus-visible:ring-4 peer-focus-visible:ring-[#8AB0E3]/40"
                                    >
                                        {l.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    {/* Ljusblå knapp med mörk text */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 h-16 w-full rounded-2xl bg-[#8AB0E3] text-xl font-extrabold text-navy transition hover:brightness-105 disabled:opacity-60"
                    >
                        {isSubmitting ? "Skapar konto …" : "Skapa konto"}
                    </button>
                </form>

                <p className="mt-6 text-center text-lg text-[#A3AEC4]">
                    Har du redan ett konto?{" "}
                    <Link to="/login" className="font-bold text-[#8AB0E3] underline underline-offset-4">
                        Logga in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
