import supabaseService from "../../config/supabase.js";
import Cl_mCargoModel from "../../models/IncioModels/configCargoModel/Cl_mCargos.js";
import { iTemplateCargo_Programa } from "../../types/types.js";

export default class Cargo_New {

    async CrearCargo(cargo: iTemplateCargo_Programa): Promise<any> {
        const cargoModel = new Cl_mCargoModel(cargo);
        const token = localStorage.getItem("user_token");
        const client = token ? supabaseService.UserAuntentiked_Token(token) : supabaseService.client;

        try {
            const { data, error } = await client
                .from("Cargo")
                .insert([{
                    nombre: cargoModel.nombre
                }])
                .select("*");

            if (error) {
                console.error("Error al crear cargo en Supabase:", error);
                return null;
            }
            return data;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : (error as any)?.message || JSON.stringify(error);
            console.error("Error inesperado al crear cargo:", errorMessage);
            return null;
        }
    }
}