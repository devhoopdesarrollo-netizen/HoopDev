import Controller from "../../../controllers/Controller.js";
import Cl_Tools from "../../../models/Utils/Cl_Tools.js";
import { iAnuncios } from "../../../types/types.js";

export default class Cl_vSeccionAnuncios {
    public controlador: Controller;
    private formAnuncio: HTMLFormElement;
    private contAnuncios:HTMLElement;
    private toolsFormant:Cl_Tools;
    constructor(controller: Controller) {
        this.controlador = controller;
        this.formAnuncio = document.getElementById("formAnuncio") as HTMLFormElement
        this.contAnuncios = document.getElementById("conAnuncios") as HTMLElement
        this.toolsFormant = new Cl_Tools();

        if (!this.formAnuncio && !this.contAnuncios) {
            return;
        }

        if (this.formAnuncio) {
            this.formAnuncio.addEventListener("submit", e => {
                e.preventDefault();
                this.obtenerInformacionAnucion();
                setTimeout(() => {
                    this.cargarInformacionUser();
                }, 2000);
            });
        }

        if (this.contAnuncios) {
            this.cargarInformacionUser();
        }
    }

    async cargarInformacionUser(){
        this.contAnuncios.innerHTML = ""

        const dat = await this.controlador.loadAnuncio()
        dat.forEach((elemento:iAnuncios,index:number) => {
            this.contAnuncios.innerHTML += ` <tr class="hover:bg-gray-50/80 transition-colors">
                                            <td class="py-2.5 px-3 font-medium text-gray-800">${elemento.fecha}</td>
                                            <td class="py-2.5 px-3 text-gray-700 font-medium">${elemento.anuncio}</td>
                                            <td class="py-2.5 px-3 text-gray-500 font-mono text-[11px]">${this.toolsFormant.ConversorTimes(elemento.hora_inicio)} - ${this.toolsFormant.ConversorTimes(elemento.hora_final)}
                                            </td>
                                            <td class="py-2.5 px-3 text-right">
                                                <button type="button" id="button_${index}_anuncio" value="${elemento.id_reunion}"
                                                    class="text-red-600 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors">Borrar</button>
                                            </td>
                                        </tr>`
                                        

            
        });

        dat.forEach((element:iAnuncios, index:number) => {
            const buttonElemento = document.getElementById(`button_${index}_anuncio`) as HTMLButtonElement;
            buttonElemento.addEventListener(("click"),e =>{
                if(element.id_reunion)
                    this.controlador.deletAnuncio(element.id_reunion)
                setTimeout(() => {
                    this.cargarInformacionUser()
                }, 1500);
            })
        });

      
        
        
    }

    obtenerInformacionAnucion() {
        const datos = new FormData(this.formAnuncio);
        const fecha = datos.get('fecha_reunion');
        const titulo = datos.get('titulo_reunion');
        const horaInicio = datos.get('hora_inicio_reunion');
        const horaFinal = datos.get('hora_final_reunion');

        const datAnuncio: iAnuncios = {
            fecha: (fecha) ? String(fecha) : "",
            anuncio: (titulo) ? String(titulo) : "",
            hora_inicio: (horaInicio) ? String(horaInicio) : "",
            hora_final: (horaFinal) ? String(horaFinal) : "",
        }
        this.controlador.newAnuncio(datAnuncio)


    }
}