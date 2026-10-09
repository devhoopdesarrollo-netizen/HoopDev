

import supabaseService from "../../config/supabase.js";
import { iPostNew } from "../../types/types.js";
import StorageImagen from "./StorageImagenes.js";


export default class Post_New {

    async crearPostNew(date: iPostNew, file: File): Promise<any> {

        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);
        const storage = new StorageImagen();
        try {
            const imgDireccion = await storage.uploadPostImagen(file, authcliente)
            const fechaPost = date.fechaCreacion || new Date().toISOString();
            const { data, error } = await authcliente
                .from("Post")
                .insert([
                    {
                        fk_user: date.fk_user,
                        img_direccion: imgDireccion,
                        contenido: date.contenido,
                        fecha_post: fechaPost,
                    }
                ])
                .select();
            if (error) throw error;
            return data;

        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any)?.message || JSON.stringify(error);
        }


    }
    async likePost(id_post: string): Promise<any> {
        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }const authcliente = supabaseService.UserAuntentiked_Token(token);
        try {
            const { data, error } = await authcliente
                .from("Post")
                .update({ likes: +1 })
                .eq("id_post", id_post)
                .select();
            if (error) throw error;
            return data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any)?.message || JSON.stringify(error);
        }
    }

}