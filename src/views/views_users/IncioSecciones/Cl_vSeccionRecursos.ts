import Controller from "../../../controllers/Controller.js";
import { iRecursos } from "../../../types/types.js";

export default class Cl_vSeccionRecursos{
    public controllerSources:Controller;
    private seccionClickNew:HTMLElement;
    private modalDocumentNew:HTMLDialogElement;
    private formNewDocument:HTMLFormElement;
    private documentDireccion:HTMLInputElement;
    private seccionDocumentLoad:HTMLElement;
    constructor(controlador:Controller){
        this.controllerSources = controlador;
        this.seccionClickNew = document.getElementById("NewArchivo") as HTMLElement;
        this.modalDocumentNew = document.getElementById("modalNewDocument") as HTMLDialogElement;
        this.formNewDocument = document.getElementById("formNewDocument") as HTMLFormElement;
        this.documentDireccion = document.getElementById("documentDirecciontion") as HTMLInputElement;
        this.seccionDocumentLoad = document.getElementById("docuemtsLoad") as HTMLElement;
        this.formNewDocument.addEventListener("submit",e=>{
            e.preventDefault()
            
            this.newDocument()
        })
        this.seccionClickNew.addEventListener("click", e=>{
           this.modalDocumentNew.showModal()
        })
     
    }
    filesLoad(){
        return this.documentDireccion?.files?.[0]

    }
  
    newDocument(){
        const dataForm = new FormData(this.formNewDocument);
        const empaquetadoDocument:iRecursos = {
            nameFiles: dataForm.get("nameFiles") as string,
            programa:dataForm.get("programa") as string,
            description:dataForm.get("description") as string,
            documentDirecciontion:dataForm.get("documentDirecciontion") as string

            
        }
      
        this.controllerSources.loadDocument(empaquetadoDocument,this.filesLoad()!)
       
       
    }
    async listFilesLoad(){
        this.seccionDocumentLoad.innerHTML = ""
        const document = await this.controllerSources.cargaDocument()
        document.forEach((element:iRecursos) => {
            this.seccionDocumentLoad.innerHTML +=  ` <div class="group relative bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between gap-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200">
    <!-- Cabecera: ícono + etiqueta -->
    <div class="space-y-3.5">
        <div class="flex items-center justify-between gap-2">
            <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <i class="ph ph-book-open text-xl"></i>
            </div>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-600 border border-rose-100">
                PDF
            </span>
        </div>

        <!-- Título y programa -->
        <div class="space-y-1">
            <h3 class="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                ${element.nameFiles}
            </h3>
            <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                ${element.programa}
            </p>
        </div>
    </div>

    <!-- Acción principal -->
    <a href="${element.documentDirecciontion}" download
       class="w-full py-2 px-3 bg-slate-900 hover:bg-blue-600 active:scale-[0.99] text-white font-medium text-xs rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-xs">
        <i class="ph ph-download-simple text-sm"></i>
        <span>Descargar PDF</span>
    </a>
</div>`
            
        });
   

    }

}