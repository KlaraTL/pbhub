import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import type { UpdateProfileFormData } from "../types/form.types";
import { supabase } from "../lib/supabaseClient";
import useAuth from "../hooks/useAuth";
import HeroBackgroundSmall from "./partials/HeroBackgroundSmall";

const ProfilePage = () => {
    const { currentUser, profile, refreshProfile } = useAuth();
    const [cities, setCities] = useState<{ name: string }[]>([]);
    const [message, setMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    const {
        handleSubmit,
        register,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<UpdateProfileFormData>({
        values: profile
            ? {
                  firstName: profile.first_name ?? "",
                  city: profile.city ?? "",
                  level: profile.level ?? "nyb",
                  password: "",
                  confirmPassword: "",
              }
            : undefined,
        resetOptions: {
            keepDirtyValues: true,
        },
    });

    useEffect(() => {
        supabase
            .from("cities")
            .select()
            .then(({ data }) => {
                if (data) setCities(data);
            });
    }, []);

    const onUpdate: SubmitHandler<UpdateProfileFormData> = async (formData) => {
        if (!currentUser) return;
        setMessage(null);
        setErrorMessage(null);

        const city = (formData.city ?? "").trim();
        if (!city) {
            setErrorMessage("Välj en ort från listan.");
            return;
        }

        // 1. Uppdatera profilen
        const { error: profileError } = await supabase
            .from("profiles")
            .update({
                first_name: (formData.firstName ?? "").trim(),
                city,
                level: formData.level,
            })
            .eq("id", currentUser.id);

        if (profileError) {
            setErrorMessage(profileError.message);
            return;
        }

        // 2. Uppdatera lösenord om ifyllt
        if (formData.password) {
            const { error: passwordError } = await supabase.auth.updateUser({
                password: formData.password,
            });
            if (passwordError) {
                setErrorMessage(passwordError.message);
                return;
            }
        }

        await refreshProfile();
        reset({ ...formData, city, password: "", confirmPassword: "" });
        setShowPasswordFields(false);
        setMessage("Dina ändringar är sparade.");
    };

    const inputClass = (hasError: boolean) =>
        "h-12 w-full min-w-0 rounded-xl border bg-[#1E2A47] px-4 text-base text-white placeholder:text-[#A3AEC4] " +
        "outline-none transition focus:border-[#8AB0E3] focus:ring-4 focus:ring-[#8AB0E3]/25 " +
        (hasError ? "border-red-400" : "border-[#2A3655]");

    const labelClass = "flex flex-col gap-2 text-sm font-bold text-white";

    const levels = [
        { value: "nyb", label: "Nybörjare" },
        { value: "med", label: "Medel" },
        { value: "avc", label: "Avancerad" },
    ];

    if (!profile) {
        return <p className="py-20 text-center font-semibold">Laddar profil …</p>;
    }

    return (
        <div className="relative left-1/2 -mt-6 min-h-[calc(100vh-4rem)] w-screen -translate-x-1/2 overflow-x-clip bg-[#0F1830] pb-16">
            {/* LAGER 1: headern med banan */}
            <section className="relative overflow-hidden">
                <HeroBackgroundSmall />

                {/* LAGER 2: initial, namn och etiketter ovanpå headern */}
                <div className="relative mx-auto flex max-w-6xl items-center gap-6 px-4 pb-32 pt-10 sm:px-8">
                    <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-ball text-4xl font-extrabold text-navy ring-8 ring-white/15 sm:h-32 sm:w-32 sm:text-5xl">
                        {profile.first_name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                        <h1 className="truncate text-4xl font-extrabold tracking-tight text-white sm:text-6xl">{profile.first_name}</h1>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-white/15 px-4 py-1.5 font-bold text-white">{profile.city}</span>
                            <span className="rounded-full bg-ball px-4 py-1.5 font-bold text-navy">
                                {levels.find((l) => l.value === profile.level)?.label}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* LAGER 3: kortet, som går upp i headern med -mt-24 */}
            <div className="relative mx-auto -mt-24 max-w-5xl px-4 sm:px-6">
                <div className="rounded-[28px] border border-[#2A3655] bg-[#172241] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-10">
                    {message && <p className="mb-6 rounded-xl bg-green-500/15 p-3.5 text-sm font-semibold text-green-300">{message}</p>}
                    {errorMessage && <p className="mb-6 rounded-xl bg-red-500/15 p-3.5 text-sm font-semibold text-red-300">{errorMessage}</p>}

                    <form onSubmit={handleSubmit(onUpdate)} className="flex flex-col gap-6" noValidate>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* RAD 1: Förnamn + E-post (från currentUser, ändras ej i updateProfile) */}
                            <label className={`${labelClass} min-w-0`}>
                                <span>Förnamn</span>
                                <input
                                    type="text"
                                    className={inputClass(!!errors.firstName)}
                                    {...register("firstName", { required: "Skriv ditt förnamn" })}
                                />
                                {errors.firstName && <span className="text-xs font-medium text-red-300">{errors.firstName.message}</span>}
                            </label>

                            <label className={`${labelClass} min-w-0`}>
                                <span>E-post</span>
                                <input
                                    type="email"
                                    readOnly
                                    value={currentUser?.email ?? ""}
                                    className={`${inputClass(false)} cursor-default opacity-80`}
                                />
                            </label>

                            {/* RAD 2: Ort + Nivå */}
                            <label className={`${labelClass} min-w-0`}>
                                <span>Ort</span>
                                <div className="relative w-full min-w-0">
                                    <select
                                        className={`${inputClass(!!errors.city)} appearance-none pr-12`}
                                        {...register("city", { required: "Välj din ort" })}
                                    >
                                        {cities.map((c) => (
                                            <option key={c.name} value={c.name}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/80">▾</span>
                                </div>
                                {errors.city && <span className="text-xs font-medium text-red-300">{errors.city.message}</span>}
                            </label>

                            <label className={`${labelClass} min-w-0`}>
                                <span>Nivå</span>
                                <div className="relative w-full min-w-0">
                                    <select className={`${inputClass(false)} appearance-none pr-12`} {...register("level")}>
                                        <option value="nyb">Nybörjare</option>
                                        <option value="med">Medel</option>
                                        <option value="avc">Avancerad</option>
                                    </select>
                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/80">▾</span>
                                </div>
                            </label>
                        </div>

                        {/* Avdelare + valfritt lösenordsbyte */}
                        <div className="border-t border-[#2A3655] pt-5">
                            {!showPasswordFields ? (
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordFields(true)}
                                    className="text-sm font-bold text-[#8AB0E3] hover:underline"
                                >
                                    Byt lösenord →
                                </button>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <label className={`${labelClass} min-w-0`}>
                                        Nytt lösenord
                                        <input
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder="Minst 8 tecken"
                                            className={inputClass(!!errors.password)}
                                            {...register("password", {
                                                validate: (value) => !value || value.length >= 8 || "Minst 8 tecken",
                                            })}
                                        />
                                        {errors.password && <span className="text-xs font-medium text-red-300">{errors.password.message}</span>}
                                    </label>

                                    <label className={`${labelClass} min-w-0`}>
                                        Bekräfta nytt lösenord
                                        <input
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder="Upprepa lösenord"
                                            className={inputClass(!!errors.confirmPassword)}
                                            {...register("confirmPassword", {
                                                validate: (value) => value === watch("password") || "Lösenorden matchar inte",
                                            })}
                                        />
                                        {errors.confirmPassword && (
                                            <span className="text-xs font-medium text-red-300">{errors.confirmPassword.message}</span>
                                        )}
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Knappar */}
                        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                            <Link
                                to="/logout"
                                className="flex h-12 items-center justify-center rounded-xl border border-[#2A3655] px-5 text-sm font-bold text-red-300 transition hover:border-red-400/60 hover:bg-red-500/10"
                            >
                                Logga ut
                            </Link>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-12 rounded-xl bg-[#8AB0E3] px-7 text-base font-extrabold text-navy transition hover:brightness-105 disabled:opacity-60"
                            >
                                {isSubmitting ? "Sparar …" : "Spara"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
