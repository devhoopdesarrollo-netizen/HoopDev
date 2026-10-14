import supabaseService from "../../config/supabase.js";
import Cl_mHorario from "../../models/IncioModels/horiosModel/Cl_mHorario.js";
import { iHorario } from "../../types/types.js";

export default class Horarios_New{
      async crearHorarioUser(date: iHorario): Promise<any> {
        const horariosNormalizados = new Cl_mHorario(date)

        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);
       
        try {
           
            const { data, error } = await authcliente
                .from("Horarios")
                .insert([
                    {
                        fk_user: date.fk_user,
                        fk_programa: date.fk_programa,
                        dia: horariosNormalizados.dia,
                        horainicio: horariosNormalizados.horainicio,
                        horafinal: horariosNormalizados.horafinal,
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