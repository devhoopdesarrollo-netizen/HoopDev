 
import supabaseService from "../../config/supabase.js";

export default class Anuncios_load {

    async cargarAnuncios() {
        try {
            const token = localStorage.getItem("user_token");
            const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;

            // Depuración automática de reuniones vencidas:
            // Si pasaron 3 días de la fecha propuesta de la reunión, se borra de la base de datos
            try {
                const hoy = new Date();
                const limite = new Date(hoy);
                limite.setDate(limite.getDate() - 3);
                const fechaLimiteStr = limite.toISOString().split("T")[0]; // YYYY-MM-DD

                await client
                    .from("reuniones")
                    .delete()
                    .lt("fecha", fechaLimiteStr);
            } catch (errCleanup) {
                console.warn("Aviso al depurar reuniones vencidas:", errCleanup);
            }

            const { data, error } = await client
                .from("reuniones")
                .select("*")
                .order("fecha", { ascending: true });

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            throw error;
        }
    }
    async delectAnuncio(id: string) {
        try {
            const token = localStorage.getItem("user_token");
            const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;
            const { data, error } = await client
                .from("reuniones")
                .delete()
                .eq("id_reunion", id)
                if(error){
                    throw error;

                }
                return data
        } catch(error) {
            throw error;

        }
    }


}