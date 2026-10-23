import Controller from "../../controllers/Controller.js";
import Cl_Tools from "../../models/Utils/Cl_Tools.js";
import { iPostResponse, iHorario, iAnuncios } from "../../types/types.js";
import Cl_vSeccionAnuncios from "./IncioSecciones/Cl_vSeccionAnuncios.js";
import Cl_vSeccionEncuestas from "./IncioSecciones/Cl_vSeccionEncuestas.js";
import Cl_vSeccionHorarios from "./IncioSecciones/Cl_vSeccionHorarios.js";
import Cl_vSeccionesAdministracion from "./IncioSecciones/Cl_vSeccionesAdministracion.js";
import Cl_PostNewModal from "./PostModal/Cl_vPostNewModal.js";

export default class Cl_vUserInicio {
    private VpostModal: Cl_PostNewModal;
    private vEncuestas: Cl_vSeccionEncuestas;
    private vHorarios: Cl_vSeccionHorarios;
    private vAnuncios: Cl_vSeccionAnuncios;
    private vAdministracion: Cl_vSeccionesAdministracion;
    private seccionPost_publicacion: HTMLElement | null;
    private seccionPost: HTMLElement | null;
    private seccionEncuestas: HTMLElement | null;
    private seccionHorarios: HTMLElement | null;
    private seccionRecursos: HTMLElement | null;
    private seccionPerfiles: HTMLElement | null;
    private buttonMenuEncuesta: NodeListOf<HTMLElement>;
    private buttonMenuHorarios: NodeListOf<HTMLElement>;
    private buttonMenuRecursos: NodeListOf<HTMLElement>;
    private buttonMenuPerfiles: NodeListOf<HTMLElement>;
    private buttonMenuInicio: NodeListOf<HTMLElement>;
    private controlador: Controller;
    private tools: Cl_Tools;
    private nameUser: NodeListOf<HTMLElement>;
    private userSeccion: any = null;
    private isUsuarioPage: boolean = false;

    constructor(controller: any) {
        this.controlador = controller;
        this.tools = new Cl_Tools();
        this.nameUser = document.querySelectorAll("#NameUser, .nameUser");
        this.VpostModal = new Cl_PostNewModal(this.controlador);
        this.vEncuestas = new Cl_vSeccionEncuestas(this.controlador);
        this.vHorarios = new Cl_vSeccionHorarios(this.controlador);
        this.vAnuncios = new Cl_vSeccionAnuncios(this.controlador);
        this.vAdministracion = new Cl_vSeccionesAdministracion(this.controlador);

        this.seccionPost_publicacion = document.getElementById("PostResponse");
        this.seccionPost = document.getElementById("Post");
        this.seccionEncuestas = document.getElementById("Encuestas");
        this.seccionHorarios = document.getElementById("Horarios");
        this.seccionRecursos = document.getElementById("Recursos");
        this.seccionPerfiles = document.getElementById("Perfiles");
        this.buttonMenuInicio = document.querySelectorAll("#ButtonMenuInicio") as NodeListOf<HTMLElement>;
        this.buttonMenuEncuesta = document.querySelectorAll("#ButtonMenuEncuesta") as NodeListOf<HTMLElement>;
        this.buttonMenuHorarios = document.querySelectorAll("#ButtonMenuHorarios") as NodeListOf<HTMLElement>;
        this.buttonMenuRecursos = document.querySelectorAll("#ButtonMenuRecursos") as NodeListOf<HTMLElement>;
        this.buttonMenuPerfiles = document.querySelectorAll("#ButtonMenuPerfiles") as NodeListOf<HTMLElement>;

        // Detectar si estamos en la página de usuario (no admin)
        this.isUsuarioPage = window.location.pathname.includes("inicio_usuario");

        // Cargar datos de la sesión del usuario
        try {
            const raw = localStorage.getItem("userSeccion");
            this.userSeccion = raw ? JSON.parse(raw) : null;
        } catch { this.userSeccion = null; }

        // Establecer nombre del usuario en la interfaz
        if (this.userSeccion?.nombre) {
            this.nameUser.forEach(el => {
                el.textContent = this.userSeccion.nombre;
            });
        } else {
            const nombre = this.controlador.nameUser();
            this.nameUser.forEach(el => {
                el.textContent = nombre;
            });
        }

        // Si es la página de usuario, verificar si tiene programa asignado
        if (this.isUsuarioPage) {
            this.inicializarPortalUsuario();
        }

        if (this.seccionPost_publicacion) {
            this.postResponse();
        }

        if (this.seccionPost) {
            this.estadoSeccion("post");
        }

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

    /**
     * Inicializa el portal del usuario:
     * - Si no tiene programa asignado, muestra mensaje "perfil en revisión"
     * - Si tiene programa, carga datos personalizados (horarios, anuncios, perfil)
     */
    private async inicializarPortalUsuario(): Promise<void> {
        const bannerRevision = document.getElementById("bannerPerfilRevision");
        const contenidoPrincipal = document.getElementById("contenidoPrincipalUsuario");

        if (!this.userSeccion?.fk_programas) {
            // No tiene programa asignado → "perfil en revisión"
            if (bannerRevision) bannerRevision.classList.remove("hidden");
        } else {
            if (bannerRevision) bannerRevision.classList.add("hidden");
        }

        // Cargar horarios personales del usuario
        await this.cargarHorariosUsuario();
        // Cargar anuncios generales
        await this.cargarAnunciosUsuario();
        // Poblar perfil del usuario
        this.poblarPerfilUsuario();
    }

    /**
     * Carga los horarios asignados únicamente al usuario logueado
     */
    private async cargarHorariosUsuario(): Promise<void> {
        const tablaHorarios = document.getElementById("seccionHoariosActivo") as HTMLElement | null;
        if (!tablaHorarios || !this.userSeccion?.id_user) return;

        try {
            const data = await this.controlador.informacionHorarios(this.userSeccion.id_user);
            tablaHorarios.innerHTML = "";

            if (!data || data.length === 0) {
                tablaHorarios.innerHTML = `
                    <tr>
                        <td colspan="4" class="py-6 px-4 text-center text-sm text-gray-400">
                            <i class="ph ph-calendar-x text-2xl block mb-1"></i>
                            No tienes horarios asignados por el momento.
                        </td>
                    </tr>`;
                return;
            }

            data.forEach((element: iHorario) => {
                tablaHorarios.innerHTML += `
                    <tr class="hover:bg-gray-50/80 transition-colors">
                        <td class="py-3 px-4 font-medium text-gray-900">${element.dia}</td>
                        <td class="py-3 px-4 font-mono text-gray-600">${element.horainicio} - ${element.horafinal}</td>
                        <td class="py-3 px-4 text-gray-500">—</td>
                        <td class="py-3 px-4 text-right">
                            <span class="px-2 py-0.5 text-[11px] font-semibold bg-green-50 text-green-700 rounded-full">Confirmado</span>
                        </td>
                    </tr>`;
            });
        } catch (err) {
            console.error("Error cargando horarios del usuario:", err);
            tablaHorarios.innerHTML = `
                <tr>
                    <td colspan="4" class="py-4 px-4 text-center text-xs text-red-400">
                        Error al cargar horarios.
                    </td>
                </tr>`;
        }
    }

    /**
     * Carga los anuncios publicados por la administración
     */
    private async cargarAnunciosUsuario(): Promise<void> {
        const panelAnuncios = document.getElementById("panelAnunciosUsuario") as HTMLElement | null;
        if (!panelAnuncios) return;

        try {
            const data = await this.controlador.loadAnuncio();
            panelAnuncios.innerHTML = "";

            if (!data || data.length === 0) {
                panelAnuncios.innerHTML = `
                    <div class="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-start space-x-3">
                        <i class="ph ph-info text-2xl text-gray-400 shrink-0 mt-0.5"></i>
                        <div class="space-y-1">
                            <h4 class="text-sm font-bold text-gray-600">Sin anuncios</h4>
                            <p class="text-xs text-gray-500 leading-relaxed">
                                No hay anuncios publicados por la administración en este momento.
                            </p>
                        </div>
                    </div>`;
                return;
            }

            data.forEach((elemento: iAnuncios) => {
                const horaInicio = this.tools.ConversorTimes(elemento.hora_inicio || "00:00");
                const horaFinal = this.tools.ConversorTimes(elemento.hora_final || "00:00");

                panelAnuncios.innerHTML += `
                    <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 flex items-start space-x-3">
                        <i class="ph ph-megaphone text-2xl text-blue-600 shrink-0 mt-0.5"></i>
                        <div class="space-y-1 flex-1">
                            <div class="flex items-center justify-between">
                                <h4 class="text-sm font-bold text-blue-900">${elemento.anuncio}</h4>
                                <span class="text-[11px] font-mono text-blue-600">${elemento.fecha}</span>
                            </div>
                            <p class="text-xs text-blue-700 leading-relaxed">
                                Horario: ${horaInicio} — ${horaFinal}
                            </p>
                        </div>
                    </div>`;
            });
        } catch (err) {
            console.error("Error cargando anuncios:", err);
        }
    }

    /**
     * Pobla la sección de "Mi Perfil" con los datos del usuario desde localStorage y base de datos
     */
    private async poblarPerfilUsuario(): Promise<void> {
        if (!this.userSeccion) {
            try {
                const raw = localStorage.getItem("userSeccion");
                this.userSeccion = raw ? JSON.parse(raw) : null;
            } catch { this.userSeccion = null; }
        }
        if (!this.userSeccion) return;

        const nombreEl = document.getElementById("perfilNombre");
        const correoEl = document.getElementById("perfilCorreo");
        const estadoEl = document.getElementById("perfilEstado");
        const rolEl = document.getElementById("perfilRol");
        const programaEl = document.getElementById("perfilPrograma");
        const programaDescEl = document.getElementById("perfilProgramaDesc");
        const paisEl = document.getElementById("perfilPais");
        const avatarEl = document.getElementById("perfilAvatar");

        const nombre = this.userSeccion.nombre || "Usuario";
        if (nombreEl) nombreEl.textContent = nombre;
        if (avatarEl) {
            const initials = nombre.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
            avatarEl.textContent = initials || "U";
        }
        if (correoEl) correoEl.textContent = this.userSeccion.correo_electronico || "—";
        if (estadoEl) estadoEl.textContent = "ACTIVO";
        if (rolEl) rolEl.textContent = this.userSeccion.cargo || "Usuario";
        if (paisEl) paisEl.textContent = this.userSeccion.pais || "Perú";

        if (programaEl) {
            const fkPrograma = this.userSeccion.fk_programas;

            if (!fkPrograma) {
                programaEl.innerHTML = `
                    <div class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                        <i class="ph ph-hourglass-medium text-lg text-amber-600"></i>
                        <span class="text-sm font-semibold">Pendiente de asignación</span>
                    </div>`;
                if (programaDescEl) {
                    programaDescEl.textContent = "Tu perfil está en revisión. Un administrador te asignará un programa pronto para habilitar todos tus módulos y horarios.";
                }
            } else if (this.userSeccion.nombre_programa) {
                programaEl.innerHTML = `
                    <div class="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white text-indigo-700 border border-indigo-200 shadow-xs">
                        <div class="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                            <i class="ph ph-graduation-cap-fill text-lg"></i>
                        </div>
                        <span class="text-base font-bold text-gray-900">${this.userSeccion.nombre_programa}</span>
                        <span class="ml-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Asignado</span>
                    </div>`;
                if (programaDescEl) {
                    programaDescEl.textContent = "Estás formalmente inscrito en este programa. Consulta la sección de Horarios para ver los días y canchas de tus entrenamientos.";
                }
            } else {
                // Consultar nombre del programa a través del controlador
                try {
                    const programas = await this.controlador.cargarProgramas();
                    const encontrado = programas.find((prog: any) => {
                        const id = prog.id_programa || prog.id_programas || prog.id;
                        return id == fkPrograma;
                    });

                    const nombreProg = encontrado?.nombre || "Programa Asignado";
                    this.userSeccion.nombre_programa = nombreProg;
                    localStorage.setItem("userSeccion", JSON.stringify(this.userSeccion));

                    programaEl.innerHTML = `
                        <div class="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white text-indigo-700 border border-indigo-200 shadow-xs">
                            <div class="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                                <i class="ph ph-graduation-cap-fill text-lg"></i>
                            </div>
                            <span class="text-base font-bold text-gray-900">${nombreProg}</span>
                            <span class="ml-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Asignado</span>
                        </div>`;
                    if (programaDescEl) {
                        programaDescEl.textContent = "Estás formalmente inscrito en este programa. Consulta la sección de Horarios para ver los días y canchas de tus entrenamientos.";
                    }
                } catch (error) {
                    console.error("Error al obtener nombre de programa:", error);
                    programaEl.innerHTML = `
                        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <i class="ph ph-graduation-cap text-base text-indigo-600"></i>
                            <span class="text-sm font-semibold">Programa Asignado</span>
                        </div>`;
                }
            }
        }
    }

    estadoSeccion(seccion: string) {
        this.seccionPost?.classList.add("hidden");
        this.seccionEncuestas?.classList.add("hidden");
        this.seccionHorarios?.classList.add("hidden");
        this.seccionRecursos?.classList.add("hidden");
        this.seccionPerfiles?.classList.add("hidden");
        switch (seccion) {
            case "post":
                this.seccionPost?.classList.remove("hidden");
                break;
            case "encuestas":
                this.seccionEncuestas?.classList.remove("hidden");
                break;
            case "horarios":
                this.seccionHorarios?.classList.remove("hidden");
                break;
            case "recursos":
                this.seccionRecursos?.classList.remove("hidden");
                break;
            case "perfiles":
                this.seccionPerfiles?.classList.remove("hidden");
                this.poblarPerfilUsuario();
                break;
        }
    }

    async postResponse() {
        if (!this.seccionPost_publicacion) return;
        const data = await this.controlador.postResponse();
        if (!data || !Array.isArray(data)) {
            this.seccionPost_publicacion.innerHTML = `
                <div class="col-span-full text-center py-16">
                    <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gray-100 mb-4">
                        <i class="ph ph-newspaper text-3xl text-gray-400"></i>
                    </div>
                    <p class="text-sm font-semibold text-gray-500">No hay publicaciones disponibles</p>
                    <p class="text-xs text-gray-400 mt-1">Las publicaciones aparecerán aquí cuando estén disponibles.</p>
                </div>`;
            return;
        }
        this.seccionPost_publicacion.innerHTML = "";

        const frame = document.createDocumentFragment();
        const tempContainer = document.createElement('div');

        data.forEach((element: iPostResponse, index: number) => {
            const authorName = element.User?.nombre || "HoopPeru";
            const initials = authorName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();

            const htmlPost = `<div
                class="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-gray-200 p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-all duration-200">
                <div class="space-y-4">
                    <div class="flex items-center space-x-3">
                        <div
                            class="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0 shadow-md shadow-blue-200/30">
                            <span class="text-xs text-white font-bold">${initials}</span>
                        </div>
                        <div>
                            <h3 class="text-sm font-bold text-gray-900">${authorName}</h3>
                            <p class="text-[11px] text-gray-400 flex items-center space-x-1">
                                <i class="ph ph-clock text-xs"></i>
                                <span>${this.tools.TimePost(element.fecha_post)}</span>
                            </p>
                        </div>
                    </div>
                    <p class="text-sm text-gray-700 leading-relaxed">
                        ${element.contenido}
                    </p>
                    ${element.img_direccion ? `<div
                        class="post-image-trigger group/img relative rounded-xl overflow-hidden border border-gray-100 bg-gray-900/5 h-56 sm:h-64 flex items-center justify-center cursor-zoom-in transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                        data-img="${element.img_direccion}"
                        data-author="${authorName}"
                        data-time="${this.tools.TimePost(element.fecha_post)}"
                        data-caption="${encodeURIComponent(element.contenido || '')}">
                        <img src="${element.img_direccion}" alt="Imagen de publicación" class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover/img:scale-[1.03]">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                        <div class="absolute bottom-2.5 right-2.5 bg-gray-950/80 hover:bg-gray-950 text-white backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 opacity-90 sm:opacity-0 sm:group-hover/img:opacity-100 transition-all duration-200 shadow-lg pointer-events-none transform translate-y-1 sm:translate-y-2 group-hover/img:translate-y-0">
                            <i class="ph ph-magnifying-glass-plus text-sm text-blue-300"></i>
                            <span>Ver grande</span>
                        </div>
                    </div>` : ''}
                </div>

                <div class="border-t border-gray-100 pt-3.5 space-y-2.5">
                    <div class="flex items-center text-xs text-gray-500 px-1">
                        <div class="flex items-center space-x-1.5">
                            <span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gradient-to-br from-red-400 to-pink-500">
                                <i class="ph ph-heart-fill text-[9px] text-white"></i>
                            </span>
                            <span class="font-semibold_${index} font-medium">${element.likes} Me gusta</span>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 gap-2">
                        <button id="btnLikePost" data-idpost="${element.id_post}" data-index="${index}"
                            class="w-full py-2 bg-gray-50 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 text-gray-600 hover:text-red-600 font-semibold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]">
                            <i class="hear-icono ph ph-heart text-base text-red-500"></i>
                            <span>Me gusta</span>
                        </button>
                    </div>
                </div>
            </div>`;

            tempContainer.innerHTML = htmlPost.trim();
            const postElement = tempContainer.firstChild;
            if (postElement) {
                frame.appendChild(postElement);
            }
        });

        this.seccionPost_publicacion.appendChild(frame);

        // Asignar eventos de likes
        data.forEach((element: iPostResponse, index: number) => {
            const btnLikePost = document.querySelector(`#btnLikePost[data-index="${index}"]`) as HTMLButtonElement | null;
            btnLikePost?.addEventListener("click", async () => {
                const heartIcon = btnLikePost.querySelector(".hear-icono") as HTMLElement | null;
                if (heartIcon) {
                    heartIcon.classList.toggle("ph-fill");
                    const likesElement = document.querySelector(`.font-semibold_${index}`) as HTMLElement | null;
                    if (likesElement) {
                        likesElement.textContent = `${element.likes} Me gusta`;
                    }
                    await this.controlador.likePost(element.id_post);
                }
            });
        });

        // Asignar eventos de click a las fotos para verlas en grande (Lightbox)
        const imageTriggers = this.seccionPost_publicacion.querySelectorAll(".post-image-trigger");
        imageTriggers.forEach((trigger) => {
            trigger.addEventListener("click", () => {
                const src = trigger.getAttribute("data-img") || "";
                const author = trigger.getAttribute("data-author") || "HoopPeru";
                const time = trigger.getAttribute("data-time") || "";
                const caption = trigger.getAttribute("data-caption") || "";
                if (src) {
                    this.openImageLightbox(src, author, time, caption);
                }
            });
        });
    }

    private initImageLightbox(): void {
        if (document.getElementById("hpImageLightboxModal")) return;

        const modal = document.createElement("div");
        modal.id = "hpImageLightboxModal";
        modal.className = "fixed inset-0 z-[100] bg-gray-950/90 backdrop-blur-md flex flex-col justify-between items-center p-3 sm:p-6 opacity-0 pointer-events-none transition-all duration-300 select-none";
        modal.innerHTML = `
            <!-- Barra Superior -->
            <div class="w-full max-w-5xl flex items-center justify-between text-white py-1 z-20">
                <div class="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 shadow-sm">
                    <div id="lightboxAuthorAvatar" class="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                        HP
                    </div>
                    <div>
                        <h4 id="lightboxAuthorName" class="text-xs sm:text-sm font-bold text-white leading-tight">HoopPeru</h4>
                        <p id="lightboxTime" class="text-[10px] text-gray-300 flex items-center space-x-1">
                            <i class="ph ph-clock text-[10px]"></i>
                            <span>Hace un momento</span>
                        </p>
                    </div>
                </div>

                <div class="flex items-center space-x-2">
                    <a id="lightboxNewTabBtn" href="#" target="_blank" rel="noopener noreferrer" 
                        title="Abrir imagen en tamaño completo"
                        class="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-semibold border border-white/10">
                        <i class="ph ph-arrow-square-out text-base"></i>
                        <span class="hidden sm:inline">Abrir original</span>
                    </a>
                    <button type="button" id="lightboxCloseBtn" 
                        title="Cerrar (Esc)"
                        class="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-red-500 text-white transition-all cursor-pointer flex items-center space-x-1 text-xs font-semibold border border-white/10">
                        <i class="ph ph-x text-base sm:text-lg"></i>
                        <span class="hidden sm:inline">Cerrar</span>
                    </button>
                </div>
            </div>

            <!-- Contenedor Central de Imagen -->
            <div id="lightboxBackdropArea" class="flex-1 w-full flex items-center justify-center p-2 sm:p-4 cursor-zoom-out relative">
                <div class="relative max-h-full max-w-full flex items-center justify-center">
                    <img id="lightboxImage" src="" alt="Vista ampliada" 
                        class="max-h-[72vh] sm:max-h-[78vh] max-w-[95vw] sm:max-w-[85vw] w-auto h-auto object-contain rounded-2xl shadow-2xl border border-white/15 transform scale-95 opacity-0 transition-all duration-300 cursor-default select-none">
                </div>
            </div>

            <!-- Pie con texto de la publicación -->
            <div id="lightboxCaptionContainer" class="w-full max-w-2xl px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs sm:text-sm text-center shadow-lg transition-all hidden z-20">
                <p id="lightboxCaptionText" class="line-clamp-3 text-gray-200 text-left sm:text-center"></p>
            </div>
        `;

        document.body.appendChild(modal);

        const closeModal = () => {
            modal.classList.add("opacity-0", "pointer-events-none");
            const img = modal.querySelector("#lightboxImage") as HTMLElement | null;
            if (img) {
                img.classList.remove("scale-100", "opacity-100");
                img.classList.add("scale-95", "opacity-0");
            }
            document.body.classList.remove("overflow-hidden");
        };

        const closeBtn = modal.querySelector("#lightboxCloseBtn");
        closeBtn?.addEventListener("click", closeModal);

        const backdropArea = modal.querySelector("#lightboxBackdropArea");
        backdropArea?.addEventListener("click", (e) => {
            if (e.target === backdropArea || (e.target as HTMLElement).id === "lightboxBackdropArea") {
                closeModal();
            }
        });

        const imgEl = modal.querySelector("#lightboxImage");
        imgEl?.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !modal.classList.contains("pointer-events-none")) {
                closeModal();
            }
        });
    }

    private openImageLightbox(imgSrc: string, author: string, time: string, caption: string): void {
        this.initImageLightbox();
        const modal = document.getElementById("hpImageLightboxModal");
        if (!modal) return;

        const imgEl = modal.querySelector("#lightboxImage") as HTMLImageElement | null;
        const authorEl = modal.querySelector("#lightboxAuthorName");
        const avatarEl = modal.querySelector("#lightboxAuthorAvatar");
        const timeEl = modal.querySelector("#lightboxTime span");
        const newTabBtn = modal.querySelector("#lightboxNewTabBtn") as HTMLAnchorElement | null;
        const captionContainer = modal.querySelector("#lightboxCaptionContainer");
        const captionText = modal.querySelector("#lightboxCaptionText");

        if (imgEl) {
            imgEl.src = imgSrc;
        }
        if (authorEl) authorEl.textContent = author;
        if (avatarEl) {
            const initials = author.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
            avatarEl.textContent = initials || "HP";
        }
        if (timeEl) timeEl.textContent = time;
        if (newTabBtn) newTabBtn.href = imgSrc;

        const decodedCaption = caption ? decodeURIComponent(caption).trim() : "";
        if (decodedCaption) {
            if (captionText) captionText.textContent = decodedCaption;
            captionContainer?.classList.remove("hidden");
        } else {
            captionContainer?.classList.add("hidden");
        }

        modal.classList.remove("opacity-0", "pointer-events-none");
        document.body.classList.add("overflow-hidden");

        setTimeout(() => {
            if (imgEl) {
                imgEl.classList.remove("scale-95", "opacity-0");
                imgEl.classList.add("scale-100", "opacity-100");
            }
        }, 20);
    }
}
