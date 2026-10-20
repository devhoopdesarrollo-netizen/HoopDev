import Controller from "../../controllers/Controller.js";
import Cl_Tools from "../../models/Utils/Cl_Tools.js";
import { iPostNew, iPostResponse } from "../../types/types.js";
import Cl_vSeccionAnuncios from "./IncioSecciones/Cl_vSeccionAnuncios.js";
import Cl_vSeccionEncuestas from "./IncioSecciones/Cl_vSeccionEncuestas.js";
import Cl_vSeccionHorarios from "./IncioSecciones/Cl_vSeccionHorarios.js";
import Cl_PostNewModal from "./PostModal/Cl_vPostNewModal.js";

export default class Cl_vUserInicio {
    private VpostModal: Cl_PostNewModal;
    private vEncuestas: Cl_vSeccionEncuestas;
    private vHorarios:Cl_vSeccionHorarios;
     private vAnuncios:Cl_vSeccionAnuncios;
    private seccionPost_publicacion:HTMLElement;
    private seccionPost:HTMLElement;
    private seccionEncuestas:HTMLElement;
    private seccionHorarios:HTMLElement;
    private seccionRecursos:HTMLElement;
    private seccionPerfiles:HTMLElement;
    private buttonMenuEncuesta:NodeListOf<HTMLElement>;
    private buttonMenuHorarios:NodeListOf<HTMLElement>;
    private buttonMenuRecursos:NodeListOf<HTMLElement>;
    private buttonMenuPerfiles:NodeListOf<HTMLElement>;
    private buttonMenuInicio:NodeListOf<HTMLElement>;
    private controlador: Controller;
    private tools: Cl_Tools;
    private nameUser: NodeListOf<HTMLElement>;
    constructor(controller: any) {
        this.controlador = controller;
        this.tools = new Cl_Tools();
        this.nameUser = document.querySelectorAll("#NameUser, .nameUser");
        this.VpostModal = new Cl_PostNewModal(this.controlador);
        this.vEncuestas = new Cl_vSeccionEncuestas(this.controlador);
        this.vHorarios = new Cl_vSeccionHorarios(this.controlador);
        this.vAnuncios = new Cl_vSeccionAnuncios(this.controlador);
        this.seccionPost_publicacion = document.getElementById("PostResponse") as HTMLElement;
        this.seccionPost = document.getElementById("Post") as HTMLElement;
        this.seccionEncuestas = document.getElementById("Encuestas") as HTMLElement;
        this.seccionHorarios = document.getElementById("Horarios") as HTMLElement;
        this.seccionRecursos = document.getElementById("Recursos") as HTMLElement;
        this.seccionPerfiles = document.getElementById("Perfiles") as HTMLElement;
        this.buttonMenuInicio = document.querySelectorAll("#ButtonMenuInicio") as NodeListOf<HTMLElement>;
        this.buttonMenuEncuesta = document.querySelectorAll("#ButtonMenuEncuesta") as NodeListOf<HTMLElement>;
        this.buttonMenuHorarios = document.querySelectorAll("#ButtonMenuHorarios") as NodeListOf<HTMLElement>;
        this.buttonMenuRecursos = document.querySelectorAll("#ButtonMenuRecursos") as NodeListOf<HTMLElement>;
        this.buttonMenuPerfiles = document.querySelectorAll("#ButtonMenuPerfiles") as NodeListOf<HTMLElement>;
        this.postResponse()
        const nombre = this.controlador.nameUser();
        this.nameUser.forEach(el => {
            el.textContent = nombre;
        });
        this.estadoSeccion("post");
        this.buttonMenuInicio.forEach(button => {
            button.addEventListener("click", () => {
                this.estadoSeccion("post");
            }); 
        });
        this.buttonMenuEncuesta.forEach(button => {
            button.addEventListener("click", () => {
                this.estadoSeccion("encuestas");
            });
        });
        this.buttonMenuHorarios.forEach(button => {
            button.addEventListener("click", () => {
                this.estadoSeccion("horarios");
            });
        });
        this.buttonMenuRecursos.forEach(button => {
            button.addEventListener("click", () => {
                this.estadoSeccion("recursos");
            });
        });
        this.buttonMenuPerfiles.forEach(button => {
            button.addEventListener("click", () => {
                this.estadoSeccion("perfiles");
            });
        });
    }
    estadoSeccion(seccion: string) {
        this.seccionPost.classList.add("hidden");
        this.seccionEncuestas.classList.add("hidden");
        this.seccionHorarios.classList.add("hidden");
        this.seccionRecursos.classList.add("hidden");
        this.seccionPerfiles.classList.add("hidden");
        switch (seccion) {
            case "post":
                this.seccionPost.classList.remove("hidden");
                break;
            case "encuestas":
                this.seccionEncuestas.classList.remove("hidden");
                break;
            case "horarios":
                this.seccionHorarios.classList.remove("hidden");
                break;
            case "recursos":
                this.seccionRecursos.classList.remove("hidden");
                break;
            case "perfiles":
                this.seccionPerfiles.classList.remove("hidden");
                break;
        }
    }

    async postResponse() {
        const data =await this.controlador.postResponse();
        this.seccionPost_publicacion.innerHTML = "";

        const frame = document.createDocumentFragment();
        const tempContainer = document.createElement('div');


        data.forEach((element:iPostResponse,index:number) => {
             const htmlPost =`  <div
                        class="bg-white rounded-xl shadow-md border border-gray-200 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                        <div class="space-y-4">
                            <div class="flex items-center space-x-3">
                                <div
                                    class="h-10 w-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300 flex items-center justify-center shrink-0">
                                    <span class="text-xs text-gray-500 font-semibold">U1</span>
                                </div>
                                <div>
                                    <h3 class="text-sm font-semibold text-gray-800">${element.User.nombre}</h3>
                                    <p class="text-xs text-gray-500">${this.tools.TimePost(element.fecha_post)}</p>
                                </div>
                            </div>
                            <p class="text-sm text-gray-700">
                                ${element.contenido}
                            </p>
                            <div
                                class="rounded-lg overflow-hidden border border-gray-200 bg-gray-100 h-48 flex items-center justify-center">
                                <span class="text-sm text-gray-400">
                                <img src="${element.img_direccion}" alt="Imagen del post" class="max-h-full max-w-full object-contain">
                                </span>
                            </div>
                        </div>

                        <div class="border-t border-gray-100 pt-4 space-y-3">
                            <div class="flex justify-between text-xs text-gray-500 px-1">
                                <span class="font-semibold_${index}">${element.likes} Me gusta</span>
                              
                            </div>
                            <div class="grid grid-cols-2 gap-2 border-y border-gray-100 py-1.5">
                                <button id="btnLikePost" data-idpost="${element.id_post}" data-index="${index}"
                                    class="w-full py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-xs rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer">
                                    <i class="hear-icono ph ph-heart text-base text-red-500"></i>
                                    <span>Me gusta</span>
                                </button>
                                
                                
                            </div>
                        </div>
                    </div>
                    `
                    tempContainer.innerHTML = htmlPost.trim();
                    const postElement = tempContainer.firstChild;

                    if(postElement){
                        frame.appendChild(postElement);
                    }
            
        });
        this.seccionPost_publicacion.appendChild(frame)
        //Crear un estado para los likes de manera que puedan ser persistentes en la interfaz de usuario, y no solo visuales. Esto podría implicar almacenar los likes en el backend y actualizar la interfaz de usuario en consecuencia.
        data.forEach((element:iPostResponse,index:number) => {
            const btnLikePost = document.querySelector(`#btnLikePost[data-index="${index}"]`) as HTMLButtonElement | null;
            btnLikePost?.addEventListener("click", async (e) => {
                const heartIcon = btnLikePost.querySelector(".hear-icono") as HTMLElement | null;
             if(heartIcon){
                heartIcon.classList.toggle("ph-fill");
                 
              //Pendiente reparar la logia de esta crear una nueva tabla para manejar los likes de manera distinta y verificar la persistencia de los likes en la base de datos, para que no se pierdan al recargar la página o al cambiar de sección. Esto podría implicar almacenar los likes en el backend y actualizar la interfaz de usuario en consecuencia.
                 
                const likesElement = document.querySelector(`.font-semibold_${index}`) as HTMLElement | null;
                if (likesElement) {
                    likesElement.textContent = `${element.likes} Me gusta`;
              
                }
                await this.controlador.likePost(element.id_post);
                

             }
            })

        });
       

    }

}
