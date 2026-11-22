import supabaseService from "./supabase.js";

/**
 * Realiza un ping ligero a Supabase en cada visita/carga de la aplicación
 * para mantener activa la base de datos y evitar el pausado automático
 * por inactividad del tier gratuito.
 */
export async function registrarActividadSupabase(): Promise<void> {
    try {
        await supabaseService.client
            .from("Programas")
            .select("id_programa", { count: "exact", head: true });
        console.log("🟢 [HoopPeru] Actividad registrada en Supabase (Keep-Alive OK).");
    } catch (err) {
        // Silencioso para no interferir con la navegación del usuario
        console.debug("Keep-Alive ping:", err);
    }
}
