import { supabase } from "../lib/supabaseClient";
import type { Game } from "../types/game.types";

const getGames = async (city: string) => {
    const { data, error } = await supabase
        .from("games")
        .select(
            `
        id, starts_at, ends_at, level, form, max_players, venues!inner (name, area, city, type, image_url),
        game_participants (count)`,
        )
        .eq("venues.city", city)
        .gte("starts_at", new Date().toISOString())
        .order("starts_at");

    if (error) {
        console.error("Kunde inte hämta spel:", error);
        throw new Error("Kunde inte hämta spel just nu.");
    }
    return (data ?? []) as unknown as Game[];
};

export default getGames;
