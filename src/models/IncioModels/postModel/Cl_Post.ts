import { iPostNew } from "../../../types/types.js"

export default class Cl_mPost {
    private _fk_user: string = ""
    private _img_direccion: string = ""
    private _contenido: string = ""
    private _fechaCreacion: string = ""

    constructor({ fk_user, img_direccion, contenido,fechaCreacion }: iPostNew) {
        this.fk_user = fk_user
        this.img_direccion = img_direccion || ""
        this.contenido = contenido
        this.fechaCreacion = fechaCreacion
    }

    set fk_user(fk_user: string) {
        this._fk_user = fk_user;
    }
    
    get fk_user(): string {
        return this._fk_user
    }

    set img_direccion(img_direccion: string) {
        this._img_direccion = img_direccion || "";
    }

    get img_direccion(): string {
        return this._img_direccion;
    }

    set contenido(contenido: string) {
        this._contenido = contenido;
    }

    get contenido(): string {
        return this._contenido;
    }
    set fechaCreacion(fechaCreacion: string) {
         this._fechaCreacion = fechaCreacion;
    }
    get fechaCreacion(): string {
        return this._fechaCreacion;
    }

    toJSON() {
        return {
            fk_user: this.fk_user,
            img_direccion: this.img_direccion,
            contenido: this.contenido,
            fechaCreacion: this.fechaCreacion
        }
    }
}