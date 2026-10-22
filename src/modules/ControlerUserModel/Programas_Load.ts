import supabaseService from "../../config/supabase.js";

export default class Programas_load {

    async MostrarProgramas() {
        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);
        try {

            const { data, error } = await authcliente
                .from("Programas")
                .select("*")
                



            return data;
            
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any)?.message || JSON.stringify(error);
        }


    }
}