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

    async inicioSeccion(datos: iLoginDTO): Promise<{ exito: boolean; mensaje?: string; token?: string; usuario?: any }> {
        localStorage.clear();
        try {
            const { data: usuario, error } = await supabaseService.client
                .from("User")
                .select("*")
                .eq("correo_electronico", datos.correo_electronico.trim().toLocaleLowerCase())
                .maybeSingle();

            if (error) {
                console.error("Error al consultar usuario:", error);
                return { exito: false, mensaje: "Error de conexión con la base de datos." };
            }

            if (!usuario) {
                return { exito: false, mensaje: "Correo electrónico o clave de acceso incorrectos." };
            }

            const validacionCredenciales = await Cl_UtilidadesLogin.compararPassword(
                datos.password,
                usuario.password
            );
            if (!validacionCredenciales) {
                return { exito: false, mensaje: "Correo electrónico o clave de acceso incorrectos." };
            }

            // Validar que el usuario esté activo
            if (usuario.estatus !== true) {
                return { exito: false, mensaje: "Tu perfil se encuentra inactivo. Contacta a la administración para habilitar tu acceso." };
            }

            // generar token
            const tokenID = await Cl_UtilidadesLogin.generedToken(usuario.id_user);
            console.log("Token generado:", tokenID);
            // guardar token siempre en localStorage
            localStorage.setItem("user_token", tokenID);

            const ID = usuario.fk_cargo;
            const Name_cargo = await this.SupBuscador_ID.BusquedaRedireccion(
                "cargo",
                ID
            );

            // Obtener nombre del programa asignado si existe
            let Name_programa = null;
            if (usuario.fk_programas) {
                try {
                    const { data: prog } = await supabaseService.client
                        .from("Programas")
                        .select("nombre")
                        .or(`id_programa.eq.${usuario.fk_programas},id_programas.eq.${usuario.fk_programas}`)
                        .maybeSingle();
                    if (prog?.nombre) {
                        Name_programa = prog.nombre;
                    }
                } catch {
                    Name_programa = null;
                }
            }

            // Guardar toda la información de la sesión para consumo de los módulos
            localStorage.setItem(
                "userSeccion",
                JSON.stringify({
                    id_user: usuario.id_user,
                    nombre: usuario.nombre,
                    fk_programas: usuario.fk_programas || null,
                    nombre_programa: Name_programa,
                    fk_cargo: usuario.fk_cargo || null,
                    correo_electronico: usuario.correo_electronico,
                    especializacion: usuario.especializacion || "",
                    pais: usuario.pais || "",
                    cargo: Name_cargo || "Usuario",
                    img_direccion: usuario.img_direccion || null
                })
            );

            this.directory.direccionCargo(Name_cargo);

            return {
                exito: true,
                token: tokenID,
                usuario: {
                    id_user: usuario.id_user,
                    nombre: usuario.nombre,
                    cargo: Name_cargo,
                    fk_programas: usuario.fk_programas,
                    estatus: usuario.estatus,
                },
            };
        } catch (error: any) {
            console.error("Error en el login:", error);
            localStorage.clear();
            const msg = error?.message || "Error al conectar con el servidor.";
            return { exito: false, mensaje: msg };
        }
    }
}