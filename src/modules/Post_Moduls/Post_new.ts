

import supabaseService from "../../config/supabase.js";
import Controller from "../../controllers/Controller.js";
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
    async likePost(id_post: string, fk_user: string | null): Promise<any> {

        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }

        const authcliente = supabaseService.UserAuntentiked_Token(token);

        console.log("Intentando dar like al post con ID:", id_post, "para el usuario con ID:", fk_user);

        try {
            // 1. Intentamos insertar el like
            const { data, error } = await authcliente
                .from("PostHistorial")
                .insert([
                    {
                        fk_user: fk_user,
                        fk_post: id_post,
                        is_like: true,
                    }
                ])
                .select();

            if (error) throw error;
            return data;

        } catch (error: unknown) {
            console.warn("Fallo el insert directo (probablemente ya existe), buscando registro existente...");

            try {

                // 2. Si falla el insert, buscamos el id_subpost usando los .eq() correctos
                const { data, error: selectError } = await authcliente
                    .from("PostHistorial")
                    .select("id_subpost , is_like")
                    .eq("fk_user", fk_user)
                    .eq("fk_post", id_post)
                    .single();

                if (selectError) throw selectError;
                await this.unlikePost(data.id_subpost, fk_user, data.is_like); // Llamamos a la función unlikePost con el id_subpost encontrado
                return data; // Retorna el registro existente encontrado

            } catch (innerError) {
                // Si la búsqueda también falla, lanzamos el error formateado
                const errorMessage = innerError instanceof Error
                    ? innerError.message
                    : (innerError as any)?.message || JSON.stringify(innerError);

                console.error("Error definitivo al procesar el like:", errorMessage);
                throw new Error(errorMessage);
            }
        }
    }
    async unlikePost(id_post: string, fk_user: string | null, Estate: Boolean): Promise<any> {
        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);
        const nuevoEstado = !Estate; // Cambia el estado actual

        try {

            const { data, error } = await authcliente
                .from("PostHistorial")
                .update({ is_like: nuevoEstado })
                .eq("id_subpost", id_post)
                .eq("fk_user", fk_user)
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

