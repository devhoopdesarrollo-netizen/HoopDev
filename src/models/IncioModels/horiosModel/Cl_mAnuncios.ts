import { iAnuncios } from "../../../types/types.js";

export default class Cl_mAnuncios{
    private _fecha:string = "";
    private _AnuncioName:string = "";
    private _hora_inicio:string = "";
    private _hora_final:string = "";

    constructor({fecha,anuncio,hora_inicio,hora_final}:iAnuncios){
        this.fecha = fecha;
        this.AnuncioName = anuncio;
        this.hora_inicio = hora_inicio;
        this.hora_final = hora_final;

    }
   set fecha(fecha: string) {
        this._fecha = fecha;
    }
    get fecha(): string {
        return this._fecha;
    }

    // Getters y Setters para AnuncioName (mapeado desde anuncio)
    set AnuncioName(anuncio: string) {
        this._AnuncioName = anuncio;
    }
    get AnuncioName(): string {
        return this._AnuncioName;
    }

    // Getters y Setters para hora_inicio
    set hora_inicio(hora: string) {
        this._hora_inicio = hora;
    }
    get hora_inicio(): string {
        return this._hora_inicio;
    }

    // Getters y Setters para hora_final
    set hora_final(hora: string) {
        this._hora_final = hora;
    }
    get hora_final(): string {
        return this._hora_final;
    }
    toJSON():iAnuncios{
        return{
            fecha:this.fecha,
            anuncio:this.AnuncioName,
            hora_inicio:this.hora_inicio,
            hora_final:this._hora_final,
            
        }
    }
}