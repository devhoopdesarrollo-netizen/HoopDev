import { DetalleInfo } from "../../types/types.js";

export default class modal_confirmacion {
    private InfoPrincipal: string = ""
    private htmlDivDIreccion: HTMLElement;
   
    private Estado: boolean = false
    constructor({ InfoPrincipal }: DetalleInfo) {
        this.InfoPrincipal = InfoPrincipal
        this.htmlDivDIreccion = document.createElement(`div`) as HTMLElement
        document.body.appendChild(this.htmlDivDIreccion)
    }

    modalConfirmacionAction() {

        this.htmlDivDIreccion.innerHTML = `<dialog id="confirmModal" class="p-0 bg-transparent backdrop:bg-gray-950/60 backdrop:backdrop-blur-sm open:flex open:items-center open:justify-center max-w-full max-h-full w-full h-full m-0 bg-transparent">
    
    <!-- Contenedor principal con los estilos exactos de tu diseño -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6 sm:p-7 flex flex-col justify-between space-y-5 transform transition-all duration-300 m-auto">
        
        <!-- Encabezado / Contenido del mensaje -->
        <div class="space-y-3">
            <div class="flex items-center space-x-3">
                <!-- Icono de advertencia/pregunta con gradiente estético -->
                <div class="h-11 w-11 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-md shadow-amber-200/30">
                    <i class="ph ph-warning text-lg text-white font-bold"></i>
                </div>
                <div>
                    <h3 class="text-base font-bold text-gray-900">¿Estás seguro?</h3>
                    <p class="text-xs text-gray-400">Esta acción no se puede deshacer</p>
                </div>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed pt-1">
                ${this.InfoPrincipal}
            </p>
        </div>

        <!-- Botones de Acción (Sí / No) -->
        <div class="border-t border-gray-100 pt-4 flex items-center space-x-3">
            <!-- Botón "No" / Cancelar -->
            <button id="btnCancel" type="button" class="w-1/2 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98] border border-gray-200/60">
                <i class="ph ph-x text-sm text-gray-500"></i>
                <span>No, cancelar</span>
            </button>
            
            <!-- Botón "Sí" / Confirmar -->
            <button id="btnConfirm" type="button" class="w-1/2 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-blue-200/50 flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]">
                <i class="ph ph-check text-sm text-white"></i>
                <span>Sí, confirmar</span>
            </button>
        </div>
        
    </div>
</dialog>`

    const modal = document.getElementById("confirmModal") as HTMLDialogElement;
    modal.showModal()

        const buttonBtnConfirmar = document.getElementById(`btnConfirm`) as HTMLButtonElement;
        buttonBtnConfirmar.addEventListener("click", e => {
            this.Estado = !this.Estado
          
            modal.close()
           
           
         

        })



        const buttoncancelar = document.getElementById(`btnCancel`) as HTMLButtonElement;
        buttoncancelar.addEventListener("click", e => {
            this.Estado = false
         
            modal.close()
           

        })
             return this.estadoElecion()
    }
    estadoElecion() {
        return this.Estado
    }

}
