import { iPreguntas } from "../../../types/types.js";

export default class Cl_Pregunta{
    private _texto_pregunta:string = "";
    constructor({texto_pregunta}:iPreguntas){
        this._texto_pregunta = texto_pregunta;
    }
    set texto_pregunta(texto_pregunta:string){
        this._texto_pregunta = texto_pregunta.trim().toLocaleLowerCase();
    }
    get texto_pregunta():string{
        return this._texto_pregunta;
    }
    returnJSON(){
        return {
            texto_pregunta:this.texto_pregunta
        }
    }
}