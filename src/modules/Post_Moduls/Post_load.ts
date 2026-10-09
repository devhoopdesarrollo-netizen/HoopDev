import supabaseService from "../../config/supabase.js";
import { iPostResponse } from "../../types/types.js";

export default class Post_Load {
    async cargarPost() {
        try {
            const token = localStorage.getItem("user_token");
            const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;
            
            const { data, error } = await client
                .from("Post")
                .select(`
                    id_post,
                    contenido,
                    likes,
                    img_direccion,
                    fecha_post,
                    User (
                        id_user,
                        nombre
                    )
                `)
                .order("fecha_creacion", { ascending: false });

            if (error) {
                throw error;
            }

          
            return data;
        } catch (error) {
           
            throw error;
        }
    }
}