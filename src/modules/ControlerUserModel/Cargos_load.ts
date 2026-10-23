import supabaseService from "../../config/supabase.js";

export default class Cargos_load {

    async MostrarCargo(): Promise<any[]> {
        const token = localStorage.getItem("user_token");
        const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;
        try {
            const { data, error } = await client
                .from("Cargo")
                .select("*");

            if (error) {
                console.error("Error al cargar cargos:", error);
                return [];
            }
            return data || [];
        } catch (error: unknown) {
            console.error("Error en MostrarCargo:", error);
            return [];
        }
    }

    async deleteCargo(id: string): Promise<boolean> {
        const token = localStorage.getItem("user_token");
        const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;
        try {
            const { error } = await client
                .from("Cargo")
                .delete()
                .eq("id_cargo", id);

            if (error) {
                console.error("Error al eliminar cargo:", error);
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error inesperado en deleteCargo:", error);
            return false;
        }
    }
}