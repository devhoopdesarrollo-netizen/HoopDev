import supabaseService from "../../config/supabase.js";
import { iEncuesta, iPreguntas } from "../../types/types.js";

export default class Encuetas_load {

    async MostrarEncuetasActuales(): Promise<iEncuesta[]> {
        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);
        try {
            const { data, error } = await authcliente
                .from("tematicas")
                .select("*")
                .order("fecha_creacion", { ascending: false });

            if (error) {
                console.error("Error al obtener tematicas:", error);
                throw error;
            }

            return data || [];
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any)?.message || JSON.stringify(error);
            console.error("Error en MostrarEncuetasActuales:", errorMessage);
            return [];
        }
    }

    async cargarPreguntas(id_tematica: string): Promise<iPreguntas[]> {
        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);
        try {
            const { data, error } = await authcliente
                .from("preguntas")
                .select("id_pregunta, fk_tematica, texto_pregunta")
                .eq("fk_tematica", id_tematica);

            if (error) {
                console.error("Error al cargar preguntas:", error);
                throw error;
            }

            return data || [];
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any)?.message || JSON.stringify(error);
            console.error("Error en cargarPreguntas:", errorMessage);
            return [];
        }
    }

    async cargarRespuestasPorTematica(id_tematica: string): Promise<{ preguntas: any[]; reportes: any[] }> {
        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);
        try {
            // 1. Obtener las preguntas de la temática
            const { data: preguntas, error: errPreguntas } = await authcliente
                .from("preguntas")
                .select("id_pregunta, fk_tematica, texto_pregunta")
                .eq("fk_tematica", id_tematica);

            if (errPreguntas) throw errPreguntas;
            if (!preguntas || preguntas.length === 0) {
                return { preguntas: [], reportes: [] };
            }

            const preguntaIds = preguntas.map((p: any) => p.id_pregunta);

            // 2. Obtener los reportes detallados para esas preguntas
            const { data: reportes, error: errReportes } = await authcliente
                .from("reporte_detallado")
                .select("id_report, fk_pregunta, fk_user, respuesta, descripcion_reporte, fecha_reporte")
                .in("fk_pregunta", preguntaIds)
                .order("fecha_reporte", { ascending: false });

            if (errReportes) throw errReportes;

            // 3. Obtener nombres de los usuarios que respondieron
            const userIds = Array.from(new Set((reportes || []).map((r: any) => r.fk_user)));
            const usersMap = new Map<string, any>();
            if (userIds.length > 0) {
                const { data: users } = await authcliente
                    .from("User")
                    .select("id_user, nombre, correo_electronico")
                    .in("id_user", userIds);

                if (users) {
                    users.forEach((u: any) => usersMap.set(u.id_user, u));
                }
            }

            const reportesConDetalle = (reportes || []).map((r: any) => ({
                ...r,
                User: usersMap.get(r.fk_user) || { nombre: "Usuario" }
            }));

            return {
                preguntas,
                reportes: reportesConDetalle
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any)?.message || JSON.stringify(error);
            console.error("Error en cargarRespuestasPorTematica:", errorMessage);
            return { preguntas: [], reportes: [] };
        }
    }

    async obtenerEncuestasConEstado(id_user: string): Promise<Array<iEncuesta & { respondida: boolean }>> {
        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);
        try {
            const { data: tematicas, error: errTematicas } = await authcliente
                .from("tematicas")
                .select("*")
                .order("fecha_creacion", { ascending: false });

            if (errTematicas) throw errTematicas;
            if (!tematicas) return [];

            if (!id_user) {
                return tematicas.map((t: any) => ({ ...t, respondida: false }));
            }

            // Obtener preguntas respondidas por este usuario
            const { data: userReports } = await authcliente
                .from("reporte_detallado")
                .select("fk_pregunta")
                .eq("fk_user", id_user);

            const answeredPreguntaIds = new Set((userReports || []).map((r: any) => r.fk_pregunta));

            // Obtener relación preguntas -> temáticas
            const { data: preguntas } = await authcliente
                .from("preguntas")
                .select("id_pregunta, fk_tematica");

            const answeredTematicaIds = new Set<string>();
            if (preguntas) {
                preguntas.forEach((p: any) => {
                    if (answeredPreguntaIds.has(p.id_pregunta)) {
                        answeredTematicaIds.add(p.fk_tematica);
                    }
                });
            }

            return tematicas.map((t: any) => ({
                ...t,
                respondida: answeredTematicaIds.has(t.id_tematica)
            }));
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any)?.message || JSON.stringify(error);
            console.error("Error en obtenerEncuestasConEstado:", errorMessage);
            return [];
        }
    }
}
