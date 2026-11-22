import Cl_directory from "../config/Cl_directory.js";
import Cl_mMUserController from "../models/UserModules/Cl_mMUserController.js";
import { iAnuncios, iEncuesta, iHorario, iLoginDTO, iPostNew, iPreguntas, iRecursos, iTemplateCargo_Programa, iUserList, iUsuarioNew, PostLike } from "../types/types.js";
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
    
    
    
    async listUser():Promise<iUserList[]>{
        const listname = await this.UsermMController.cargarListaUser()
        return listname
    }
    async userRegister(datos: iUsuarioNew): Promise<boolean> {
        return await this.UsermMController.agregarUser(datos);
    }
    async UserLong(datos: iLoginDTO) {
        return await this.UsermMController.ValidarUserSeccion(datos);
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
    async likePost(id_post: string, fk_user: string | null): Promise<any> {

        const likeResponse = await this.UsermMController.likePost(id_post, fk_user)
      
        return likeResponse
    }
    async obtenerLikes(id:string):Promise<any>{
        const likeResponse = await this.UsermMController.likeCarga(id)
       
        return likeResponse[0]?.likes_count ; 
        // Devuelve el conteo de likes o 0 si no hay datos
        
    }
    async deletePost(estado:boolean,id:string){
        const deleteResponse = await this.UsermMController.deletePost(estado,id)
   
    }
    //funcion desde vista para recargar las publicaciones
    actualizarPost = async () => {
        this.UserInicio.postResponse()
    } 
    //Secciones 
    //Documento
    async loadDocument(informacion:iRecursos,document:File){
        const documento = await this.UsermMController.loadDocument(informacion,document)
    }
    async cargaDocument():Promise<any>{
        const document = await this.UsermMController.cargaDocument()
       return document
    }

    //Encuestas
    async crearEncuetas(Tematica:iEncuesta,preguntas:iPreguntas[]){
       await this.UsermMController.newEncuetas(Tematica,preguntas)
    }
    async cargarEncuetas():Promise<any>{
       const EncuetasExistentes = await this.UsermMController.cargarEncuetas_name();
       return EncuetasExistentes
    }
    //Secciones Horarios
     async crearHorario(date:iHorario){
            const infUser = await this.UsermMController.crearHorario(date)
            return infUser
        }
    async informacionHorarios(id:string){
        const informacionUser = await this.UsermMController.buscarHorarios(id)
        return informacionUser
    }
    async deleteDay(id:string){
        const infUser = await this.UsermMController.borrarDia(id);
        return infUser
    }
    //Anuncios
    async newAnuncio(dat:iAnuncios){
        const NewAnuncio = await this.UsermMController.crearAnuncio(dat)
        return NewAnuncio
    }
    async loadAnuncio(){
        const LoadAnuncio = await this.UsermMController.cargarAnuncio()
        return LoadAnuncio
    }
    async deletAnuncio(id:string){
        const deletAnuncio = await this.UsermMController.deleteAnuncio(id)
        return deletAnuncio
    }

    // ==========================================
    // SECCIÓN ADMINISTRACIÓN
    // ==========================================
    async cargarCargos(): Promise<any[]> {
        return await this.UsermMController.cargarCargos();
    }
    async crearCargo(cargo: iTemplateCargo_Programa): Promise<any> {
        return await this.UsermMController.crearCargo(cargo);
    }
    async deleteCargo(id: string): Promise<boolean> {
        return await this.UsermMController.deleteCargo(id);
    }

    async cargarProgramas(): Promise<any[]> {
        return await this.UsermMController.cargarProgramas();
    }
    async crearPrograma(programa: iTemplateCargo_Programa): Promise<any> {
        return await this.UsermMController.crearPrograma(programa);
    }
    async deletePrograma(id: string): Promise<boolean> {
        return await this.UsermMController.deletePrograma(id);
    }

    async cargarUsuariosControl(): Promise<any[]> {
        return await this.UsermMController.cargarUsuariosControl();
    }
    async actualizarUsuario(idUser: string, datos: { nombre?: string; especializacion?: string; fk_programas?: string; fk_cargo?: string; estatus?: boolean; password?: string }): Promise<any> {
        return await this.UsermMController.actualizarUsuario(idUser, datos);
    }
}