import supabaseService from "../../config/supabase.js";
import Cl_mAnuncios from "../../models/IncioModels/horiosModel/Cl_mAnuncios.js";
import Cl_UtilidadesLogin from "../../models/Utils/Cl_Utils.js";
import { iAnuncios } from "../../types/types.js";

export default class anuncios_new {
    async newAnuncio(date: iAnuncios): Promise<any> {
        const anuncioNormalizado = new Cl_mAnuncios(date);

        let token = localStorage.getItem("user_token");
        if (!token) {
            // Intentar recuperar sesión almacenada
            const userSeccionStr = localStorage.getItem("userSeccion");
            if (userSeccionStr) {
                try {
                    const u = JSON.parse(userSeccionStr);
                    if (u.id_user) {
                        token = await Cl_UtilidadesLogin.generedToken(u.id_user);
                        localStorage.setItem("user_token", token);
                    }
                } catch (e) {
                    console.warn("No se pudo regenerar token:", e);
                }
            }
        }

        const authcliente = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;

        try {
            const { data, error } = await authcliente
                .from("reuniones")
                .insert([
                    {
                        fecha: anuncioNormalizado.fecha,
                        anuncio: anuncioNormalizado.AnuncioName,
                        hora_inicio: anuncioNormalizado.hora_inicio,
                        hora_final: anuncioNormalizado.hora_final
                    }
                ])
                .select();

            if (error) {
                console.error("Error al insertar anuncio en Supabase:", error);
                throw error;
            }
            return data;
        } catch (error: unknown) {
            console.error("Error en newAnuncio:", error);
            throw error;
        }
    }
}
