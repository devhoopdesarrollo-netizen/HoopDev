import { iEncuesta } from "../../../types/types.js";

export default class Cl_EncuestaTematica {
    private _nombre_tematica: string = "";
    constructor(nombre_tematica: iEncuesta) {
        // Guardar el nombre de la temática de forma sanitizada
        this._nombre_tematica = nombre_tematica.nombre_tematica;
    }
    set nombre_tematica(value: iEncuesta) {
        this._nombre_tematica = value.nombre_tematica;
    }
    get nombre_tematica(): string {
        return this._nombre_tematica;
    }
    returnJSON() {
        return {
            nombre_tematica: this.nombre_tematica
        };
    }
}