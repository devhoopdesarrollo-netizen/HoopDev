import Controller from "../../../controllers/Controller.js";
import Cl_Tools from "../../../models/Utils/Cl_Tools.js";
import { iAnuncios } from "../../../types/types.js";
import modal_confirmacion from "../../views_resours/modal_confirmacion.js";

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
            this.formAnuncio.addEventListener("submit", async e => {
                e.preventDefault();
                await this.obtenerInformacionAnucion();
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

        dat.forEach((element: iAnuncios, index: number) => {
            const buttonElemento = document.getElementById(`button_${index}_anuncio`) as HTMLButtonElement | null;
            buttonElemento?.addEventListener("click", async () => {
                if (element.id_reunion) {
                    const confirmado = await modal_confirmacion.confirmar(`¿Estás seguro de que deseas eliminar el anuncio "${element.anuncio}"?`);
                    if (confirmado) {
                        await this.controlador.deletAnuncio(element.id_reunion);
                        this.cargarInformacionUser();
                    }
                }
            });
        });

      
        
        
    }

    async obtenerInformacionAnucion(): Promise<void> {
        if (!this.formAnuncio) return;
        const datos = new FormData(this.formAnuncio);
        const fecha = (datos.get('fecha_reunion') as string || '').trim();
        const titulo = (datos.get('titulo_reunion') as string || '').trim();
        const horaInicio = (datos.get('hora_inicio_reunion') as string || '').trim();
        const horaFinal = (datos.get('hora_final_reunion') as string || '').trim();

        if (!fecha || !titulo || !horaInicio || !horaFinal) {
            alert("⚠️ Por favor completa todos los campos del anuncio (fecha, título, hora de inicio y hora final).");
            return;
        }

        if (horaInicio >= horaFinal) {
            alert("⚠️ La hora de inicio debe ser anterior a la hora final.");
            return;
        }

        const datAnuncio: iAnuncios = {
            fecha: fecha,
            anuncio: titulo,
            hora_inicio: horaInicio,
            hora_final: horaFinal,
        };

        const submitBtn = this.formAnuncio.querySelector('button[type="submit"]') as HTMLButtonElement | null;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Guardando...";
        }

        try {
            await this.controlador.newAnuncio(datAnuncio);
            this.formAnuncio.reset();
            alert("✅ Anuncio de fecha específica guardado exitosamente.");
            await this.cargarInformacionUser();
        } catch (err) {
            console.error("Error al registrar anuncio:", err);
            alert("❌ Ocurrió un error al guardar el anuncio.");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Guardar Anuncio E específico";
            }
        }
    }
}