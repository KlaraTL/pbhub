import { supabase } from "../lib/supabaseClient";
import type { Game } from "../types/game.types";

const getGames = async (city: string) => {
    const { data, error } = await supabase
        .from("games")
        .select(
            `
        id, starts_at, ends_at, level, form, max_players, venues!inner (name, area, city, type),
        game_participants (count)`,
        )
        .eq("venues.city", city)
        .gte("starts_at", new Date().toISOString())
        .order("starts_at");

    if (error) console.log("Kunde inte h'mta spel:", error);
    return (data ?? []) as unknown as Game[];
};

export default getGames;
