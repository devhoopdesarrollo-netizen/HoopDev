import supabaseService from "../../config/supabase.js";

export default class User_control_load {

    async MostrarEncuetasActuales() {
        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);
        try {

            const { data, error } = await authcliente
                .from("User")
                .select("*")
               
                



            return data;
            
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any)?.message || JSON.stringify(error);
        }


    }
}