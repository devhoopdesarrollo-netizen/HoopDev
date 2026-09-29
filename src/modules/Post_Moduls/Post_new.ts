
import supabaseService from "../../config/supabase.js";
import supabase from "../../config/supabase.js";
import { iPostNew } from "../../types/types.js";
import StorageImagen from "./StorageImagenes.js";


export default class Post_New {
     
    async crearPostNew(date: iPostNew, file: File): Promise<any> {
        const storage = new StorageImagen();   
        try {
            const imgDireccion = await storage.uploadPostImagen(file)
            const { data, error } = await supabaseService.client
                .from("Post")
                .insert([
                    {
                        fK_User: date.fk_user,
                        img_direccion: imgDireccion,
                        contenido: date.contenido,
                    }
                ])
                .select();
            if (error) throw error;
            return data;

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            console.error('Error al crear el post:', errorMessage);
            throw new Error('No se pudo crear el post.');
        }


    }

}