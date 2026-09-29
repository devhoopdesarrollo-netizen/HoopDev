
import { iUsuarioNew } from "../../types/types"
import bcrypt from "bcryptjs";
export default class Cl_mNewUser {
    private _Nombre!: string;
    private _Password!: string;
    private _Pais!: string;
    private _Correo_Electronico!: string;
    private _fechaNacimiento!: Date;
    private _Especializacion!: string;
    constructor({ nombre, password, pais, correo_electronico, fecha_nacimiento, especializacion }: iUsuarioNew) {
        this.Nombre = nombre;
        this.Password = password
        this.Pais = pais;
        this.Correo_Electronico = correo_electronico;
        this.Fecha_nacimiento = fecha_nacimiento;
        this.Especializacion = especializacion;
    }
    set Nombre(Nombre: string) {
        this._Nombre = Nombre.trim();

    }
    get Nombre(): string {
        return this._Nombre;
    }
    set Password(Password: string) {


        this._Password = Password
    }
    get Password(): string {
        return this._Password;
    }
    set Pais(Pais: string) {
        this._Pais = Pais.trim();
    }
    get Pais(): string {
        return this._Pais;
    }
    set Correo_Electronico(Correo_Electronico: string) {
        this._Correo_Electronico = Correo_Electronico.trim().toLocaleLowerCase();
    }
    get Correo_Electronico(): string {
        return this._Correo_Electronico;
    }
    set Fecha_nacimiento(Fecha_nacimiento: Date) {
        this._fechaNacimiento = Fecha_nacimiento;
    }
    get Fecha_nacimiento(): Date {
        return this._fechaNacimiento;
    }
    set Especializacion(Especializacion: string) {
        this._Especializacion = Especializacion.trim().toLocaleLowerCase();
    }
    get Especializacion(): string {
        return this._Especializacion;
    }
     async cifrado_password(password: string): Promise<string> {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            return hashedPassword;
        }catch(error){
            throw new Error("Error al cifrar la contraseña: " + error);
        }
    }
    
    toJSON(): iUsuarioNew {
        return {
            nombre: this.Nombre,
            password: this.Password,
            pais: this.Pais,
            correo_electronico: this.Correo_Electronico,
            fecha_nacimiento: this.Fecha_nacimiento,
            especializacion: this.Especializacion
        };
    }

    tooJSON(): iUsuarioNew {
        return this.toJSON();
    }

}