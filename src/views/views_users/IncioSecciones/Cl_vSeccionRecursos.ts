import Controller from "../../../controllers/Controller.js";
import { iRecursos } from "../../../types/types.js";
import modal_confirmacion from "../../views_resours/modal_confirmacion.js";

export default class Cl_vSeccionRecursos {
    public controllerSources: Controller;
    private seccionClickNew: HTMLElement | null;
    private modalDocumentNew: HTMLDialogElement | null;
    private formNewDocument: HTMLFormElement | null;
    private documentDireccion: HTMLInputElement | null;
    private seccionDocumentLoad: HTMLElement | null;
    private btnCloseModal: HTMLElement | null;
    private btnCancelModal: HTMLElement | null;
    private fileNameBadge: HTMLElement | null;
    private selectProgramaDoc: HTMLSelectElement | null;

    constructor(controlador: Controller) {
        this.controllerSources = controlador;
        this.seccionClickNew = document.getElementById("NewArchivo");
        this.modalDocumentNew = document.getElementById("modalNewDocument") as HTMLDialogElement | null;
        this.formNewDocument = document.getElementById("formNewDocument") as HTMLFormElement | null;
        this.documentDireccion = document.getElementById("documentDirecciontion") as HTMLInputElement | null;
        this.seccionDocumentLoad = document.getElementById("docuemtsLoad");
        this.btnCloseModal = document.getElementById("btnCerrarModalDoc");
        this.btnCancelModal = document.getElementById("btnCancelarModalDoc");
        this.fileNameBadge = document.getElementById("selectedFileName");
        this.selectProgramaDoc = document.getElementById("selectProgramaDoc") as HTMLSelectElement | null;

        // Guard: Si no hay elementos de recursos en esta página, no ejecutar
        if (!this.seccionDocumentLoad && !this.formNewDocument && !this.seccionClickNew) {
            return;
        }

        // Cargar programas en el selector
        if (this.selectProgramaDoc) {
            this.cargarProgramasSelect();
        }

        // Abrir modal de nuevo documento
        if (this.seccionClickNew && this.modalDocumentNew) {
            this.seccionClickNew.addEventListener("click", () => {
                this.formNewDocument?.reset();
                if (this.fileNameBadge) this.fileNameBadge.textContent = "";
                this.cargarProgramasSelect();
                this.modalDocumentNew?.showModal();
            });
        }

        // Cerrar modal con botón cancelar o X
        this.btnCloseModal?.addEventListener("click", () => {
            this.modalDocumentNew?.close();
        });
        this.btnCancelModal?.addEventListener("click", () => {
            this.modalDocumentNew?.close();
        });

        // Cerrar al hacer clic en el backdrop del diálogo
        this.modalDocumentNew?.addEventListener("click", (e) => {
            if (e.target === this.modalDocumentNew) {
                this.modalDocumentNew?.close();
            }
        });

        // Mostrar nombre del archivo seleccionado en el input de archivo
        this.documentDireccion?.addEventListener("change", () => {
            const file = this.filesLoad();
            if (file && this.fileNameBadge) {
                this.fileNameBadge.textContent = file.name;
            }
        });

        // Evento de envío del formulario
        if (this.formNewDocument) {
            this.formNewDocument.addEventListener("submit", async (e) => {
                e.preventDefault();
                await this.newDocument();
            });
        }

        // Cargar documentos existentes si el contenedor está en la página
        if (this.seccionDocumentLoad) {
            this.listFilesLoad();
        }
    }

    async cargarProgramasSelect(): Promise<void> {
        if (!this.selectProgramaDoc) return;
        try {
            const programas = await this.controllerSources.cargarProgramas();
            this.selectProgramaDoc.innerHTML = `<option value="" disabled selected>-- Selecciona un programa --</option>`;
            if (programas && programas.length > 0) {
                programas.forEach((p: any) => {
                    const id = p.id_programa || p.id_programas || p.id;
                    const nombre = p.nombre || "Programa";
                    this.selectProgramaDoc!.innerHTML += `<option value="${id}">${nombre}</option>`;
                });
            }
        } catch (err) {
            console.error("Error al cargar programas para documento:", err);
        }
    }

    filesLoad(): File | undefined {
        return this.documentDireccion?.files?.[0];
    }

    async newDocument() {
        if (!this.formNewDocument) return;
        const dataForm = new FormData(this.formNewDocument);
        const file = this.filesLoad();

        if (!file) {
            alert("⚠️ Por favor selecciona un archivo (PDF, DOCX, XLSX, etc.) para subir.");
            return;
        }

        const nameFiles = (dataForm.get("nameFiles") as string)?.trim();
        if (!nameFiles) {
            alert("⚠️ Por favor ingresa el nombre del documento.");
            return;
        }

        const fkPrograma = (dataForm.get("programa") as string)?.trim();
        if (!fkPrograma || fkPrograma === "undefined" || fkPrograma === "null") {
            alert("⚠️ Por favor selecciona el programa al que pertenece el documento.");
            return;
        }

        const empaquetadoDocument: iRecursos = {
            nameFiles: nameFiles,
            programa: fkPrograma,
            description: (dataForm.get("description") as string)?.trim() || "",
            documentDirecciontion: ""
        };

        const submitBtn = this.formNewDocument.querySelector('button[type="submit"]') as HTMLButtonElement | null;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="ph ph-spinner animate-spin text-lg"></i> Subiendo...`;
        }

        try {
            await this.controllerSources.loadDocument(empaquetadoDocument, file);
            alert("✅ ¡Documento subido con éxito a la biblioteca!");
            this.formNewDocument.reset();
            if (this.fileNameBadge) this.fileNameBadge.textContent = "";
            this.modalDocumentNew?.close();
            await this.listFilesLoad();
        } catch (error) {
            console.error("Error al registrar documento:", error);
            alert("❌ Ocurrió un error al subir el documento.");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="ph ph-check text-lg"></i> Guardar Documento`;
            }
        }
    }

    async listFilesLoad() {
        if (!this.seccionDocumentLoad) return;

        this.seccionDocumentLoad.innerHTML = `
            <div class="col-span-full py-12 text-center text-gray-400">
                <i class="ph ph-spinner animate-spin text-2xl block mb-2 mx-auto text-[#006eae]"></i>
                <span class="text-xs font-medium">Cargando biblioteca de recursos...</span>
            </div>
        `;

        try {
            const documentos: iRecursos[] = await this.controllerSources.cargaDocument();
            this.seccionDocumentLoad.innerHTML = "";

            if (!documentos || documentos.length === 0) {
                this.seccionDocumentLoad.innerHTML = `
                    <div class="col-span-full py-12 text-center text-gray-400">
                        <i class="ph ph-folder-open text-3xl block mb-2 mx-auto text-gray-300"></i>
                        <p class="text-sm font-semibold text-gray-600">No hay documentos disponibles</p>
                        <p class="text-xs text-gray-400 mt-1">Los documentos y guías compartidos aparecerán aquí.</p>
                    </div>
                `;
                return;
            }

            const isAdmin = window.location.pathname.includes("inicio_Administracion");

            documentos.forEach((element: iRecursos, index: number) => {
                const url = element.documentDirecciontion || "";
                const extension = url ? url.split("?")[0].split(".").pop()?.toUpperCase() || "PDF" : "PDF";

                const card = document.createElement("div");
                card.className = "group relative bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xs hover:shadow-md hover:border-[#80c8e4] transition-all duration-200";

                card.innerHTML = `
                    <div class="space-y-3">
                        <div class="flex items-center justify-between gap-2">
                            <div class="h-10 w-10 rounded-xl bg-[#b8e1f1]/40 text-[#006eae] border border-[#80c8e4]/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                                <i class="ph ph-file-text text-xl"></i>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#dbf5f0] text-[#146460] border border-[#b5f4eb]">
                                    ${extension}
                                </span>
                                ${isAdmin ? `
                                <button type="button" id="btnDeleteDoc_${index}" title="Eliminar documento"
                                    class="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                    <i class="ph ph-trash text-base"></i>
                                </button>
                                ` : ''}
                            </div>
                        </div>

                        <div class="space-y-1">
                            <h3 class="text-sm font-bold text-[#1d3854] group-hover:text-[#006eae] transition-colors line-clamp-2 leading-snug">
                                ${element.nameFiles}
                            </h3>
                            ${element.description && !element.description.startsWith("http") ? `
                            <p class="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                ${element.description}
                            </p>` : ''}
                            <div class="pt-1 flex items-center gap-1 text-[11px] font-medium text-gray-400">
                                <i class="ph ph-app-window text-xs text-[#006eae]"></i>
                                <span>${element.programa || 'General'}</span>
                            </div>
                        </div>
                    </div>

                    <a href="${element.documentDirecciontion}" target="_blank" download
                       class="w-full py-2 px-3 bg-[#006eae] hover:bg-[#1d3854] active:scale-[0.99] text-white font-medium text-xs rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-xs cursor-pointer">
                        <i class="ph ph-download-simple text-sm"></i>
                        <span>Descargar Documento</span>
                    </a>
                `;

                this.seccionDocumentLoad?.appendChild(card);
            });

            // Asignar eventos de eliminación si es vista de administrador
            if (isAdmin) {
                documentos.forEach((element: iRecursos, index: number) => {
                    const btnDelete = document.getElementById(`btnDeleteDoc_${index}`) as HTMLButtonElement | null;
                    btnDelete?.addEventListener("click", async (e) => {
                        e.stopPropagation();
                        const confirmado = await modal_confirmacion.confirmar(`¿Estás seguro de que deseas eliminar el documento "${element.nameFiles}"?`);
                        if (confirmado) {
                            try {
                                if (element.id) {
                                    await this.controllerSources.deleteDocument(element.id);
                                    await this.listFilesLoad();
                                }
                            } catch (err) {
                                console.error("Error al eliminar documento:", err);
                                alert("❌ No se pudo eliminar el documento.");
                            }
                        }
                    });
                });
            }

        } catch (error) {
            console.error("Error al listar documentos:", error);
            if (this.seccionDocumentLoad) {
                this.seccionDocumentLoad.innerHTML = `
                    <div class="col-span-full py-8 text-center text-red-500">
                        <i class="ph ph-warning-circle text-2xl block mb-1 mx-auto"></i>
                        <p class="text-xs font-semibold">Error al cargar la biblioteca de documentos.</p>
                    </div>
                `;
            }
        }
    }
}
