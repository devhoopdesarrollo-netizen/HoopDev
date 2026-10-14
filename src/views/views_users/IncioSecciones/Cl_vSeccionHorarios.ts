
import Controller from "../../../controllers/Controller.js";
import { iHorario, iUserList } from "../../../types/types.js";

export default class Cl_vSeccionHorarios {
    public controller: Controller;
    private userList: HTMLSelectElement;
    private seccionHoarariosAct: HTMLTableElement;
    private buttonUserList: HTMLButtonElement;
    private SeleccionDia: HTMLSelectElement;
    private horainicio: HTMLInputElement;
    private horafinal: HTMLInputElement;
    private buttonNewday: HTMLButtonElement;

    private fechaEvent:HTMLInputElement;
    private anuncionEvent:HTMLInputElement;
    private hora_inicio:HTMLInputElement;
    private hora_final:HTMLInputElement;
    private buttonEvent:HTMLButtonElement;   
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
        this.anuncionEvent =document.getElementById("anuncioEvent") as HTMLInputElement;
        this.hora_inicio = document.getElementById("hora_inicio")as HTMLInputElement;
        this.hora_final = document.getElementById("hora_final") as HTMLInputElement;
        this.buttonEvent = document.getElementById("buttonAnuncio") as HTMLButtonElement;


        this.cargarlistUser()
        this.buttonUserList.addEventListener("click", e => {

            const [userID, UserPrograma] = this.userList.value.split("_")
            this.buscarInformacionUser(userID)



        });
        this.buttonNewday.addEventListener("click", e => {
            this.crearRegistro()
            setTimeout(() => {
                this.buttonUserList.click()
            }, 1500);
        })

    }
    async cargarlistUser() {
        this.userList.innerHTML = ` <option value="" disabled>-- Seleccione un usuario --</option>`
        const datUser = await this.controller.listUser()

        datUser.forEach((element: iUserList) => {
            this.userList.innerHTML += ` <option value="${element.id_user}_${element.fk_programas}" >${element.nombre}</option>`
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
                const btnDelete = document.getElementById(`btn_Delete_${index}`) as HTMLButtonElement;
                btnDelete.addEventListener("click", e => {
                    if (element.id_horarios) {
                        this.controller.deleteDay(element.id_horarios)
                    }
                    setTimeout(() => {
                        this.buttonUserList.click()
                    }, 1500);
                })


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
        const valorCompleto = this.userList.value
        const [idUser, fkPrograma] = valorCompleto.split("_");
        const dia = this.SeleccionDia.value
        const horaInicial = this.horainicio.value
        const horafinal = this.horafinal.value

        const data: iHorario = {
            fk_user: idUser,
            fk_programa: fkPrograma,
            dia: dia,
            horainicio: horaInicial,
            horafinal: horafinal,
        }
        if (dia) {
            this.controller.crearHorario(data)
        }



    }


}