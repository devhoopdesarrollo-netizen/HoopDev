import supabaseService from "../../config/supabase.js";
import supabase from "../../config/supabase.js";

export default class SupBuscadores_ID {
    private nameUser:string = ""
    constructor(){
        const datosGuardados = localStorage.getItem("UserSeccion")
        this.nameUser  

    }
  async BusquedaRedireccion(tipo: string, ID: string) {
        switch (tipo) {
            case "cargo":
              return await this.TablaCargo(ID)

                break;

            default:
                return "otro"
                break;
        }
    }
    async TablaCargo(ID: string) {
        try {
            const { data, error } = await supabaseService.client
                .from('Cargo')
                .select('nombre')
                .eq('id_cargo', ID)
                .single();

            return data?.nombre;
        } catch (error) {
            return error
        }
    }
}