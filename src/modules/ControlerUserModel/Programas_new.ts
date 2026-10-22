import supabaseService from "../../config/supabase.js";
import Cl_mCargoModel from "../../models/IncioModels/configCargoModel/Cl_mCargos.js";
import Cl_Encuenta_New from "../../models/IncioModels/EncuestaModel/Cl_EncuestaTematica.js";
import Cl_Pregunta from "../../models/IncioModels/EncuestaModel/Cl_Pregunta.js";
import { iEncuesta, iPreguntas, iTemplateCargo_Programa } from "../../types/types.js";


export default class Programas_New {

    async crearProgramas(cargo: iTemplateCargo_Programa): Promise<any> {
        const nombre = new Cl_mCargoModel(cargo)
        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);
        const fecha_creacion = new Date().toISOString();
        try {
            const { data, error } = await authcliente
                .from("Programas")
                .insert([{
                    nombre: nombre.nombre

                }])
                .select("*")



        }
         catch(error: unknown) {
        const errorMessage = error instanceof Error
            ? error.message
            : (error as any)?.message || JSON.stringify(error);
    }



}
  
    
   

}