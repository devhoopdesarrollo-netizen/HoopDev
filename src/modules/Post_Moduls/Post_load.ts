import supabaseService from "../../config/supabase.js";
import { iPostResponse, PostLike } from "../../types/types.js";

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

            console.log("Datos de publicaciones cargados:", data);
            
            
        
            
            return data;
            

        } catch (error) {
           
            throw error;
        }
    }
     async LikeCarga(id:string) {
        try {
            const token = localStorage.getItem("user_token");
            const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;
            
            const { data, error } = await client
                .from("v_post_likes")
                .select(`*`)
                .eq("id_post",id );

            if (error) {
                throw error;
            }

        
            return data;

        } catch (error) {
           
            throw error;
        }
    }
}