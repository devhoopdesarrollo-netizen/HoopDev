import Controller from "../../../controllers/Controller.js";
import { iRecursos } from "../../../types/types.js";

export default class Cl_vSeccionRecursos{
    public controllerSources:Controller;
    private seccionClickNew:HTMLElement;
    private modalDocumentNew:HTMLDialogElement;
    private formNewDocument:HTMLFormElement;
    constructor(controlador:Controller){
        this.controllerSources = controlador;
        this.seccionClickNew = document.getElementById("NewArchivo") as HTMLElement;
        this.modalDocumentNew = document.getElementById("modalNewDocument") as HTMLDialogElement;
        this.formNewDocument = document.getElementById("formNewDocument") as HTMLFormElement;
        this.formNewDocument.addEventListener("submit",e=>{
            e.preventDefault()
            
            this.newDocument()
        })
        this.seccionClickNew.addEventListener("click", e=>{
           this.modalDocumentNew.showModal()
        })


    }
    newDocument(){
        const dataForm = new FormData(this.formNewDocument);
        const empaquetadoDocument:iRecursos = {
            nameFiles: dataForm.get("nameFiles") as string,
            programa:dataForm.get("programa") as string,
            description:dataForm.get("description") as string,
            documentDirecciontion:dataForm.get("documentDirecciontion") as string

            
        }
        //revisar esto no puede llevar string
        this.controllerSources.newPost(empaquetadoDocument,empaquetadoDocument.documentDirecciontion)
       
       
    }

}