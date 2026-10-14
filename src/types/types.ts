export interface iUsuarioNew {
    nombre: string;
    password: string;
    pais: string;
    correo_electronico: string;
    especializacion: string;
    fecha_nacimiento: Date;
}
export interface iHorario{
    id_horarios?:string;
    fk_user?:string,
    fk_programa?:string,
    dia:string,
    horainicio:string,
    horafinal:string
}
export interface iAnuncios{
    id_reunion?: string; 
    fecha: string;      
    anuncio: string;
    hora_inicio: string; 
    hora_final: string;  
}


export interface iUserList{
    id_user:string,
    nombre:string
    fk_programas:string
}
export interface iLoginDTO {
    correo_electronico: string;
    password: string;
}
export interface iPostNew {
    fk_user: string;
    img_direccion?: string;
    contenido: string;
    fechaCreacion: string;

}
export interface user {
    id_user: string;
    nombre: string;
}
export interface iEncuesta {
    id_tematica?: string;
    nombre_tematica: string;

}
export interface iPreguntas {
    texto_pregunta: string;
}
export interface iPostResponse {
    id_post: string;
    User: user;
    img_direccion: string;
    contenido: string;
    likes: number;
    fecha_post: Date;
}