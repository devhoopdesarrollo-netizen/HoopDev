import Controller from "../../controllers/Controller.js";
import MD_UserLogin from "../../modules/User_Moduls/UserLogin.js";
import MD_NewUser from "../../modules/User_Moduls/userRegistro.js";
import { iLoginDTO, iUsuarioNew } from "../../types/types.js";
import Cl_mNewUser from "./Cl_mNewUser.js";

export default class Cl_mMUserController {
    private _UserAccion: MD_NewUser;
    private _UserLogin:MD_UserLogin;
    public controller: Controller;
    public nameUser:string = ""
  
    constructor(controller: Controller) {
        this.controller = controller;
        this._UserAccion = new MD_NewUser();
        this._UserLogin = new MD_UserLogin();
         const datosGuardados = localStorage.getItem("userSeccion")
        if (datosGuardados) {
            try{const data = JSON.parse(datosGuardados);
                this.nameUser = data.nombre
            }catch(e){
                this.nameUser = "Error"
            }
        }  
        
    }

    async agregarUser(datos: iUsuarioNew): Promise<boolean> {
        const datosPreparados = new Cl_mNewUser(datos);
        return await this._UserAccion.createUser(datosPreparados.toJSON());
    }
    async ValidarUserSeccion(datos:iLoginDTO){
        const  data =   await this._UserLogin.inicioSeccion(datos)
        console.log(data)
    }
    
}