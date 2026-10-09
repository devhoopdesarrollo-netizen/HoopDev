import Cl_directory from "../config/Cl_directory.js";
import Cl_mMUserController from "../models/UserModules/Cl_mMUserController.js";
import { iEncuesta, iLoginDTO, iPostNew, iPreguntas, iUsuarioNew } from "../types/types.js";
import Cl_vLogingUser from "../views/CL_vLoginUser.js";
import Cl_vRegisterUser from "../views/Cl_vRegisterUser.js";
import Cl_vUserInicio from "../views/views_users/Cl_vUserInicio.js";

export default class Controller {
    public UsermMController: Cl_mMUserController;
    public UserViewRegister: Cl_vRegisterUser;
    public UserViewLoging:Cl_vLogingUser;
    public UserInicio:Cl_vUserInicio;
   


    constructor() {
        this.UsermMController = new Cl_mMUserController(this);
        this.UserViewRegister = new Cl_vRegisterUser(this);
        this.UserViewLoging = new Cl_vLogingUser(this)
        this.UserInicio = new Cl_vUserInicio(this)
    
        console.log("🏀 HoopPeru Controller iniciado.");
    }
     nameUser=()=>{return this.UsermMController.nameUser}
    cargarPregunta =(pregunta:string)=>{this.UsermMController.cargarNuevaPregunta(pregunta)}
    borrar =(index:iPreguntas)=>{this.UsermMController.borrarPreguntaa(index)}
    mostrarPregunta =()=>{ return this.UsermMController.mostrarPreguntasFrom()}
    reiniciar =()=>{this.UsermMController.reinciarPreguntas()}
    
    
    
    
     async userRegister(datos: iUsuarioNew): Promise<boolean> {
        return await this.UsermMController.agregarUser(datos);
    }
    async UserLong(datos:iLoginDTO){
        const informacion = await this.UsermMController.ValidarUserSeccion(datos)
       
    }
    //Funcion para la subida de los archivos PDF entre otros
    async direccionStorage(file:File):Promise<string>{
        const direccion = await this.UsermMController.direccionImange(file)
        return direccion
    }
    //
    async newPost(date:iPostNew, file:File){ 
        const Post = await this.UsermMController.newPost(date,file)
    }
    async postResponse():Promise<any>{
        const postResponse = await this.UsermMController.postResponse()
        return postResponse
    }
    async likePost(id_post: string): Promise<any> {
        const likeResponse = await this.UsermMController.likePost(id_post)
        return likeResponse
    }
    //funcion desde vista para recargar las publicaciones
    actualizarPost = async () => {
        this.UserInicio.postResponse()
    } 
    //Secciones 
    //Encuestas
    async crearEncuetas(Tematica:iEncuesta,preguntas:iPreguntas[]){
       await this.UsermMController.newEncuetas(Tematica,preguntas)
    }

    
  
}