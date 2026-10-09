import supabaseService from "../../config/supabase.js";
import Cl_Encuenta_New from "../../models/IncioModels/EncuestaModel/Cl_EncuestaTematica.js";
import Cl_Pregunta from "../../models/IncioModels/EncuestaModel/Cl_Pregunta.js";
import { iEncuesta, iPreguntas } from "../../types/types.js";


export default class Encuenta_New {

    async crearTematica(nombre_Encuesta: iEncuesta, preguntas: iPreguntas[]): Promise<any> {
        const nombre = new Cl_Encuenta_New(nombre_Encuesta)
        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);
        try {
            const { data, error } = await authcliente
                .from("Tematicas")
                .insert([{
                    nombre_tematica: nombre.nombre_tematica
                }])
                .select()
            if (data && data.length > 0) {
                const { id } = data[0];
               await this.registrarPreguntas(preguntas, id)
                return id;

            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any)?.message || JSON.stringify(error);
        }



    }
    async registrarPreguntas(preguntas: iPreguntas[], tematicaID: string) {
        
        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);
        try {
            
            for (const itemPregunta of preguntas) {
                const preguntaList = new Cl_Pregunta(itemPregunta)
                const { data, error } = await authcliente
                    .from("Preguntas")
                    .insert([{
                        fk_tematica: tematicaID,
                        texto_pregunta: preguntaList.texto_pregunta
                    }])
                    .select()
                if (data && data.length > 0) {
                    const { id } = data[0];
                    return id;
                }

            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any)?.message || JSON.stringify(error);
        }

    }

}