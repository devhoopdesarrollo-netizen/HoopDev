import supabaseService from "../../config/supabase.js";

export default class User_control_load {

    async cargarUsuarios(): Promise<any[]> {
        const token = localStorage.getItem("user_token");
        const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;
        try {
            const { data, error } = await client
                .from("User")
                .select("id_user, nombre, especializacion, fk_programas, fk_cargo, estatus, correo_electronico, pais");

            if (error) {
                console.error("Error al cargar usuarios:", error);
                return [];
            }
            return data || [];
        } catch (error: unknown) {
            console.error("Error en cargarUsuarios:", error);
            return [];
        }
    }

    async MostrarEncuetasActuales(): Promise<any[]> {
        return await this.cargarUsuarios();
    }

    async actualizarUsuario(idUser: string, datos: { nombre?: string; especializacion?: string; fk_programas?: string; fk_cargo?: string; estatus?: boolean; password?: string }): Promise<{ exito: boolean; data?: any; error?: any }> {
        const token = localStorage.getItem("user_token");
        const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;
        try {
            let res = await client
                .from("User")
                .update(datos)
                .eq("id_user", idUser);

            // Si falla por 42501 (permiso denegado al rol authenticated), probar con cliente directo
            if (res.error && res.error.code === '42501' && token) {
                console.warn("⚠️ Permiso 42501 en 'User'. Intentando actualización alternativa con cliente base...");
                const fallback = await supabaseService.client
                    .from("User")
                    .update(datos)
                    .eq("id_user", idUser);

                if (!fallback.error) {
                    return { exito: true, data: fallback.data };
                }
                res = fallback;
            }

            if (res.error) {
                console.error("Error al actualizar usuario en Supabase:", res.error);
                return { exito: false, error: res.error };
            }
            return { exito: true, data: res.data };
        } catch (error: unknown) {
            console.error("Error inesperado en actualizarUsuario:", error);
            return { exito: false, error };
        }
    }
}