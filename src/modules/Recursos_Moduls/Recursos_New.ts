import supabaseService from "../../config/supabase.js";
import Cl_mRecursosModel from "../../models/IncioModels/recursosModel/Cl_mRecursosModel.js";
import { iRecursos, } from "../../types/types.js";
import StorageDocs from "./StorageDocs.js";

export default class Recursos_New{
      async crearPostNew(date: iRecursos, file: File): Promise<any> {
        const documentFormtt = new Cl_mRecursosModel(date)

        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Seccion no valida o expirada");
        }
        const authcliente = supabaseService.UserAuntentiked_Token(token);
        const storage = new StorageDocs();
        try {
            const DocsDireccion = await storage.uploadDocs(file, authcliente)
            const fechaPost = date.fecha_load || new Date().toISOString();
            const { data, error } = await authcliente
                .from("documentdireccion")
                .insert([
                    {
                        namefiles: documentFormtt.nameFiles,
                        description: DocsDireccion,
                        fk_programa: documentFormtt.programa,
                        documentdirecciontion: DocsDireccion,
                        fecha_load:fechaPost
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