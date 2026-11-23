const HeroBackground = ({ h = 620 }: { h?: number }) => {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 1440 ${h}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Mörkblå bakgrund */}
      <rect width="1440" height={h} fill="#13224A" />

      {/* Ytterkanten runt banan */}
      <polygon
        points={`180,${h} 1260,${h} 1000,${h * 0.36} 440,${h * 0.36}`}
        fill="#1C3566"
      />

      {/* Själva spelytan */}
      <polygon
        points={`300,${h} 1140,${h} 940,${h * 0.43} 500,${h * 0.43}`}
        fill="#2B5C99"
      />

      {/* Linjerna på banan */}
      <g fill="none" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="3">
        <polygon
          points={`300,${h} 1140,${h} 940,${h * 0.43} 500,${h * 0.43}`}
        />
        <line x1="420" y1={h * 0.66} x2="1020" y2={h * 0.66} />
        <line x1="720" y1={h * 0.66} x2="720" y2={h} />
      </g>

      {/* Nätet */}
      <line
        x1="400"
        y1={h * 0.6}
        x2="1040"
        y2={h * 0.6}
        stroke="#FFFFFF"
        strokeOpacity="0.3"
        strokeWidth="4"
      />

      {/* Den gula bollen */}
      <circle cx="1075" cy={h * 0.36} r="14" fill="#D9F24B" />

      {/* Mörkt lager över allt, så att texten syns tydligt */}
      <rect width="1440" height={h} fill="#13224A" opacity="0.4" />
    </svg>
  );
};

export default HeroBackground;