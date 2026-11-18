import { useEffect } from "react";
import { supabase } from "./lib/supabaseClient";

function App() {
    useEffect(() => {
        async function testConnection() {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error("❌ Något gick fel:", error.message);
            } else {
                console.log("✅ Kopplingen till Supabase fungerar!", data);
            }
        }

        testConnection();
    }, []);

    return <h1>Testar Supabase... (kolla konsolen i webbläsaren)</h1>;
}

export default App;
