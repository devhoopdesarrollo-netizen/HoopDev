import Controller from "../../../controllers/Controller.js";
import { iEncuesta, iPreguntas } from "../../../types/types.js";
import modal_confirmacion from "../../views_resours/modal_confirmacion.js";

export default class Cl_vSeccionEncuestas {
    private controlador: Controller;
    private isUsuario: boolean = false;
    private userId: string = "";

    // Elementos Admin
    private secionesEncuestaForm: HTMLFormElement | null = null;
    private seccion_encuetas: HTMLElement | null = null;
    private preguntasActuales: HTMLElement | null = null;
    private btnAgregarPregunta: HTMLElement | null = null;
    private botonCancelarFom: HTMLButtonElement | null = null;
    private modalCrear: HTMLElement | null = null;
    private btnAbrirModalCrear: HTMLElement | null = null;
    private btnCerrarCrear: HTMLElement | null = null;

    private modalRespuestas: HTMLElement | null = null;
    private tituloRespuestas: HTMLElement | null = null;
    private subtituloRespuestas: HTMLElement | null = null;
    private contenedorRespuestas: HTMLElement | null = null;
    private btnCerrarRespuestas: HTMLElement | null = null;
    private btnCerrarRespuestasFooter: HTMLElement | null = null;

    // Elementos Usuario
    private modalResponder: HTMLElement | null = null;
    private formResponder: HTMLFormElement | null = null;
    private tituloResponder: HTMLElement | null = null;
    private inputTematicaId: HTMLInputElement | null = null;
    private contenedorPreguntasUsuario: HTMLElement | null = null;
    private btnCerrarResponder: HTMLElement | null = null;
    private btnCancelarResponder: HTMLElement | null = null;

    constructor(controller: any) {
        this.controlador = controller;
        this.isUsuario = window.location.pathname.includes("inicio_usuario");

        // Cargar ID de usuario logueado
        try {
            const rawUser = localStorage.getItem("userSeccion");
            if (rawUser) {
                const parsed = JSON.parse(rawUser);
                this.userId = parsed.id_user || "";
            }
        } catch {
            this.userId = "";
        }
        if (!this.userId && this.controlador.UsermMController?.fk_user) {
            this.userId = this.controlador.UsermMController.fk_user;
        }

        // Elementos comunes
        this.seccion_encuetas = document.getElementById("listaEncuestas");

        if (this.isUsuario) {
            this.inicializarUsuario();
        } else {
            this.inicializarAdmin();
        }
    }

    // =========================================================================
    // VISTA USUARIO (Participación en Encuestas)
    // =========================================================================

    private inicializarUsuario() {
        this.modalResponder = document.getElementById("modalResponderEncuesta");
        this.formResponder = document.getElementById("formResponderEncuesta") as HTMLFormElement | null;
        this.tituloResponder = document.getElementById("tituloResponderEncuesta");
        this.inputTematicaId = document.getElementById("responderEncuestaIdTematica") as HTMLInputElement | null;
        this.contenedorPreguntasUsuario = document.getElementById("contenedorPreguntasUsuario");
        this.btnCerrarResponder = document.getElementById("btnCerrarResponderEncuesta");
        this.btnCancelarResponder = document.getElementById("btnCancelarResponderEncuesta");

        if (this.seccion_encuetas) {
            this.mostrarEncuestasUsuario();

            // Delegación de eventos para botón "Responder Encuesta"
            this.seccion_encuetas.addEventListener("click", (e) => {
                const target = e.target as HTMLElement;
                const btnResponder = target.closest(".btn-responder-encuesta") as HTMLButtonElement | null;
                if (btnResponder) {
                    const id = btnResponder.getAttribute("data-id") || "";
                    const nombre = btnResponder.getAttribute("data-nombre") || "Encuesta";
                    this.abrirModalResponder(id, nombre);
                }
            });
        }

        // Eventos para cerrar modal de respuesta
        this.btnCerrarResponder?.addEventListener("click", () => this.cerrarModalResponder());
        this.btnCancelarResponder?.addEventListener("click", () => this.cerrarModalResponder());

        if (this.modalResponder) {
            this.modalResponder.addEventListener("click", (e) => {
                if (e.target === this.modalResponder) {
                    this.cerrarModalResponder();
                }
            });
        }

        // Envío de respuestas
        if (this.formResponder) {
            this.formResponder.addEventListener("submit", (e) => {
                this.enviarRespuestasUsuario(e);
            });
        }
    }

    async mostrarEncuestasUsuario() {
        if (!this.seccion_encuetas) return;
        this.seccion_encuetas.innerHTML = `
            <tr>
                <td colspan="3" class="py-6 px-4 text-center text-sm text-gray-400">
                    <i class="ph ph-spinner animate-spin text-lg inline-block mr-2 text-[#006eae]"></i> Cargando encuestas...
                </td>
            </tr>
        `;

        const data: Array<iEncuesta & { respondida: boolean }> = await this.controlador.obtenerEncuestasConEstado(this.userId);
        if (!data || data.length === 0) {
            this.seccion_encuetas.innerHTML = `
                <tr>
                    <td colspan="3" class="py-6 px-4 text-center text-sm text-gray-400">
                        No hay encuestas disponibles en este momento.
                    </td>
                </tr>
            `;
            return;
        }

        this.seccion_encuetas.innerHTML = "";
        data.forEach((element) => {
            const row = document.createElement("tr");
            row.className = "hover:bg-gray-50 transition-colors";

            const estadoBadge = element.respondida
                ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#dbf5f0] text-[#146460] border border-[#b5f4eb]"><span class="w-1.5 h-1.5 rounded-full bg-[#00aea5]"></span>Completada</span>`
                : `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Pendiente</span>`;

            const accionBtn = element.respondida
                ? `<button disabled class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-400 cursor-not-allowed">
                    <i class="ph ph-check-circle text-sm text-emerald-600"></i> Respondida
                   </button>`
                : `<button class="btn-responder-encuesta inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#006eae] hover:bg-[#1d3854] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                    data-id="${element.id_tematica || ''}"
                    data-nombre="${element.nombre_tematica}">
                    <i class="ph ph-pencil-simple-line text-sm"></i> Responder Encuesta
                   </button>`;

            row.innerHTML = `
                <td class="py-3.5 px-4 font-medium text-gray-800">
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full ${element.respondida ? 'bg-[#00aea5]' : 'bg-[#006eae]'}"></span>
                        ${element.nombre_tematica}
                    </div>
                </td>
                <td class="py-3.5 px-4">
                    ${estadoBadge}
                </td>
                <td class="py-3.5 px-4 text-right">
                    ${accionBtn}
                </td>
            `;
            this.seccion_encuetas?.appendChild(row);
        });
    }

    async abrirModalResponder(id_tematica: string, nombre: string) {
        if (!this.modalResponder || !this.formResponder || !this.contenedorPreguntasUsuario) return;

        if (this.tituloResponder) {
            this.tituloResponder.textContent = `Encuesta: ${nombre}`;
        }
        if (this.inputTematicaId) {
            this.inputTematicaId.value = id_tematica;
        }

        this.contenedorPreguntasUsuario.innerHTML = `
            <div class="py-8 text-center text-gray-400">
                <i class="ph ph-spinner animate-spin text-2xl inline-block mb-2 text-[#006eae]"></i>
                <p class="text-sm">Cargando preguntas de la encuesta...</p>
            </div>
        `;

        this.modalResponder.classList.remove("hidden");

        const preguntas = await this.controlador.cargarPreguntasEncuesta(id_tematica);
        if (!preguntas || preguntas.length === 0) {
            this.contenedorPreguntasUsuario.innerHTML = `
                <div class="py-6 text-center text-gray-500">
                    <i class="ph ph-warning-circle text-3xl text-amber-500 block mb-2"></i>
                    <p class="text-sm">Esta encuesta no contiene preguntas disponibles.</p>
                </div>
            `;
            return;
        }

        this.contenedorPreguntasUsuario.innerHTML = "";
        preguntas.forEach((p: iPreguntas, index: number) => {
            const pCard = document.createElement("div");
            pCard.className = "p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2.5";
            pCard.innerHTML = `
                <div class="flex items-start gap-2.5">
                    <span class="flex items-center justify-center w-6 h-6 rounded-lg bg-[#006eae]/10 text-[#006eae] text-xs font-bold shrink-0 mt-0.5">
                        ${index + 1}
                    </span>
                    <p class="text-sm font-semibold text-gray-800 leading-snug">
                        ${p.texto_pregunta}
                    </p>
                </div>
                <div>
                    <textarea
                        name="resp_${p.id_pregunta}"
                        data-pregunta-id="${p.id_pregunta}"
                        rows="2"
                        required
                        placeholder="Escribe tu respuesta aquí..."
                        class="pregunta-respuesta-input w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#006eae]/20 focus:border-[#006eae] text-gray-800 resize-none transition-all placeholder:text-gray-400"></textarea>
                </div>
                <div>
                    <input
                        type="text"
                        name="desc_${p.id_pregunta}"
                        data-pregunta-desc="${p.id_pregunta}"
                        placeholder="Comentario u observación (opcional)"
                        class="pregunta-desc-input w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none focus:border-[#006eae] transition-all placeholder:text-gray-400" />
                </div>
            `;
            this.contenedorPreguntasUsuario?.appendChild(pCard);
        });
    }

    cerrarModalResponder() {
        if (this.modalResponder) {
            this.modalResponder.classList.add("hidden");
        }
        if (this.formResponder) {
            this.formResponder.reset();
        }
        if (this.contenedorPreguntasUsuario) {
            this.contenedorPreguntasUsuario.innerHTML = "";
        }
    }

    async enviarRespuestasUsuario(e: Event) {
        e.preventDefault();
        if (!this.formResponder || !this.contenedorPreguntasUsuario) return;

        if (!this.userId || this.userId === "error") {
            alert("Debes iniciar sesión para poder responder la encuesta.");
            return;
        }

        const respuestaInputs = this.formResponder.querySelectorAll<HTMLTextAreaElement>(".pregunta-respuesta-input");
        if (respuestaInputs.length === 0) {
            alert("No hay preguntas para responder.");
            return;
        }

        const respuestas: Array<{ fk_pregunta: string; fk_user: string; respuesta: string; descripcion_reporte: string }> = [];

        for (let i = 0; i < respuestaInputs.length; i++) {
            const input = respuestaInputs[i];
            const val = input.value.trim();
            const fk_pregunta = input.getAttribute("data-pregunta-id");
            if (!val) {
                alert(`Por favor responde la pregunta número ${i + 1}.`);
                input.focus();
                return;
            }
            if (!fk_pregunta) continue;

            const descInput = this.formResponder.querySelector<HTMLInputElement>(`input[data-pregunta-desc="${fk_pregunta}"]`);
            const descripcion = descInput?.value.trim() || "Respuesta registrada";

            respuestas.push({
                fk_pregunta,
                fk_user: this.userId,
                respuesta: val,
                descripcion_reporte: descripcion
            });
        }

        const btnSubmit = this.formResponder.querySelector("#btnEnviarRespuestas") as HTMLButtonElement | null;
        try {
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = `<i class="ph ph-spinner animate-spin mr-1"></i> Enviando...`;
            }

            await this.controlador.guardarRespuestas(respuestas);
            alert("¡Muchas gracias! Tus respuestas han sido enviadas correctamente.");
            this.cerrarModalResponder();
            await this.mostrarEncuestasUsuario();
        } catch (err: any) {
            console.error("Error al enviar respuestas:", err);
            alert("Ocurrió un error al enviar tus respuestas. Por favor intenta de nuevo.");
        } finally {
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.textContent = "Enviar Respuestas";
            }
        }
    }

    // =========================================================================
    // VISTA ADMINISTRACIÓN (Crear, Listar, Borrar, Ver Respuestas)
    // =========================================================================

    private inicializarAdmin() {
        this.secionesEncuestaForm = document.getElementById("formEncuesta") as HTMLFormElement | null;
        this.preguntasActuales = document.getElementById("Preguntas");
        this.btnAgregarPregunta = document.getElementById("btnAgregarPregunta");
        this.botonCancelarFom = document.getElementById("btnCancelarCrear") as HTMLButtonElement | null;
        this.modalCrear = document.getElementById("modalCrearEncuesta");
        this.btnAbrirModalCrear = document.getElementById("btnAbrirModalCrear");
        this.btnCerrarCrear = document.getElementById("btnCerrarCrear");

        this.modalRespuestas = document.getElementById("modalVerRespuestas");
        this.tituloRespuestas = document.getElementById("tituloEncuestaRespuestas");
        this.subtituloRespuestas = document.getElementById("subtituloRespuestas");
        this.contenedorRespuestas = document.getElementById("contenedorRespuestas");
        this.btnCerrarRespuestas = document.getElementById("btnCerrarRespuestas");
        this.btnCerrarRespuestasFooter = document.getElementById("btnCerrarRespuestasFooter");

        if (!this.secionesEncuestaForm && !this.seccion_encuetas) {
            return;
        }

        if (this.seccion_encuetas) {
            this.mostrarEncuestasAdmin();

            // Delegación de eventos para la tabla Admin (Ver Respuestas y Borrar)
            this.seccion_encuetas.addEventListener("click", (e) => {
                const target = e.target as HTMLElement;

                const btnVer = target.closest(".btn-ver-respuestas") as HTMLButtonElement | null;
                if (btnVer) {
                    const id = btnVer.getAttribute("data-id") || "";
                    const nombre = btnVer.getAttribute("data-nombre") || "Encuesta";
                    this.abrirModalRespuestas(id, nombre);
                    return;
                }

                const btnBorrar = target.closest(".btn-borrar") as HTMLButtonElement | null;
                if (btnBorrar) {
                    const id = btnBorrar.getAttribute("data-id") || "";
                    const nombre = btnBorrar.getAttribute("data-nombre") || "Encuesta";
                    this.borrarEncuestaAdmin(id, nombre);
                    return;
                }
            });
        }

        // Control del Modal de Crear Encuesta
        if (this.btnAbrirModalCrear) {
            this.btnAbrirModalCrear.addEventListener("click", () => this.abrirModalCrear());
        }
        if (this.btnCerrarCrear) {
            this.btnCerrarCrear.addEventListener("click", () => this.cerrarModalCrear());
        }
        if (this.botonCancelarFom) {
            this.botonCancelarFom.addEventListener("click", () => this.cerrarModalCrear());
        }
        if (this.modalCrear) {
            this.modalCrear.addEventListener("click", (e) => {
                if (e.target === this.modalCrear) {
                    this.cerrarModalCrear();
                }
            });
        }

        // Envío del formulario de Crear Encuesta
        if (this.secionesEncuestaForm) {
            this.secionesEncuestaForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                await this.crearNuevaEncuesta();
            });
        }

        // Botón agregar pregunta dinámica
        if (this.btnAgregarPregunta && this.secionesEncuestaForm) {
            this.btnAgregarPregunta.addEventListener("click", () => {
                this.agregarPregunta();
            });
        }

        // Control del Modal de Ver Respuestas
        if (this.btnCerrarRespuestas) {
            this.btnCerrarRespuestas.addEventListener("click", () => this.cerrarModalRespuestas());
        }
        if (this.btnCerrarRespuestasFooter) {
            this.btnCerrarRespuestasFooter.addEventListener("click", () => this.cerrarModalRespuestas());
        }
        if (this.modalRespuestas) {
            this.modalRespuestas.addEventListener("click", (e) => {
                if (e.target === this.modalRespuestas) {
                    this.cerrarModalRespuestas();
                }
            });
        }
    }

    abrirModalCrear() {
        if (this.modalCrear) {
            this.modalCrear.classList.remove("hidden");
        }
    }

    cerrarModalCrear() {
        if (this.modalCrear) {
            this.modalCrear.classList.add("hidden");
        }
        this.reinicarFormulario();
    }

    abrirModalRespuestas(id_tematica: string, nombre: string) {
        if (!this.modalRespuestas || !this.contenedorRespuestas) return;

        if (this.tituloRespuestas) {
            this.tituloRespuestas.textContent = `Respuestas: ${nombre}`;
        }
        if (this.subtituloRespuestas) {
            this.subtituloRespuestas.textContent = "Cargando respuestas...";
        }
        this.contenedorRespuestas.innerHTML = `
            <div class="py-12 text-center text-gray-400">
                <i class="ph ph-spinner animate-spin text-3xl inline-block mb-2 text-[#006eae]"></i>
                <p class="text-sm">Consultando respuestas en la base de datos...</p>
            </div>
        `;

        this.modalRespuestas.classList.remove("hidden");
        this.cargarContenidoRespuestas(id_tematica);
    }

    private async cargarContenidoRespuestas(id_tematica: string) {
        if (!this.contenedorRespuestas) return;

        const { preguntas, reportes } = await this.controlador.cargarRespuestasPorTematica(id_tematica);

        if (!reportes || reportes.length === 0) {
            if (this.subtituloRespuestas) {
                this.subtituloRespuestas.textContent = "0 respuestas registradas";
            }
            this.contenedorRespuestas.innerHTML = `
                <div class="py-12 text-center text-gray-400 space-y-2">
                    <i class="ph ph-tray text-4xl text-gray-300 block"></i>
                    <p class="text-sm font-medium text-gray-600">Aún no hay respuestas registradas para esta encuesta.</p>
                    <p class="text-xs text-gray-400">Las respuestas de los usuarios aparecerán aquí en cuanto las envíen.</p>
                </div>
            `;
            return;
        }

        // Agrupar respuestas por usuario
        const userGroups = new Map<string, { user: any; fecha: string; answers: Map<string, { respuesta: string; descripcion: string }> }>();
        reportes.forEach((r: any) => {
            if (!userGroups.has(r.fk_user)) {
                userGroups.set(r.fk_user, {
                    user: r.User || { nombre: "Usuario" },
                    fecha: r.fecha_reporte,
                    answers: new Map()
                });
            }
            userGroups.get(r.fk_user)!.answers.set(r.fk_pregunta, {
                respuesta: r.respuesta,
                descripcion: r.descripcion_reporte
            });
        });

        if (this.subtituloRespuestas) {
            this.subtituloRespuestas.textContent = `${userGroups.size} usuario(s) han respondido (${reportes.length} respuestas)`;
        }

        this.contenedorRespuestas.innerHTML = "";
        userGroups.forEach((group) => {
            const card = document.createElement("div");
            card.className = "p-4 bg-gray-50 rounded-xl border border-gray-200/80 space-y-3";

            const timeStr = group.fecha ? new Date(group.fecha).toLocaleString() : "";
            const preguntasHtml = preguntas.map((p: any, idx: number) => {
                const ans = group.answers.get(p.id_pregunta);
                return `
                    <div class="space-y-1">
                        <p class="font-semibold text-xs uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                            <span class="w-4 h-4 rounded-full bg-[#006eae]/10 text-[#006eae] text-[10px] flex items-center justify-center font-bold shrink-0">${idx + 1}</span>
                            ${p.texto_pregunta}
                        </p>
                        <div class="bg-white p-3 rounded-lg border border-gray-200/60 text-gray-700 text-sm whitespace-normal break-words shadow-xs">
                            <p class="text-gray-800">${ans ? ans.respuesta : '<span class="text-gray-400 italic">Sin respuesta</span>'}</p>
                            ${ans && ans.descripcion && ans.descripcion !== "Respuesta registrada" && ans.descripcion !== "Sin observaciones adicionales" ? `<p class="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500"><span class="font-semibold text-[#146460]">Observación:</span> ${ans.descripcion}</p>` : ''}
                        </div>
                    </div>
                `;
            }).join("");

            card.innerHTML = `
                <div class="flex justify-between items-center text-xs text-gray-500 border-b border-gray-200/50 pb-2">
                    <span class="font-semibold text-[#006eae] flex items-center gap-1.5">
                        <i class="ph ph-user-circle text-base"></i>
                        ${group.user.nombre || "Usuario"}
                        ${group.user.correo_electronico ? `<span class="text-gray-400 font-normal">(${group.user.correo_electronico})</span>` : ''}
                    </span>
                    <span class="text-gray-400 font-mono text-[11px]">${timeStr}</span>
                </div>
                <div class="space-y-3">
                    ${preguntasHtml}
                </div>
            `;
            this.contenedorRespuestas?.appendChild(card);
        });
    }

    cerrarModalRespuestas() {
        if (this.modalRespuestas) {
            this.modalRespuestas.classList.add("hidden");
        }
        if (this.contenedorRespuestas) {
            this.contenedorRespuestas.innerHTML = "";
        }
    }

    async borrarEncuestaAdmin(id_tematica: string, nombre: string) {
        if (!id_tematica) return;
        const confirmacion = await modal_confirmacion.confirmar(`¿Estás seguro de que deseas eliminar la encuesta "${nombre}"?\nEsta acción borrará todas sus preguntas y respuestas asociadas de forma permanente.`);
        if (!confirmacion) return;

        try {
            await this.controlador.eliminarEncuesta(id_tematica);
            alert(`La encuesta "${nombre}" ha sido eliminada correctamente.`);
            await this.mostrarEncuestasAdmin();
        } catch (err) {
            console.error("Error al eliminar encuesta:", err);
            alert("Ocurrió un error al intentar eliminar la encuesta.");
        }
    }

    renderPreguntasModal() {
        if (!this.preguntasActuales) return;
        this.preguntasActuales.innerHTML = "";
        const dataActuales = this.controlador.mostrarPregunta();
        dataActuales.forEach((element: iPreguntas, index: number) => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "flex items-center justify-between p-3.5 bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/80 hover:border-slate-300 rounded-xl transition-all duration-200 group";
            itemDiv.innerHTML = `
                <div class="flex items-center gap-3 min-w-0 pr-3">
                    <span class="flex items-center justify-center w-6 h-6 bg-[#006eae]/10 text-[#006eae] rounded-lg text-xs font-bold shrink-0">
                        ${index + 1}
                    </span>
                    <p class="text-sm font-medium text-slate-700 leading-snug break-words">
                        ${element.texto_pregunta}
                    </p>
                </div>
                <button type="button" class="btn-eliminar-pregunta p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0 active:scale-95 opacity-80 group-hover:opacity-100 cursor-pointer" title="Eliminar pregunta">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            `;
            const btnEliminar = itemDiv.querySelector(".btn-eliminar-pregunta");
            if (btnEliminar) {
                btnEliminar.addEventListener("click", async () => {
                    const confirmacion = await modal_confirmacion.confirmar(`¿Deseas eliminar la pregunta "${element.texto_pregunta}" de la lista?`);
                    if (confirmacion) {
                        this.controlador.borrar(element);
                        this.renderPreguntasModal();
                    }
                });
            }
            this.preguntasActuales?.appendChild(itemDiv);
        });
    }

    agregarPregunta() {
        if (!this.secionesEncuestaForm) return;
        const formPregunt = this.secionesEncuestaForm.elements.namedItem("preguntasEncuesta") as HTMLInputElement;
        const texto = formPregunt?.value?.trim();
        if (!texto) {
            alert("Por favor escribe el texto de la pregunta antes de agregarla.");
            return;
        }

        this.controlador.cargarPregunta(texto);
        if (formPregunt) formPregunt.value = "";
        this.renderPreguntasModal();
    }

    async mostrarEncuestasAdmin() {
        if (!this.seccion_encuetas) return;
        this.seccion_encuetas.innerHTML = `
            <tr>
                <td colspan="2" class="py-6 px-4 text-center text-sm text-gray-400">
                    <i class="ph ph-spinner animate-spin text-lg inline-block mr-2 text-[#006eae]"></i> Cargando encuestas...
                </td>
            </tr>
        `;

        const data = await this.controlador.cargarEncuetas();
        if (!data || data.length === 0) {
            this.seccion_encuetas.innerHTML = `
                <tr>
                    <td colspan="2" class="py-6 px-4 text-center text-sm text-gray-400">
                        No hay encuestas creadas. Haz clic en "+ Crear Encuesta" para comenzar.
                    </td>
                </tr>
            `;
            return;
        }

        this.seccion_encuetas.innerHTML = "";
        data.forEach((element: iEncuesta) => {
            const row = document.createElement("tr");
            row.className = "hover:bg-gray-50 transition-colors";
            row.innerHTML = `
                <td class="py-3.5 px-4 font-medium text-gray-800">
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-[#006eae]"></span>
                        ${element.nombre_tematica}
                    </div>
                </td>
                <td class="py-3.5 px-4 text-right space-x-2">
                    <button
                        class="btn-ver-respuestas inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#b8e1f1]/50 text-[#1d3854] hover:bg-[#b8e1f1] transition-colors border border-[#80c8e4]/50 cursor-pointer active:scale-95"
                        data-id="${element.id_tematica || ''}"
                        data-nombre="${element.nombre_tematica}">
                        <i class="ph ph-chat-circle-dots text-sm"></i>
                        Ver Respuestas
                    </button>
                    <button
                        class="btn-borrar inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors border border-red-200 cursor-pointer active:scale-95"
                        data-id="${element.id_tematica || ''}"
                        data-nombre="${element.nombre_tematica}">
                        <i class="ph ph-trash text-sm"></i>
                        Borrar
                    </button>
                </td>
            `;
            this.seccion_encuetas?.appendChild(row);
        });
    }

    reinicarFormulario() {
        if (this.secionesEncuestaForm) {
            this.secionesEncuestaForm.reset();
        }
        this.controlador.reiniciar();
        if (this.preguntasActuales) {
            this.preguntasActuales.innerHTML = "";
        }
    }

    async crearNuevaEncuesta() {
        if (!this.secionesEncuestaForm) return;
        const dat = this.secionesEncuestaForm.elements.namedItem("nombreEncuesta") as HTMLInputElement;
        const nombre = dat?.value?.trim();
        if (!nombre) {
            alert("Por favor ingresa el título de la encuesta.");
            return;
        }

        const preguntas = this.controlador.mostrarPregunta();
        if (!preguntas || preguntas.length === 0) {
            alert("Debes agregar al menos una pregunta a la encuesta antes de subirla.");
            return;
        }

        const data: iEncuesta = {
            nombre_tematica: nombre
        };

        const btnSubmit = this.secionesEncuestaForm.querySelector("button[type='submit']") as HTMLButtonElement | null;
        try {
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerHTML = `<i class="ph ph-spinner animate-spin mr-1"></i> Subiendo...`;
            }

            await this.controlador.crearEncuetas(data, preguntas);
            alert("¡Encuesta creada exitosamente!");
            this.cerrarModalCrear();
            await this.mostrarEncuestasAdmin();
        } catch (err: any) {
            console.error("Error al crear encuesta:", err);
            alert("Error al crear la encuesta. Es posible que el nombre ya exista.");
        } finally {
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.textContent = "Subir";
            }
        }
    }
}
