import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function linkStyle({ isActive }: { isActive: boolean }) {
    if (isActive) {
        return "px-3 py-2 font-bold underline decoration-[#D9F24B] decoration-[3px] underline-offset-[10px]";
    }
    return "px-3 py-2 font-bold hover:underline hover:decoration-white/40 decoration-[3px] underline-offset-[10px]";
}

function mobileLinkStyle({ isActive }: { isActive: boolean }) {
    return isActive ? "py-3.5 text-2xl font-extrabold text-[#D9F24B]" : "py-3.5 text-2xl font-bold text-white transition hover:text-[#D9F24B]";
}

export const Navigation = () => {
    const [open, setOpen] = useState(false);
    const { profile } = useAuth();
    const close = () => setOpen(false);

    // Lås scroll på bakgrunden när mobilmenyn är öppen
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <header className="bg-navy text-white">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                {/* LOGGAN */}
                <Link to="/" onClick={close} className="flex shrink-0 items-center gap-2 font-['Bungee'] text-lg sm:text-xl">
                    <span className="inline-block h-7 w-7 shrink-0 rounded-full border-2 border-white bg-ball" />
                    The PBhub
                </Link>

                {/* DESKTOP-LÄNKAR */}
                <div className="hidden gap-2 md:flex">
                    <NavLink to="/" end className={linkStyle}>
                        Hem
                    </NavLink>
                    <NavLink to="/utforska" className={linkStyle}>
                        Utforska
                    </NavLink>
                    <NavLink to="/mina-spel" className={linkStyle}>
                        Mina spel
                    </NavLink>
                    <NavLink to="/chatt" className={linkStyle}>
                        Chatt
                    </NavLink>
                </div>

                {/* HÖGERDEL */}
                <div className="flex items-center gap-2.5">
                    {profile ? (
                        <>
                            <Link to="/skapa" className="hidden rounded-md bg-ball px-4 py-2 font-bold text-navy md:block">
                                + Skapa spel
                            </Link>

                            <Link
                                to="/logga-ut"
                                className="hidden rounded-md border-2 border-ball bg-transparent px-4 py-1.5 font-bold text-ball transition hover:bg-ball hover:text-navy md:block"
                            >
                                Logga ut
                            </Link>

                            <Link
                                to="/profil"
                                onClick={close}
                                aria-label="Din profil"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-bold text-navy"
                            >
                                {profile.first_name?.charAt(0).toUpperCase() || "?"}
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/logga-in" className="hidden rounded-md border border-white/60 px-4 py-2 font-bold hover:border-white md:block">
                                Logga in
                            </Link>
                            <Link to="/skapa-konto" onClick={close} className="hidden rounded-md bg-ball px-4 py-2 font-bold text-navy md:block">
                                Gå med gratis
                            </Link>
                        </>
                    )}

                    {/* HAMBURGERMENY (mobil) */}
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        aria-label="Öppna meny"
                        aria-expanded={open}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg md:hidden"
                    >
                        ☰
                    </button>
                </div>
            </nav>

            {/* HELSKÄRMS-MOBILMENY */}
            {open && (
                <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0F1830] px-6 py-4 text-white md:hidden">
                    {/* Topprad i menyn med logga och tydligt kryss */}
                    <div>
                        <div className="flex items-center justify-between pb-6">
                            <Link to="/" onClick={close} className="flex items-center gap-2 font-['Bungee'] text-lg">
                                <span className="inline-block h-7 w-7 shrink-0 rounded-full border-2 border-white bg-ball" />
                                The PBhub
                            </Link>

                            <button
                                type="button"
                                onClick={close}
                                aria-label="Stäng meny"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-lg font-bold transition hover:bg-white/20"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Navigationslänkar */}
                        <div className="mt-2 flex flex-col divide-y divide-white/10">
                            <NavLink to="/" end className={mobileLinkStyle} onClick={close}>
                                Hem
                            </NavLink>
                            <NavLink to="/utforska" className={mobileLinkStyle} onClick={close}>
                                Utforska
                            </NavLink>
                            <NavLink to="/mina-spel" className={mobileLinkStyle} onClick={close}>
                                Mina spel
                            </NavLink>
                            <NavLink to="/chatt" className={mobileLinkStyle} onClick={close}>
                                Chatt
                            </NavLink>
                        </div>
                    </div>

                    {/* Knappar längst ner i tumhöjd */}
                    <div className="flex flex-col gap-3 pb-4 pt-6">
                        {profile ? (
                            <>
                                <NavLink
                                    to="/skapa"
                                    className="rounded-xl bg-ball px-4 py-3.5 text-center text-lg font-extrabold text-navy"
                                    onClick={close}
                                >
                                    + Skapa spel
                                </NavLink>
                                <NavLink
                                    to="/logga-ut"
                                    className="rounded-xl border-2 border-ball px-4 py-3 text-center text-lg font-bold text-ball"
                                    onClick={close}
                                >
                                    Logga ut
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink
                                    to="/logga-in"
                                    className="rounded-xl border border-white/40 px-4 py-3 text-center text-lg font-bold"
                                    onClick={close}
                                >
                                    Logga in
                                </NavLink>
                                <NavLink
                                    to="/skapa-konto"
                                    className="rounded-xl bg-ball px-4 py-3.5 text-center text-lg font-extrabold text-navy"
                                    onClick={close}
                                >
                                    Skapa konto
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navigation;
