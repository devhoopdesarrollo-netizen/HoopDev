import supabaseService from "../../config/supabase.js";
import Cl_mAnuncios from "../../models/IncioModels/horiosModel/Cl_mAnuncios.js";
import { iAnuncios } from "../../types/types.js";

export default class anuncios_new {
    async crearHorarioUser(date: iAnuncios): Promise<any> {
        const anuncioNormalizado = new Cl_mAnuncios(date)

        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);

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
            if (error) throw error;
            return data;

        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any)?.message || JSON.stringify(error);
        }


    }
}