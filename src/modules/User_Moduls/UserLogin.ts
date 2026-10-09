import Cl_directory from "../../config/Cl_directory.js";
import supabaseService from "../../config/supabase.js";
import Cl_UtilidadesLogin from "../../models/Utils/Cl_Utils.js";
import SupBuscadores_ID from "../../models/Utils/SupBuscadores_ID.js";
import { iLoginDTO } from "../../types/types.js";

export default class MD_UserLogin {
    private directory: Cl_directory;
    private SupBuscador_ID: SupBuscadores_ID;

    constructor() {
        this.directory = new Cl_directory();
        this.SupBuscador_ID = new SupBuscadores_ID();
    }

    async inicioSeccion(datos: iLoginDTO) {
        localStorage.clear();
        try {
            const { data: usuario, error } = await supabaseService.client
                .from("User")
                .select("*")
                .eq("correo_electronico", datos.correo_electronico.trim().toLocaleLowerCase())
                .single();

            if (!usuario || error) {
                return { exito: false, mensaje: "Correo o contraseña incorrectos" };
            }

            const validacionCredenciales = await Cl_UtilidadesLogin.compararPassword(
                datos.password,
                usuario.password
            );
            if (!validacionCredenciales) {
                return { exito: false, mensaje: "Correo o contraseña incorrectos" };
            }

            // generar token
            const tokenID = await Cl_UtilidadesLogin.generedToken(usuario.id_user);
            console.log("Token generado:", tokenID);
            // guardar token siempre en localStorage
            localStorage.setItem("user_token", tokenID);

            if (usuario.estatus == true) {
                const ID = usuario.fk_cargo;
                const Name_cargo = await this.SupBuscador_ID.BusquedaRedireccion(
                    "cargo",
                    ID
                );
                localStorage.setItem(
                    "userSeccion",
                    JSON.stringify({
                        id_user: usuario.id_user,
                        nombre: usuario.nombre,
                    })
                );
                this.directory.direccionCargo(Name_cargo);
            }

            return {
                exito: true,
                token: tokenID,
                usuario: {
                    cargo: usuario.fk_cargo,
                    estatus: usuario.estatus,
                },
            };
        } catch (error) {
            console.error("Error en el login:", error);
            localStorage.clear();
            return { exito: false, mensaje: "Error interno en el servidor" };
        }
    }
}