import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// Stilen för länkarna i menyn.
function linkStyle({ isActive }: { isActive: boolean }) {
    if (isActive) {
        return "px-3 py-2 font-bold underline decoration-[#D9F24B] decoration-[3px] underline-offset-[10px]";
    }
    return "px-3 py-2 font-bold hover:underline hover:decoration-white/40 decoration-[3px] underline-offset-[10px]";
}

export const Navigation = () => {
    const [open, setOpen] = useState(false);

    // profile finns när någon är inloggad, annars är den null
    const { profile } = useAuth();

    // Stänger mobilmenyn, används när man klickar på en länk
    const close = () => setOpen(false);

    return (
        // Mörkblå bakgrund och vit text för hela menyn
        <header className="bg-navy text-white">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                {/* LOGGAN */}
                <Link to="/" onClick={close} className="flex items-center gap-2 font-['Bungee'] text-xl">
                    <span className="inline-block h-7 w-7 shrink-0 rounded-full border-2 border-white bg-ball" />
                    The PBhub
                </Link>

                {/* LÄNKARNA: syns bara på större skärmar (md:flex) */}
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

                {/* KNAPPARNA TILL HÖGER */}
                <div className="flex items-center gap-2">
                    {profile ? (
                        // INLOGGAD
                        <>
                            <Link to="/skapa" className="hidden rounded-md bg-ball px-4 py-2 font-bold text-navy md:block">
                                + Skapa spel
                            </Link>

                            <Link to="/logga-ut" className="hidden rounded-md bg-ball px-4 py-2 font-bold text-navy md:block">
                                Logga ut
                            </Link>

                            <Link
                                to="/profil"
                                onClick={close}
                                aria-label="Din profil"
                                className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-navy"
                            >
                                {profile.first_name?.charAt(0).toUpperCase() || "?"}
                            </Link>
                        </>
                    ) : (
                        // UTLOGGAD: Logga in och Gå med gratis
                        <>
                            <Link to="/logga-in" className="hidden rounded-md border border-white/60 px-4 py-2 font-bold hover:border-white md:block">
                                Logga in
                            </Link>
                            <Link to="/skapa-konto" onClick={close} className="rounded-md bg-ball px-4 py-2 font-bold text-navy">
                                Gå med gratis
                            </Link>
                        </>
                    )}

                    {/* MENYKNAPPEN: syns bara i mobilen (md:hidden). */}
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        aria-label="Meny"
                        aria-expanded={open}
                        className="rounded-full bg-white/10 px-3 py-2 md:hidden"
                    >
                        ☰
                    </button>
                </div>
            </nav>

            {/* MOBILMENYN: visas bara när open är true */}
            {open && (
                <div className="flex flex-col px-4 pb-4 md:hidden">
                    <NavLink to="/" end className="py-3 font-bold" onClick={close}>
                        Hem
                    </NavLink>
                    <NavLink to="/utforska" className="py-3 font-bold" onClick={close}>
                        Utforska
                    </NavLink>
                    <NavLink to="/mina-spel" className="py-3 font-bold" onClick={close}>
                        Mina spel
                    </NavLink>
                    <NavLink to="/chatt" className="py-3 font-bold" onClick={close}>
                        Chatt
                    </NavLink>

                    {/* Om man är inloggad visa */}
                    {profile ? (
                        <>
                            <NavLink to="/skapa" className="py-3 font-bold" onClick={close}>
                                Skapa spel
                            </NavLink>
                            <NavLink to="/logga-ut" className="py-3 font-bold" onClick={close}>
                                Logga ut
                            </NavLink>
                        </>
                    ) : (
                        <NavLink to="/logga-in" className="py-3 font-bold" onClick={close}>
                            Logga in
                        </NavLink>
                    )}
                </div>
            )}
        </header>
    );
};
export default Navigation;
