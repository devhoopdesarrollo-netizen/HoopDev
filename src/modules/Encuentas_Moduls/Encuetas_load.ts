import supabaseService from "../../config/supabase.js";

export default class Encuetas_load {

    async MostrarEncuetasActuales() {
        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);
        try {

            const { data, error } = await authcliente
                .from("tematicas")
                .select("*")
                .order("fecha_creacion", { ascending: false });



            return data;
            
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any)?.message || JSON.stringify(error);
        }


    }
}