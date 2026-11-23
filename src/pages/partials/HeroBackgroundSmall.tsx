// Mörkblå bakgrund med banan till höger, så att den aldrig hamnar bakom texten
const HeroBackgroundSmall = () => {
    return (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 380" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
            <rect width="1440" height="380" fill="#13224A" />

            {/* Banan, nere till höger */}
            <polygon points="980,380 1440,380 1440,150 1120,150" fill="#1C3566" />
            <polygon points="1060,380 1440,380 1440,190 1170,190" fill="#22427A" />

            {/* Linjerna, svaga så att de inte stör */}
            <g fill="none" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="3">
                <polygon points="1060,380 1440,380 1440,190 1170,190" />
                <line x1="1110" y1="300" x2="1440" y2="300" />
                <line x1="1290" y1="300" x2="1290" y2="380" />
            </g>

            {/* Nätet */}
            <line x1="1085" y1="268" x2="1440" y2="268" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="4" />
        </svg>
    );
};

export default HeroBackgroundSmall;
