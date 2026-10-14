import supabaseService from "../../config/supabase.js";

export default class userList_moduls {
    async cargarUser() {
        try {
            const token = localStorage.getItem("user_token");
            const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;

            const { data, error } = await client
                .from("User")
                .select(`
                        id_user,
                        nombre,
                        fk_programas
                `)

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {

            throw error;
        }
    }

}