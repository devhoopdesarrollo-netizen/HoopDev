import Controller from "../../controllers/Controller.js";
import Post_New from "../../modules/Post_Moduls/Post_new.js";
import StorageImagen from "../../modules/Post_Moduls/StorageImagenes.js";
import MD_UserLogin from "../../modules/User_Moduls/UserLogin.js";
import MD_NewUser from "../../modules/User_Moduls/userRegistro.js";
import { iLoginDTO, iPostNew, iUsuarioNew } from "../../types/types.js";
import Cl_mPost from "../IncioModels/postModel/Cl_Post.js";
import Cl_mNewUser from "./Cl_mNewUser.js";

export default class Cl_mMUserController {
    private _UserAccion: MD_NewUser;
    private _UserLogin: MD_UserLogin;
    private _storage: StorageImagen;
    private _postNew: Post_New;
    public controller: Controller;
    public nameUser: string = "";
    public fk_user: string = "";

    constructor(controller: Controller) {
        this.controller = controller;
        this._UserAccion = new MD_NewUser();
        this._UserLogin = new MD_UserLogin();
        this._storage = new StorageImagen();
        this._postNew = new Post_New();
        const datosGuardados = localStorage.getItem("userSeccion")
        if (datosGuardados) {
            try {
                const data = JSON.parse(datosGuardados);
                this.nameUser = data.nombre
                this.fk_user = data.id_user
            } catch (e) {
                this.nameUser = "Error"
                this.fk_user = "error"
            }
        }

    }

    async agregarUser(datos: iUsuarioNew): Promise<boolean> {
        const datosPreparados = new Cl_mNewUser(datos);
        return await this._UserAccion.createUser(datosPreparados.toJSON());
    }
    async ValidarUserSeccion(datos: iLoginDTO) {
        const data = await this._UserLogin.inicioSeccion(datos)
        console.log(data)
    }
    async direccionImange(file: File): Promise<string> {
        const StorageDireccion = await this._storage.uploadPostImagen(file)
        return StorageDireccion
    }
    async newPost(date: iPostNew, file: File): Promise<any> {
        const revision = new Cl_mPost(date)
        const SubidaWeb = await this._postNew.crearPostNew(revision, file)
    }
}