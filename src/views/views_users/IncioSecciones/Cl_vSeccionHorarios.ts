
import supabaseService from "../../../config/supabase.js";
import Controller from "../../../controllers/Controller.js";
import { iHorario, iUserList } from "../../../types/types.js";
import modal_confirmacion from "../../views_resours/modal_confirmacion.js";

export default class Cl_vSeccionHorarios {
    public controller: Controller;
    private userList: HTMLSelectElement;
    private seccionHoarariosAct: HTMLTableElement;
    private buttonUserList: HTMLButtonElement;
    private SeleccionDia: HTMLSelectElement;
    private horainicio: HTMLInputElement;
    private horafinal: HTMLInputElement;
    private buttonNewday: HTMLButtonElement;

    private fechaEvent: HTMLInputElement;
    private anuncionEvent: HTMLInputElement;
    private hora_inicio: HTMLInputElement;
    private hora_final: HTMLInputElement;
    private buttonEvent: HTMLButtonElement;
    constructor(controller: Controller) {
        this.controller = controller;
        this.userList = document.getElementById("userSelect") as HTMLSelectElement
        this.seccionHoarariosAct = document.getElementById("seccionHoariosActivo") as HTMLTableElement;
        this.buttonUserList = document.getElementById("ButtonBuscarUserHorarios") as HTMLButtonElement;
        this.SeleccionDia = document.getElementById("selecDia") as HTMLSelectElement;
        this.horainicio = document.getElementById("timesInicio") as HTMLInputElement;
        this.horafinal = document.getElementById("timesFinal") as HTMLInputElement;
        this.buttonNewday = document.getElementById("UserNewday") as HTMLButtonElement;

        this.fechaEvent = document.getElementById("fechaEvent") as HTMLInputElement;
        this.anuncionEvent = document.getElementById("anuncioEvent") as HTMLInputElement;
        this.hora_inicio = document.getElementById("hora_inicio") as HTMLInputElement;
        this.hora_final = document.getElementById("hora_final") as HTMLInputElement;
        this.buttonEvent = document.getElementById("buttonAnuncio") as HTMLButtonElement;


        if (!this.userList && !this.seccionHoarariosAct && !this.buttonUserList) {
            return;
        }

        if (this.userList) {
            this.cargarlistUser();
        }

        if (this.buttonUserList && this.userList) {
            this.buttonUserList.addEventListener("click", e => {
                const [userID, UserPrograma] = this.userList.value.split("_");
                if (userID) this.buscarInformacionUser(userID);
            });
        }

        if (this.buttonNewday) {
            this.buttonNewday.addEventListener("click", e => {
                this.crearRegistro();
                setTimeout(() => {
                    this.buttonUserList?.click();
                }, 1500);
            });
        }
    }

    async cargarlistUser(idSeleccionado?: string) {
        const valorPrevio = idSeleccionado || this.userList.value;
        this.userList.innerHTML = ` <option value="" disabled selected>-- Seleccione un usuario --</option>`;
        const datUser = await this.controller.listUser();

        datUser.forEach((element: iUserList) => {
            const val = `${element.id_user}_${element.fk_programas || ''}`;
            const isSelected = valorPrevio && valorPrevio.startsWith(element.id_user);
            this.userList.innerHTML += ` <option value="${val}" ${isSelected ? 'selected' : ''}>${element.nombre}</option>`;
        });
    }
    async buscarInformacionUser(id: string) {
        const data = await this.controller.informacionHorarios(id)
        if (data.length > 0) {
            this.seccionHoarariosAct.innerHTML = ""
            data.forEach((element: iHorario, index: number) => {
                this.seccionHoarariosAct.innerHTML +=
                    ` <tr class="hover:bg-gray-50/80 transition-colors border-b border-gray-100">
    <!-- Día con diseño más limpio -->
    <td class="py-3 px-4 font-semibold text-gray-800 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-blue-500"></span>
        ${element.dia}
    </td>
    
    <!-- Horario ordenado con un guion separador y tipografía monoespaciada -->
    <td class="py-3 px-4 text-gray-600 font-mono text-xs">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700">
            <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>${element.horainicio} - ${element.horafinal}</span>
        </div>
    </td>
    
    <!-- Botón de acción alineado a la derecha -->
    <td class="py-3 px-4 text-right">
        <button type="button" id="btn_Delete_${index}" class="text-red-600 hover:text-red-700 font-medium text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors shadow-sm">
            Borrar
        </button>
    </td>
</tr>
                                       
        
                                `

            });

            data.forEach((element: iHorario, index: number) => {
                const btnDelete = document.getElementById(`btn_Delete_${index}`) as HTMLButtonElement | null;
                btnDelete?.addEventListener("click", async () => {
                    if (element.id_horarios) {
                        const confirmado = await modal_confirmacion.confirmar(`¿Estás seguro de que deseas eliminar el horario asignado para el día ${element.dia}?`);
                        if (confirmado) {
                            await this.controller.deleteDay(element.id_horarios);
                            this.buttonUserList.click();
                        }
                    }
                });
            });


        } else {
            this.seccionHoarariosAct.innerHTML =
                `<tr class="bg-white">
         <td colspan="3" class="py-8 px-4 text-center">
        <div class="flex flex-col items-center justify-center space-y-1">
            <!-- Icono sutil de advertencia o calendario vacío -->
            <svg class="w-8 h-8 text-gray-300 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-sm font-medium text-gray-600">No se encontró un horario asignado</p>
            <p class="text-xs text-gray-400">Este usuario aún no tiene registros de horarios guardados.</p>
        </div>
    </td>
        </tr>    `
        }
    }


    async crearRegistro() {
        const valorCompleto = this.userList.value;
        if (!valorCompleto) {
            alert("Por favor, selecciona un usuario primero.");
            return;
        }
        let [idUser, fkPrograma] = valorCompleto.split("_");

        // Si el select contenía datos previos o faltaba el programa, verificar en vivo en la base de datos
        if (!fkPrograma || fkPrograma === "undefined" || fkPrograma === "null" || fkPrograma.length < 10) {
            try {
                const { data: usuarioDb, error: errUser } = await supabaseService.client
                    .from("User")
                    .select("fk_programas")
                    .eq("id_user", idUser)
                    .maybeSingle();

                if (!errUser && usuarioDb && usuarioDb.fk_programas) {
                    fkPrograma = usuarioDb.fk_programas;
                    // Sincronizar el select para que quede actualizado
                    const opt = this.userList.options[this.userList.selectedIndex];
                    if (opt) opt.value = `${idUser}_${fkPrograma}`;
                }
            } catch (errCheck) {
                console.warn("No se pudo verificar programa en vivo:", errCheck);
            }
        }

        // Validar que el usuario tenga un programa asignado (UUID válido)
        if (!fkPrograma || fkPrograma === "undefined" || fkPrograma === "null" || fkPrograma.length < 10) {
            alert("Este usuario aún no tiene un programa asignado. Asígnale un programa desde la sección de Perfiles antes de crear un horario.");
            return;
        }

        const dia = this.SeleccionDia.value;
        if (!dia) {
            alert("Por favor, selecciona un día.");
            return;
        }

        const horaInicial = this.horainicio.value;
        const horafinal = this.horafinal.value;

        if (!horaInicial || !horafinal) {
            alert("Por favor, completa la hora de inicio y la hora final.");
            return;
        }

        const data: iHorario = {
            fk_user: idUser,
            fk_programa: fkPrograma,
            dia: dia,
            horainicio: horaInicial,
            horafinal: horafinal,
        };

        await this.controller.crearHorario(data);
    }


}