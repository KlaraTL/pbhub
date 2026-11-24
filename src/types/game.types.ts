export type Level = "nyb" | "med" | "avc" | "alla";

export interface Game {
    id: string;
    starts_at: string;
    ends_at: string;
    level: Level;
    form: "Dubbel" | "Singel";
    max_players: number;
    venues: {
        name: string;
        area: string;
        city: string;
        type: "Inomhus" | "Utomhus";
    };
    game_participants: { count: number }[];
}
