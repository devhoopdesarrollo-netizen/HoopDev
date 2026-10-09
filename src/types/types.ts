export interface iUsuarioNew {
    nombre: string;
    password: string;
    pais: string;
    correo_electronico: string;
    especializacion: string;
    fecha_nacimiento: Date;
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
    nombre_tematica: string;

}
export interface iPreguntas{
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