import Controller from "../../controllers/Controller.js";
import Cargos_load from "../../modules/ControlerUserModel/Cargos_load.js";
import Cargo_New from "../../modules/ControlerUserModel/Cargos_new.js";
import Programas_load from "../../modules/ControlerUserModel/Programas_Load.js";
import Programas_New from "../../modules/ControlerUserModel/Programas_new.js";
import User_control_load from "../../modules/ControlerUserModel/User_control_Load.js";
import Encuenta_New from "../../modules/Encuentas_Moduls/Encuenta_New.js";
import Encuetas_load from "../../modules/Encuentas_Moduls/Encuetas_load.js";
import Anuncios_load from "../../modules/Horarios_Moduls/Anuncios_load.js";
import anuncios_new from "../../modules/Horarios_Moduls/Anuncios_New.js";
import Horarios_load from "../../modules/Horarios_Moduls/Horarios_load.js";
import Horarios_New from "../../modules/Horarios_Moduls/Horarios_New.js";
import Post_Load from "../../modules/Post_Moduls/Post_load.js";
import Post_New from "../../modules/Post_Moduls/Post_new.js";
import StorageImagen from "../../modules/Post_Moduls/StorageImagenes.js";
import MD_UserLogin from "../../modules/User_Moduls/UserLogin.js";
import MD_NewUser from "../../modules/User_Moduls/userRegistro.js";
import { iAnuncios, iEncuesta, iHorario, iLoginDTO, iPostNew, iPreguntas, iTemplateCargo_Programa, iUserList, iUsuarioNew } from "../../types/types.js";
import Cl_mPost from "../IncioModels/postModel/Cl_Post.js";
import userList_moduls from "../Utils/userList_moduls.js";
import Cl_mNewUser from "./Cl_mNewUser.js";

export default class Cl_mMUserController {
    private _UserAccion: MD_NewUser;
    private _UserLogin: MD_UserLogin;
    private _storage: StorageImagen;
    private _postNew: Post_New;
    private _postLoad: Post_Load;
    private _Encuesta: Encuenta_New;
    private _Encuesta_load: Encuetas_load;
    private _horario_new: Horarios_New;
    private _horarios_load: Horarios_load;
    private _anuncios_new: anuncios_new;
    private _anuncios_load: Anuncios_load;
    private _toolsUser: userList_moduls;
    private _cargo_load: Cargos_load;
    private _cargo_new: Cargo_New;
    private _programa_load: Programas_load;
    private _programas_new: Programas_New;
    private _User_Controller: User_control_load;
    private EncuestaPreguntas: iPreguntas[] = [];
    public controller: Controller;
    public nameUser: string = "";
    public fk_user: string = "";

    constructor(controller: Controller) {
        this.controller = controller;
        this._UserAccion = new MD_NewUser();
        this._UserLogin = new MD_UserLogin();
        this._storage = new StorageImagen();
        this._postNew = new Post_New();
        this._postLoad = new Post_Load();
        this._Encuesta = new Encuenta_New();
        this._Encuesta_load = new Encuetas_load();
        this._horario_new = new Horarios_New();
        this._horarios_load = new Horarios_load();
        this._anuncios_new = new anuncios_new();
        this._anuncios_load = new Anuncios_load();

        this._toolsUser = new userList_moduls();
        this._cargo_load = new Cargos_load();
        this._cargo_new = new Cargo_New();
        this._programa_load = new Programas_load();
        this._programas_new = new Programas_New();
        this._User_Controller = new User_control_load();

        const datosGuardados = localStorage.getItem("userSeccion");
        if (datosGuardados) {
            try {
                const data = JSON.parse(datosGuardados);
                this.nameUser = data.nombre;
                this.fk_user = data.id_user;
            } catch (e) {
                this.nameUser = "Error";
                this.fk_user = "error";
            }
        }
        this.postResponse();
    }

    cargarNuevaPregunta(pregunta: string) {
        const preguntas: iPreguntas = {
            texto_pregunta: pregunta
        };
        this.EncuestaPreguntas.push(preguntas);
    }

    borrarPreguntaa(preguntaSelecionada: iPreguntas) {
        const index = this.EncuestaPreguntas.indexOf(preguntaSelecionada);
        if (index !== -1) {
            this.EncuestaPreguntas.splice(index, 1);
        }
    }

    reinciarPreguntas() {
        this.EncuestaPreguntas = [];
    }

    mostrarPreguntasFrom() {
        return this.EncuestaPreguntas;
    }

    async cargarListaUser(): Promise<iUserList[]> {
        const nomres = await this._toolsUser.cargarUser();
        return nomres;
    }

    async agregarUser(datos: iUsuarioNew): Promise<boolean> {
        const datosPreparados = new Cl_mNewUser(datos);
        return await this._UserAccion.createUser(datosPreparados.toJSON());
    }

    async ValidarUserSeccion(datos: iLoginDTO) {
        return await this._UserLogin.inicioSeccion(datos);
    }

    async direccionImange(file: File): Promise<string> {
        const StorageDireccion = await this._storage.uploadPostImagen(file);
        return StorageDireccion;
    }

    async newPost(date: iPostNew, file: File): Promise<any> {
        const revision = new Cl_mPost(date);
        const SubidaWeb = await this._postNew.crearPostNew(revision, file);
        return SubidaWeb;
    }

    async postResponse(): Promise<any> {
        const postResponse = await this._postLoad.cargarPost();
        return postResponse;
    }

    async likePost(id_post: string, userFk: string | null): Promise<any> {
       
        const likeResponse = await this._postNew.likePost(id_post, userFk);
        return likeResponse;
    }
    async likeCarga(id: string): Promise<any> {
        const likeResponse = await this._postLoad.LikeCarga(id);
       
        return likeResponse;
    }

    async newEncuetas(Tematica: iEncuesta, Preguntas: iPreguntas[]) {
        const NewEncuetas = await this._Encuesta.crearTematica(Tematica, Preguntas);
        this.reinciarPreguntas();
        return NewEncuetas;
    }

    async cargarEncuetas_name() {
        const EncuentasName = await this._Encuesta_load.MostrarEncuetasActuales();
        return EncuentasName;
    }

    async crearHorario(date: iHorario) {
        const infUser = await this._horario_new.crearHorarioUser(date);
        return infUser;
    }

    async buscarHorarios(id: string) {
        const infUser = await this._horarios_load.cargarHorarios(id);
        return infUser;
    }

    async borrarDia(id: string) {
        const deletday = await this._horarios_load.deleteDay(id);
        return deletday;
    }

    async crearAnuncio(dat: iAnuncios) {
        const NewAnuncio = await this._anuncios_new.newAnuncio(dat);
        return NewAnuncio;
    }

    async cargarAnuncio() {
        const loadAnuncio = await this._anuncios_load.cargarAnuncios();
        return loadAnuncio;
    }

    async deleteAnuncio(id: string) {
        const deletAnuncio = await this._anuncios_load.delectAnuncio(id);
        return deletAnuncio;
    }

    // ==========================================
    // SECCIÓN ADMINISTRACIÓN (Cargos, Programas, Usuarios)
    // ==========================================

    async cargarCargos(): Promise<any[]> {
        return await this._cargo_load.MostrarCargo();
    }

    async crearCargo(cargo: iTemplateCargo_Programa): Promise<any> {
        return await this._cargo_new.CrearCargo(cargo);
    }

    async deleteCargo(id: string): Promise<boolean> {
        return await this._cargo_load.deleteCargo(id);
    }

    async cargarProgramas(): Promise<any[]> {
        return await this._programa_load.MostrarProgramas();
    }

    async crearPrograma(programa: iTemplateCargo_Programa): Promise<any> {
        return await this._programas_new.crearProgramas(programa);
    }

    async deletePrograma(id: string): Promise<boolean> {
        return await this._programa_load.deletePrograma(id);
    }

    async cargarUsuariosControl(): Promise<any[]> {
        return await this._User_Controller.cargarUsuarios();
    }

    async actualizarUsuario(idUser: string, datos: { nombre?: string; especializacion?: string; fk_programas?: string; fk_cargo?: string; estatus?: boolean; password?: string }): Promise<any> {
        return await this._User_Controller.actualizarUsuario(idUser, datos);
    }
}