import Controller from "../controllers/Controller.js";


export default class Cl_directory {

    constructor(){
       
    }
    
    direccionCargo(cargo: string) {
        const cargoNormalizado = cargo ? cargo.trim() : "";
        switch (cargoNormalizado) {
            case "Administrador":
                window.location.href = "./ventanas/inicio_Administracion.html";
                break;

            default:
                window.location.href = "./ventanas/inicio_usuario.html";
                break;
        }
    }
}