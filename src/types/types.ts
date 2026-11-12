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
export interface PostLike {
  id_post: string;      // UUID de la publicación
  likes_count: number;  // Conteo total de likes
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
export interface iTemplateCargo_Programa{
    id?:string;
    nombre:string
}
export interface iPostResponse {
    id_post: string;
    User: user;
    img_direccion: string;
    contenido: string;
    likes: number;
    user_liked?: boolean;
    fecha_post: Date;
}
export interface DetalleInfo {
    InfoPrincipal: string;
  
}
export interface mRecursos{
    id?:string,
    nameFiles:string,
    description:string,
    programa:string
    documentDirecciontion:string;
}