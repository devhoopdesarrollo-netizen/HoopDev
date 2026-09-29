import supabaseService from "../../config/supabase.js";
import supabase from "../../config/supabase.js";

export default class StorageImagen {
   

    async uploadPostImagen(file: File): Promise<string> {
        try {
            // Cambié la coma por un punto y coma aquí
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `User_img_post/${fileName}`;

            const { error } = await supabaseService.client.storage
                .from("Multimedia")
                .upload(filePath, file);

            if (error) throw error;

            const { data: publicUrlData } = supabaseService.client.storage
                .from("Multimedia")
                .getPublicUrl(filePath);

            return publicUrlData.publicUrl;

        } catch (error: unknown) { // Corregido 'cath' por 'catch'
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            console.error('Error al subir la imagen a Supabase:', errorMessage);
            throw new Error('No se pudo cargar la imagen.');
        }
    }
}