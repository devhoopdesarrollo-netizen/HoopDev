import { iHorario } from "../../../types/types.js";
import Cl_Tools from "../../Utils/Cl_Tools.js";

export default class Cl_mHorario{
    private _dia:string = "";
    private _horainicio:string = "";
    private _horafinal:string = "";
    private Tools:Cl_Tools;
    constructor({dia,horainicio,horafinal}:iHorario){
        this.dia = dia,
        this.horainicio = horainicio,
        this.horafinal = horafinal,
        this.Tools = new Cl_Tools
    }
    set dia(dia:string){
        this._dia = dia.trim().toLocaleUpperCase()
    }
    get dia():string{
        return this._dia
    }
    set horainicio(horainicio:string){
        this._horainicio = horainicio
    }
    get horainicio():string{
        return this.Tools.ConversorTimes(this._horainicio)
    }
    set horafinal(horafinal:string){
        this._horafinal = horafinal.trim().toLocaleLowerCase()
    }
    get horafinal():string{
        return this.Tools.ConversorTimes(this._horafinal)
    }
    toJSON():iHorario{
        return {
            dia:this.dia,
            horainicio:this.horainicio,
            horafinal:this.horafinal
        }
    }
}