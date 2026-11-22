import supabaseService from "../../config/supabase.js";
import { iRecursos } from "../../types/types.js";

export default class Recursos_laod {
    
    async loadDocument(): Promise<iRecursos[]> {
        try {
            const token = localStorage.getItem("user_token");
            const client = token
                ? supabaseService.UserAuntentiked_Token(token)
                : supabaseService.client;

            const { data, error } = await client
                .from("documentdireccion")
                .select(`
                    id_docs,
                    namefiles,
                    description,
                    fk_programa,
                    documentdirecciontion,
                    fecha_load,
                    Programas ( nombre )
                `)
                .order("fecha_load", { ascending: false });

            if (error) {
                throw error;
            }
            console.log(data);
            const recursos: iRecursos[] = (data ?? []).map((item: any) => ({
                id: item.id_docs,
                nameFiles: item.namefiles,
                description: item.description,
                programa: item.Programas?.nombre || item.fk_programa || "General",
                documentDirecciontion: item.documentdirecciontion,
                fecha_load: item.fecha_load,
            }));

            return recursos;
        } catch (error) {
            console.error("Error al cargar documentos:", error);
            throw error;
        }
    }

    async deleteDocument(id: string): Promise<any> {
        try {
            const token = localStorage.getItem("user_token");
            const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;
            const { data, error } = await client
                .from("documentdireccion")
                .delete()
                .eq("id_docs", id);

            if (error) {
                throw error;
            }
            return data;
        } catch (error) {
            console.error("Error al eliminar documento:", error);
            throw error;
        }
    }
}
