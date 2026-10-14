import supabaseService from "../../config/supabase.js";
export default class Horarios_load{


    async cargarHorarios(idUser:string) {
        try {
            const token = localStorage.getItem("user_token");
            const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;
            
            const { data, error } = await client
                .from("Horarios")
                .select("*")
                .eq("fk_user",idUser)
                
            if (error) {
                throw error;
            }

           
            return data;
        } catch (error) {
           
            throw error;
        }
    }
    async deleteDay(id:string){
         try {
            const token = localStorage.getItem("user_token");
            const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;
            
            const { data, error } = await client
                .from("Horarios")
                .delete()
                .eq("id_horarios",id)
                
            if (error) {
                throw error;
            }

           
            return data;
        } catch (error) {
           
            throw error;
        }
    }

}