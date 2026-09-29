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
export interface iPostNew{
    fk_user:string;
    img_direccion?:string;
    contenido:string;

}
export interface iPostResponse {
    id_post: string;         
    fk_user: string;
    img_direccion: string;
    contenido: string;
    likes: number;            
    fecha_creacion: Date;     
}