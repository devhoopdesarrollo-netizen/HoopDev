import supabaseService from "../../config/supabase.js";
import supabase from "../../config/supabase.js";
import Cl_UtilidadesLogin from "../../models/Utils/Cl_Utils.js";
import { iUsuarioNew } from "../../types/types.js";


export default class MD_NewUser {
  
   
    public async createUser(dat: iUsuarioNew): Promise<boolean> {
        try {

            const { error } = await supabaseService.client
                .from('User')
                .insert([
                    {
                        nombre: dat.nombre,
                        password: await Cl_UtilidadesLogin.cifrarPassword(dat.password) ,
                        pais: dat.pais,
                        correo_electronico: dat.correo_electronico,
                        especializacion: dat.especializacion,
                        fecha_nacimiento: dat.fecha_nacimiento,

                    }


                ]);

            if (error) {
                console.error('Error al crear el iUsuarioNew:', error);
                return false;
            }

            return true;

        } catch (error) {
            console.error('Error inesperado al crear el iUsuarioNew:', error);
            return false;
        }
    }
}