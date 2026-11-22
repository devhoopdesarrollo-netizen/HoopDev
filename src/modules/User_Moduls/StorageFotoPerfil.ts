import { SupabaseClient } from "@supabase/supabase-js";
import supabaseService from "../../config/supabase.js";

export default class StorageFotoPerfil {
    async uploadFotoPerfil(file: File, idUser: string): Promise<string> {
        const token = localStorage.getItem("user_token");
        const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;

        const fileExt = file.name.split(".").pop();
        const fileName = `${idUser}_${Date.now()}.${fileExt}`;

        let publicUrl = "";

        // 1. Intentar subir al bucket User_photos_perfiles
        try {
            const { error: errBucket } = await client.storage
                .from("User_photos_perfiles")
                .upload(fileName, file, { upsert: true });

            if (!errBucket) {
                const { data } = client.storage
                    .from("User_photos_perfiles")
                    .getPublicUrl(fileName);
                publicUrl = data.publicUrl;
            } else {
                throw errBucket;
            }
        } catch (bucketError) {
            // 2. Si el bucket raíz no existe, guardar en el bucket Multimedia bajo la ruta User_photos_perfiles/
            console.warn("Guardando en Multimedia/User_photos_perfiles:", bucketError);
            const filePath = `User_photos_perfiles/${fileName}`;
            const { error: errFallback } = await client.storage
                .from("Multimedia")
                .upload(filePath, file, { upsert: true });

            if (errFallback) {
                console.error("Error al subir foto de perfil a storage:", errFallback);
                throw new Error("No se pudo subir la foto de perfil al almacenamiento.");
            }

            const { data } = client.storage
                .from("Multimedia")
                .getPublicUrl(filePath);
            publicUrl = data.publicUrl;
        }

        // 3. Actualizar la tabla User con la nueva img_direccion
        const { error: errUser } = await client
            .from("User")
            .update({ img_direccion: publicUrl })
            .eq("id_user", idUser);

        if (errUser) {
            // Intentar con client base por si hay restricción RLS en UPDATE
            const fallbackUser = await supabaseService.client
                .from("User")
                .update({ img_direccion: publicUrl })
                .eq("id_user", idUser);

            if (fallbackUser.error) {
                console.error("Error al actualizar img_direccion en tabla User:", fallbackUser.error);
                throw new Error("La foto fue subida pero no se pudo asociar a tu perfil en la base de datos.");
            }
        }

        // 4. Actualizar localStorage
        try {
            const raw = localStorage.getItem("userSeccion");
            if (raw) {
                const userSeccion = JSON.parse(raw);
                userSeccion.img_direccion = publicUrl;
                localStorage.setItem("userSeccion", JSON.stringify(userSeccion));
            }
        } catch (e) {
            console.error("Error actualizando localStorage userSeccion:", e);
        }

        return publicUrl;
    }
}
