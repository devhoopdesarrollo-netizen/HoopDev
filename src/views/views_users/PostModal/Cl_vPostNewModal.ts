
import Controller from "../../../controllers/Controller.js";
import { iPostNew } from "../../../types/types.js";

export default class Cl_PostNewModal {
    private form: HTMLFormElement | null = null;
    private ImagenTem: HTMLElement | null = null;
    private inputImagen: HTMLElement | null = null;
    private modalSeccion: HTMLElement | null = null;
    private inputFileInput: HTMLInputElement | null = null;
    private currentObjectUrl: string | null = null;
    public controlador: Controller | null = null;

    constructor(controller: any) {
        this.controlador = controller;
        this.form = document.getElementById("formNewPost") as HTMLFormElement | null;
        this.ImagenTem = document.getElementById("imagenDefault") as HTMLElement | null;
        this.inputImagen = document.getElementById("inputImagen") as HTMLElement | null;
        this.modalSeccion = document.getElementById("postModal") as HTMLElement | null;

        if (this.form) {
            this.inputFileInput = (this.form.elements.namedItem("postImagen") as HTMLInputElement)
                || document.getElementById("fileInput") as HTMLInputElement;

            this.inicializarEventos();
        }
        this.form?.addEventListener("submit", async e => {
            e.preventDefault();
            const contenido = (this.form!.elements.namedItem("contenido") as HTMLInputElement)?.value?.trim() || "";
            const file = this.fileObjet();

            if (!contenido && !file) {
                alert("⚠️ Por favor escribe un mensaje o adjunta una imagen para tu publicación.");
                return;
            }

            if (file && file.size > 10 * 1024 * 1024) {
                alert("⚠️ El archivo adjunto no debe superar los 10MB.");
                return;
            }

            const userId = this.controlador?.UsermMController.fk_user;
            if (!userId || userId === "Error") {
                alert("⚠️ Debes tener una sesión activa para poder publicar.");
                return;
            }

            const submitBtn = this.form?.querySelector('button[type="submit"]') as HTMLButtonElement | null;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Publicando...";
            }

            try {
                const date: iPostNew = {
                    fk_user: userId,
                    contenido: contenido,
                    fechaCreacion: new Date().toISOString()
                };
                await this.controlador?.newPost(date, file!);
                this.modalSeccion?.classList.add("hidden");
                this.form?.reset();
                this.limpiarPreview();
                setTimeout(() => {
                    this.controlador?.actualizarPost();
                }, 1000);
            } catch (err) {
                console.error("Error al publicar post:", err);
                alert("❌ No se pudo crear la publicación. Inténtalo de nuevo.");
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Publicar";
                }
            }
        });
    }
    private newPost() {
        const contenido = this.form!.elements.namedItem("contenido") as HTMLInputElement;
        const date: iPostNew = {
            fk_user: this.controlador?.UsermMController.fk_user || "Error",
            contenido: contenido.value || "",
            fechaCreacion: new Date().toISOString()


        }
        const file = this.fileObjet();
        this.controlador?.newPost(date, file!)

    }
    private fileObjet() {
        return this.inputFileInput?.files?.[0];

    }

    private inicializarEventos(): void {
        if (this.inputFileInput) {
            this.inputFileInput.addEventListener("change", () => {
                const file = this.fileObjet()
                if (file) {
                    this.mostrarPreview(file);
                }
            });
        }

        if (this.form) {
            this.form.addEventListener("reset", () => {
                this.limpiarPreview();
            });
        }
    }

    private mostrarPreview(file: File): void {
        if (!this.ImagenTem || !this.inputImagen) return;

        // Liberar URL previa si existía
        if (this.currentObjectUrl) {
            URL.revokeObjectURL(this.currentObjectUrl);
            this.currentObjectUrl = null;
        }

        this.currentObjectUrl = URL.createObjectURL(file);

        // Alternar visibilidad entre el selector y la vista previa
        this.inputImagen.classList.add("hidden");
        this.ImagenTem.classList.remove("hidden");

        // Plantilla fiel al diseño original: Imagen + Botón (X) de cerrar
        this.ImagenTem.innerHTML = `
            <div class="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                <!-- Imagen con altura adaptable para evitar recortes excesivos -->
                <img 
                    src="${this.currentObjectUrl}" 
                    alt="Vista previa" 
                    class="w-full max-h-64 object-cover rounded-xl"
                />

                <!-- Botón de cerrar (X) estilo original -->
                <button 
                    type="button" 
                    id="btnQuitarImagen" 
                    title="Quitar imagen"
                    class="absolute top-2.5 right-2.5 bg-gray-900/70 hover:bg-gray-900 text-white rounded-full p-1.5 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-white cursor-pointer flex items-center justify-center">
                    <i class="ph ph-x text-base"></i>
                </button>
            </div>
        `;

        // Asignar el evento para quitar la imagen
        const btnQuitar = this.ImagenTem.querySelector("#btnQuitarImagen");
        btnQuitar?.addEventListener("click", (e) => {
            e.preventDefault();
            this.limpiarPreview();
        });
    }

    public limpiarPreview(): void {
        if (this.currentObjectUrl) {
            URL.revokeObjectURL(this.currentObjectUrl);
            this.currentObjectUrl = null;
        }

        if (this.inputFileInput) {
            this.inputFileInput.value = "";
        }

        if (this.ImagenTem) {
            this.ImagenTem.innerHTML = "";
            this.ImagenTem.classList.add("hidden");
        }

        if (this.inputImagen) {
            this.inputImagen.classList.remove("hidden");
        }
    }
}
