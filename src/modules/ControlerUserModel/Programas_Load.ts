import supabaseService from "../../config/supabase.js";

export default class Programas_load {

    async MostrarProgramas(): Promise<any[]> {
        const token = localStorage.getItem("user_token");
        const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;
        try {
            const { data, error } = await client
                .from("Programas")
                .select("*");

            if (error) {
                console.error("Error al cargar programas:", error);
                return [];
            }
            return data || [];
        } catch (error: unknown) {
            console.error("Error en MostrarProgramas:", error);
            return [];
        }
    }

    async deletePrograma(id: string): Promise<boolean> {
        if (!id || id === "undefined" || id === "null") {
            console.error("ID inválido recibido en deletePrograma:", id);
            return false;
        }

        const token = localStorage.getItem("user_token");
        const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;

        try {
            let res = await client
                .from("Programas")
                .delete()
                .eq("id_programa", id);

            if (res.error && res.error.code === '42703') {
                // Si la columna id_programa no existe, intentar con id_programas
                res = await client
                    .from("Programas")
                    .delete()
                    .eq("id_programas", id);
            }

            if (res.error) {
                console.error("Error al eliminar programa:", res.error);
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error inesperado en deletePrograma:", error);
            return false;
        }
    }
}