import type { Level } from "../../types/game.types";

const LEVEL_LABELS: Record<Level, string> = {
    nyb: "Nybörjare",
    med: "Medel",
    avc: "Avancerad",
    alla: "Alla nivåer",
};

// Gula etiketten
const LevelBadge = ({ level }: { level: Level }) => {
    return <span className="inline-flex rounded-full bg-ball px-3 py-1 text-sm font-bold text-navy">{LEVEL_LABELS[level]}</span>;
};

export default LevelBadge;
