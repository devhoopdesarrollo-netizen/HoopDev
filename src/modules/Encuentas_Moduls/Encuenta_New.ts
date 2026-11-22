import supabaseService from "../../config/supabase.js";
import Cl_Encuenta_New from "../../models/IncioModels/EncuestaModel/Cl_EncuestaTematica.js";
import Cl_Pregunta from "../../models/IncioModels/EncuestaModel/Cl_Pregunta.js";
import { iEncuesta, iPreguntas } from "../../types/types.js";

export default class Encuenta_New {

    async crearTematica(nombre_Encuesta: iEncuesta, preguntas: iPreguntas[]): Promise<any> {
        const nombre = new Cl_Encuenta_New(nombre_Encuesta);
        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);
        const fecha_creacion = new Date().toISOString();
        try {
            const { data, error } = await authcliente
                .from("tematicas")
                .insert([{
                    nombre_tematica: nombre.nombre_tematica,
                    fecha_creacion: fecha_creacion
                }])
                .select("*");

            if (error) {
                console.error("Error al crear temática:", error);
                throw error;
            }

            if (data && data.length > 0) {
                const { id_tematica } = data[0];
                await this.registrarPreguntas(preguntas, id_tematica);
                return id_tematica;
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any)?.message || JSON.stringify(error);
            console.error("Error al crear temática:", errorMessage);
            throw error;
        }
    }

    async registrarPreguntas(preguntas: iPreguntas[], tematicaID: string) {
        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);
        try {
            const idTematica = tematicaID;

            for (const itemPregunta of preguntas) {
                const preguntaList = new Cl_Pregunta(itemPregunta);
                const { data, error } = await authcliente
                    .from("preguntas")
                    .insert([{
                        fk_tematica: idTematica,
                        texto_pregunta: preguntaList.texto_pregunta
                    }])
                    .select("*");

                if (error) {
                    console.error("Error al registrar pregunta:", error);
                    throw error;
                }
            }
            return true;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any)?.message || JSON.stringify(error);
            console.error("Error al registrar preguntas:", errorMessage);
            throw error;
        }
    }

    async guardarRespuestas(respuestas: Array<{ fk_pregunta: string, fk_user: string, respuesta: string, descripcion_reporte?: string }>): Promise<boolean> {
        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);
        try {
            const rowsToInsert = respuestas.map(r => ({
                fk_pregunta: r.fk_pregunta,
                fk_user: r.fk_user,
                respuesta: r.respuesta,
                descripcion_reporte: r.descripcion_reporte || "Respuesta registrada",
                fecha_reporte: new Date().toISOString()
            }));

            const { data, error } = await authcliente
                .from("reporte_detallado")
                .insert(rowsToInsert)
                .select("*");

            if (error) {
                console.error("Error al guardar respuestas en reporte_detallado:", error);
                throw error;
            }

            return true;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any)?.message || JSON.stringify(error);
            console.error("Error en guardarRespuestas:", errorMessage);
            throw error;
        }
    }

    async eliminarEncuesta(id_tematica: string): Promise<boolean> {
        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);
        try {
            // 1. Obtener todas las preguntas de esta temática
            const { data: preguntas, error: errPreg } = await authcliente
                .from("preguntas")
                .select("id_pregunta")
                .eq("fk_tematica", id_tematica);

            if (errPreg) throw errPreg;

            // 2. Si hay preguntas asociadas, eliminar respuestas de reporte_detallado primero
            if (preguntas && preguntas.length > 0) {
                const preguntaIds = preguntas.map((p: any) => p.id_pregunta);
                const { error: errRep } = await authcliente
                    .from("reporte_detallado")
                    .delete()
                    .in("fk_pregunta", preguntaIds);

                if (errRep) throw errRep;

                // 3. Eliminar preguntas
                const { error: errDelPreg } = await authcliente
                    .from("preguntas")
                    .delete()
                    .eq("fk_tematica", id_tematica);

                if (errDelPreg) throw errDelPreg;
            }

            // 4. Eliminar la temática
            const { error: errTem } = await authcliente
                .from("tematicas")
                .delete()
                .eq("id_tematica", id_tematica);

            if (errTem) throw errTem;

            return true;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any)?.message || JSON.stringify(error);
            console.error("Error en eliminarEncuesta:", errorMessage);
            throw error;
        }
    }
}
