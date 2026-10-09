import Controller from "../../../controllers/Controller.js";
import { iEncuesta, iPreguntas } from "../../../types/types.js";

export default class Cl_vSeccionEncuestas {
    private controlador: Controller;
    private secionesEncuestaForm: HTMLFormElement;
    private preguntasActuales: HTMLElement;
    private btnAgregarPregunta: HTMLElement;
    constructor(controller: any) {
        this.controlador = controller;
        this.secionesEncuestaForm = document.getElementById("formEncuesta") as HTMLFormElement;
        this.preguntasActuales = document.getElementById("Preguntas") as HTMLSpanElement;
        this.btnAgregarPregunta = document.getElementById("btnAgregarPregunta") as HTMLElement;
        this.secionesEncuestaForm.addEventListener("submit", e => {
            e.preventDefault(),
                this.crearNuevaEncuesta()
        })
        this.btnAgregarPregunta.addEventListener("click", () => {
            
            this.agregarPregunta();
        });
    }
    agregarPregunta() {
        const formPregunt = this.secionesEncuestaForm.elements.namedItem("preguntasEncuesta") as HTMLInputElement;
        this.preguntasActuales.innerHTML = ""
        this.controlador.cargarPregunta(formPregunt.value)
        const datActual = this.controlador.mostrarPregunta()
        datActual.forEach(element => {
            this.preguntasActuales.innerHTML += `<div class="flex items-center justify-between p-3.5 bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/80 hover:border-slate-300 rounded-xl transition-all duration-200 group">
    <div class="flex items-center gap-3 min-w-0 pr-3">
        <!-- Badge de número -->
        <span class="flex items-center justify-center w-6 h-6 bg-indigo-600/10 text-indigo-600 rounded-lg text-xs font-bold shrink-0">
            ${this.preguntasActuales.children.length + 1}
        </span>
        <!-- Texto de la pregunta con soporte para textos largos -->
        <p class="text-sm font-medium text-slate-700 leading-snug break-words">
            ${element.texto_pregunta}
        </p>
    </div>
    
    <!-- Botón de eliminar con microinteracción -->
    <button type="button"  class="btn-eliminar p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0 active:scale-95 opacity-80 group-hover:opacity-100" title="Eliminar pregunta">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    </button>
</div>`;

        });





    }
    crearNuevaEncuesta() {
        const dat = this.secionesEncuestaForm.elements.namedItem("nombreEncuesta") as HTMLInputElement;
        const data: iEncuesta = {
            nombre_tematica: dat.value
        }
        const preguntas = this.controlador.mostrarPregunta()
        this.controlador.crearEncuetas(data, preguntas)
    }
}