import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

// Stilen för länkarna i menyn (med gult streck under aktiv sida)
const linkStyle = ({ isActive }: { isActive: boolean }) => {
    if (isActive) {
        return "px-3 py-2 font-bold underline decoration-[#D9F24B] decoration-[3px] underline-offset-[10px]";
    }
    return "px-3 py-2 font-bold hover:underline hover:decoration-white/40 decoration-[3px] underline-offset-[10px]";
};

export const Navigation = () => {
    const [open, setOpen] = useState(false);

    return (
        <header className="bg-navy text-white">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                {/* LOGGAN */}
                <Link to="/" className="flex items-center gap-2 font-logo text-xl tracking-wider">
                    <span className="h-7 w-7 rounded-full border-2 border-white bg-ball inline-block"></span>
                    The PBHUB
                </Link>

                {/* LÄNKARNA (Dator) */}
                <div className="hidden gap-2 md:flex">
                    <NavLink to="/" end className={linkStyle}>
                        Hem
                    </NavLink>
                    <NavLink to="/explore" className={linkStyle}>
                        Utforska
                    </NavLink>
                    <NavLink to="/my-games" className={linkStyle}>
                        Mina spel
                    </NavLink>
                    <NavLink to="/chat" className={linkStyle}>
                        Chatt
                    </NavLink>
                </div>

                {/* KNAPPAR TILL HÖGER */}
                <div className="flex items-center gap-2">
                    <Link to="/login" className="hidden rounded-md border border-white/60 px-4 py-2 font-bold hover:border-white md:block">
                        Logga in
                    </Link>

                    <Link to="/login" className="rounded-md bg-ball px-4 py-2 font-bold text-navy">
                        Gå med gratis
                    </Link>

                    {/* MENYKNAPP (Mobil) */}
                    <button onClick={() => setOpen(!open)} aria-label="Meny" className="rounded-full bg-white/10 px-3 py-2 md:hidden">
                        ☰
                    </button>
                </div>
            </nav>

            {/* MOBILMENY */}
            {open && (
                <div className="flex flex-col px-4 pb-4 md:hidden bg-navy border-t border-white/10">
                    <NavLink to="/" end className="py-3 font-bold" onClick={() => setOpen(false)}>
                        Hem
                    </NavLink>
                    <NavLink to="/explore" className="py-3 font-bold" onClick={() => setOpen(false)}>
                        Utforska
                    </NavLink>
                    <NavLink to="/my-games" className="py-3 font-bold" onClick={() => setOpen(false)}>
                        Mina spel
                    </NavLink>
                    <NavLink to="/chat" className="py-3 font-bold" onClick={() => setOpen(false)}>
                        Chatt
                    </NavLink>
                    <NavLink to="/login" className="py-3 font-bold" onClick={() => setOpen(false)}>
                        Logga in
                    </NavLink>
                </div>
            )}
        </header>
    );
};

export default Navigation;
