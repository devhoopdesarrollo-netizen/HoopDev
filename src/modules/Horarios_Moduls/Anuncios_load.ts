
import supabaseService from "../../config/supabase.js";

export default class Anuncios_load {

    async cargarAnuncios() {
        try {
            const token = localStorage.getItem("user_token");
            const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;

            const { data, error } = await client
                .from("reuniones")
                .select("*")
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