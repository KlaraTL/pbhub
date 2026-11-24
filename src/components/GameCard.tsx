import { Link } from "react-router-dom";
import type { Game } from "../types/game.types";
import LevelBadge from "./auth/LevelBadge";

// Visar t.ex. "Idag 18.00", "Imorgon 19.30" eller "Fre 17.30"
const formatWhen = (iso: string) => {
    const date = new Date(iso);

    // Räkna ut hur många dagar bort spelet är
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    const diff = Math.round((day.getTime() - today.getTime()) / 86400000);

    const time = date.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }).replace(":", ".");

    if (diff === 0) return `Idag ${time}`;
    if (diff === 1) return `Imorgon ${time}`;

    const weekday = date.toLocaleDateString("sv-SE", { weekday: "short" }).replace(".", "");
    return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)} ${time}`;
};

// Visar platsens bild om en finns, annars en platshållare
const VenueImage = ({ src, name }: { src: string | null; name: string }) => {
    if (src) {
        return <img src={src} alt={name} className="h-full w-full object-cover" />;
    }

    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#E7EEF7] text-[#4A5568]">
            <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="9" cy="10" r="1.6" />
                <path d="M21 16l-5-5-9 8" />
            </svg>
            <span className="text-sm font-semibold">Bild kommer</span>
        </div>
    );
};

const GameCard = ({ game }: { game: Game }) => {
    // Antal som är med, och hur många platser som är kvar
    const taken = game.game_participants[0]?.count ?? 0;
    const free = Math.max(0, game.max_players - taken);

    return (
        <Link
            to={`/games/${game.id}`}
            className="flex flex-col overflow-hidden rounded-2xl border border-[#E1E6EF] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
            {/* Bilden, med tiden ovanpå */}
            <div className="relative h-36">
                <VenueImage src={game.venues.image_url} name={game.venues.name} />
                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-bold text-navy shadow-sm">
                    {formatWhen(game.starts_at)}
                </span>
            </div>

            {/* Texten */}
            <div className="flex flex-1 flex-col gap-1 p-4">
                <h3 className="text-lg font-extrabold text-navy">Öppet spel, {game.form.toLowerCase()}</h3>
                <p className="text-[#4A5568]">
                    {game.venues.name}, {game.venues.area}
                </p>

                {/* Nivå till vänster, lediga platser till höger */}
                <div className="mt-auto flex items-center justify-between pt-3">
                    <LevelBadge level={game.level} />
                    <span className="text-sm font-semibold text-[#4A5568]">
                        {free === 0 ? `Fullt, ${game.max_players}/${game.max_players}` : `${free}/${game.max_players} platser lediga`}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default GameCard;
