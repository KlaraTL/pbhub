import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import type { Game } from "../types/game.types";

import HeroBackground from "./partials/HeroBackground";
import GameCard from "../components/GameCard";
import getGames from "../service/gameService";

// Hjälpfunktion: midnatt för ett datum, så att vi kan jämföra dagar
const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x.getTime();
};

export const HomePage = () => {
    const { profile } = useAuth();

    // Alla orter, och den ort man tittar på just nu
    const [cities, setCities] = useState<{ name: string }[]>([]);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    // Spel, laddningsstatus och felmeddelande
    const [games, setGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Valt filter för dag och nivå
    const [day, setDay] = useState("all");
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

    const city = selectedCity ?? profile?.city ?? "Malmö";
    const level = selectedLevel ?? profile?.level ?? "all";

    // Hämta orterna 
    useEffect(() => {
        supabase
            .from("cities")
            .select()
            .then(({ data }) => {
                if (data) setCities(data);
            });
    }, []);

    // Hämta kommande spel när vald ort ändras
    useEffect(() => {
        let isMounted = true;

        const fetchGames = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const data = await getGames(city);
                if (isMounted) {
                    setGames(data);
                }
            } catch (err) {
                if (isMounted) {
                    setErrorMessage(err instanceof Error ? err.message : "Kunde inte hämta spel.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchGames();

        return () => {
            isMounted = false;
        };
    }, [city]);

    // Filtrera spelen baserat på vald dag och nivå
    const today = startOfDay(new Date());
    const tomorrow = today + 86400000;

    const filteredGames = games.filter((game) => {
        const gameDay = startOfDay(new Date(game.starts_at));
        const weekday = new Date(game.starts_at).getDay(); // 0 = söndag, 6 = lördag

        // Dag
        if (day === "today" && gameDay !== today) return false;
        if (day === "tomorrow" && gameDay !== tomorrow) return false;
        if (day === "weekend" && weekday !== 0 && weekday !== 6) return false;

        // Nivå. Spel för "alla nivåer" passar alla.
        if (level !== "all" && game.level !== level && game.level !== "alla") return false;

        return true;
    });

    const hasActiveFilter = day !== "all" || level !== "all";

    return (
        <div className="relative left-1/2 -mt-6 min-h-[calc(100vh-4rem)] w-screen -translate-x-1/2 overflow-x-clip bg-[#0F1830] pb-16">
            {/* HEADER med banan i bakgrunden */}
            <section className="relative overflow-hidden text-white">
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
            <section className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-3xl font-extrabold text-white">Kommande spel i {city}</h2>

                    {games.length > 0 && (
                        <Link to="/explore" className="font-bold text-[#8AB0E3] hover:underline">
                            Visa alla spel →
                        </Link>
                    )}
                </div>

                {/* FILTER-DROPDOWNS (Dag & Nivå) */}
                {!isLoading && !errorMessage && (
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                        <div className="flex flex-wrap gap-4">
                            <label className="flex flex-col gap-1.5 text-sm font-bold text-white/85">
                                Dag
                                <div className="relative">
                                    <select
                                        value={day}
                                        onChange={(e) => setDay(e.target.value)}
                                        className="h-11 min-w-44 cursor-pointer appearance-none rounded-xl border border-[#2A3655] bg-[#172241] pl-3.5 pr-10 text-sm font-bold text-white outline-none transition focus:border-[#8AB0E3]"
                                    >
                                        <option value="all">Alla dagar</option>
                                        <option value="today">Idag</option>
                                        <option value="tomorrow">Imorgon</option>
                                        <option value="weekend">Helg</option>
                                    </select>
                                    <svg
                                        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/75"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M6 8l4 4 4-4" />
                                    </svg>
                                </div>
                            </label>

                            <label className="flex flex-col gap-1.5 text-sm font-bold text-white/85">
                                Nivå
                                <div className="relative">
                                    <select
                                        value={level}
                                        onChange={(e) => setSelectedLevel(e.target.value)}
                                        className="h-11 min-w-44 cursor-pointer appearance-none rounded-xl border border-[#2A3655] bg-[#172241] pl-3.5 pr-10 text-sm font-bold text-white outline-none transition focus:border-[#8AB0E3]"
                                    >
                                        <option value="all">Alla nivåer</option>
                                        <option value="nyb">Nybörjare</option>
                                        <option value="med">Medel</option>
                                        <option value="avc">Avancerad</option>
                                    </select>
                                    <svg
                                        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/75"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M6 8l4 4 4-4" />
                                    </svg>
                                </div>
                            </label>
                        </div>

                        <span className="text-sm font-semibold text-white/70">
                            {filteredGames.length} {filteredGames.length === 1 ? "spel" : "spel"}
                        </span>
                    </div>
                )}

                {isLoading && <p className="py-10 text-center font-semibold text-white/80">Hämtar kommande spel …</p>}

                {!isLoading && errorMessage && (
                    <div className="rounded-2xl border border-red-400/30 bg-red-500/15 p-6 text-center text-red-300">
                        <p className="font-bold">{errorMessage}</p>
                    </div>
                )}

                {/* Inga spel matchar / finns */}
                {!isLoading && !errorMessage && filteredGames.length === 0 && (
                    <div className="rounded-2xl border-2 border-dashed border-[#2A3655] bg-[#172241]/40 p-12 text-center">
                        <p className="text-lg font-extrabold text-white">{hasActiveFilter ? "Inga spel matchar just nu" : "Inga spel här än"}</p>
                        <p className="mt-1 text-sm text-white/70">
                            {hasActiveFilter
                                ? "Prova ett annat filter eller en annan ort, eller skapa ett eget spel."
                                : `Bli först med att skapa ett spel i ${city}.`}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                            <Link
                                to="/create"
                                className="inline-block rounded-xl bg-[#8AB0E3] px-6 py-3 text-sm font-extrabold text-navy transition hover:brightness-105"
                            >
                                Skapa spel
                            </Link>

                            {hasActiveFilter && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDay("all");
                                        setSelectedLevel("all");
                                    }}
                                    className="rounded-xl border border-[#2A3655] bg-[#172241] px-5 py-3 text-sm font-bold text-white transition hover:border-[#8AB0E3]"
                                >
                                    Återställ filter
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Matchande spelkort */}
                {!isLoading && !errorMessage && filteredGames.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredGames.map((game) => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
