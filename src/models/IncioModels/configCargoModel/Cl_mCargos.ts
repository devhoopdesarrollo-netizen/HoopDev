import { iTemplateCargo_Programa } from "../../../types/types.js";

export default class Cl_mCargoModel{
    private _nombre:string = "";
    constructor({nombre}:iTemplateCargo_Programa){
        this._nombre = nombre;
    }
    set nombre(nombre:string){
        this._nombre = nombre.trim()
    }
    get nombre():string{
        return this._nombre
    }
    toJSON():iTemplateCargo_Programa{
        return {
            nombre:this.nombre
        }
    }
}