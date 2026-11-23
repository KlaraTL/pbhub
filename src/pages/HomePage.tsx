import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import HeroBackground from "./partials/HeroBackground";
import { Link } from "react-router-dom";

export const HomePage = () => {
    const { profile } = useAuth();

    // Alla orter, och den ort man tittar på just nu
    const [cities, setCities] = useState<{ name: string }[]>([]);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    const city = selectedCity ?? profile?.city ?? "Malmö";

    // Hämta orterna en gång
    useEffect(() => {
        supabase
            .from("cities")
            .select()
            .then(({ data }) => {
                if (data) setCities(data);
            });
    }, []);

    return (
        <>
            {/* HEADER med banan i bakgrunden */}
            <section className="relative left-1/2 -mt-6 w-screen -translate-x-1/2 overflow-hidden text-white">
                <HeroBackground />

                <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center sm:py-32">
                    {/* Hälsning om man är inloggad */}
                    {profile && <p className="mb-3 font-semibold text-white/80">Hej {profile.first_name}!</p>}

                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">Hitta pickleball nära dig</h1>
                    <p className="mt-4 text-lg text-white/85 sm:text-xl">Spel, banor, spelare och coacher i din stad, samlat på ett ställe.</p>

                    {/* Ortväljaren */}
                    <label className="mt-8 flex items-center gap-3 font-bold">
                        Ort
                        <select
                            value={city}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="h-12 min-w-48 rounded-xl bg-white px-4 font-bold text-navy"
                        >
                            {cities.map((c) => (
                                <option key={c.name} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <Link to="/create" className="mt-6 font-bold text-white underline decoration-ball decoration-2 underline-offset-4">
                        eller skapa ett eget spel →
                    </Link>
                </div>
            </section>

            {/* KOMMANDE SPEL */}
            <section className="py-10">
                <h2 className="mb-6 text-3xl font-extrabold text-navy">Kommande spel i {city}</h2>

                {/* Tomt läge tills spelen finns i databasen */}
                <div className="rounded-2xl border-2 border-dashed border-[#E1E6EF] p-10 text-center">
                    <p className="text-lg font-bold text-navy">Inga spel här än</p>
                    <p className="mt-1 text-[#4A5568]">Bli först med att skapa ett spel i {city}.</p>
                    <Link to="/create" className="mt-4 inline-block rounded-xl bg-[#1F5FA0] px-6 py-3 font-bold text-white">
                        Skapa spel
                    </Link>
                </div>
            </section>
        </>
    );
};
