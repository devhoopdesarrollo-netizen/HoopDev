import Controller from "../controllers/Controller.js";
import { iUsuarioNew } from "../types/types.js";

export default class Cl_vRegisterUser {
    private form: HTMLFormElement | null;
    private registerAlert: HTMLElement | null;
    private registerAlertText: HTMLElement | null;
    private alertIcon: HTMLElement | null;
    public controller: Controller;

    constructor(controller: Controller) {
        this.controller = controller;
        this.form = document.getElementById('registroNewUser') as HTMLFormElement | null;
        this.registerAlert = document.getElementById('register-alert') as HTMLElement | null;
        this.registerAlertText = document.getElementById('register-alert-text') as HTMLElement | null;
        this.alertIcon = this.registerAlert?.querySelector('.alert-icon') as HTMLElement | null;

        if (this.form) {
            this.form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.informacionNewUser();
            });
        }
    }

    private mostrarMensaje(mensaje: string, tipo: 'error' | 'success' | 'warning'): void {
        if (!this.registerAlert || !this.registerAlertText || !this.alertIcon) return;

        this.registerAlertText.textContent = mensaje;
        this.registerAlert.classList.remove("hidden", "bg-red-50", "border-red-200", "text-red-700", "bg-green-50", "border-green-200", "text-green-700", "bg-amber-50", "border-amber-200", "text-amber-700");
        this.alertIcon.className = "alert-icon text-lg shrink-0";

        if (tipo === 'error') {
            this.registerAlert.classList.add("bg-red-50", "border", "border-red-200", "text-red-700");
            this.alertIcon.classList.add("ph", "ph-warning-circle", "text-red-600");
        } else if (tipo === 'success') {
            this.registerAlert.classList.add("bg-green-50", "border", "border-green-200", "text-green-700");
            this.alertIcon.classList.add("ph", "ph-check-circle", "text-green-600");
        } else if (tipo === 'warning') {
            this.registerAlert.classList.add("bg-amber-50", "border", "border-amber-200", "text-amber-700");
            this.alertIcon.classList.add("ph", "ph-info", "text-amber-600");
        }

        // Auto-ocultar después de 8 segundos
        setTimeout(() => {
            this.registerAlert?.classList.add("hidden");
        }, 8000);
    }

    async informacionNewUser(): Promise<void> {
        if (!this.form) return;

        const newUserFormData = new FormData(this.form);
        const nombre = (newUserFormData.get("reg-name") as string || '').trim();
        const password = (newUserFormData.get("reg-Password") as string || '').trim();
        const correo = (newUserFormData.get("reg-correo") as string || '').trim();
        const fechaNacimientoRaw = newUserFormData.get("reg-date") as string;
        const especializacion = (newUserFormData.get("reg-spec") as string || '').trim();
        const pais = (newUserFormData.get("reg-country") as string || '').trim();

        if (!nombre || !password || !correo) {
            this.mostrarMensaje("Por favor completa los campos obligatorios (Nombre, Correo y Contraseña).", "warning");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            this.mostrarMensaje("Por favor ingresa un correo electrónico con formato válido.", "warning");
            return;
        }

        if (password.length < 6) {
            this.mostrarMensaje("La contraseña debe tener al menos 6 caracteres.", "warning");
            return;
        }

        const infUser: iUsuarioNew = {
            nombre: nombre,
            password: password,
            correo_electronico: correo,
            fecha_nacimiento: fechaNacimientoRaw ? new Date(fechaNacimientoRaw) : new Date(),
            especializacion: especializacion,
            pais: pais
        };

        const submitBtn = this.form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Registrando...";
        }

        try {
            const exito = await this.controller.userRegister(infUser);
            if (exito) {
                this.mostrarMensaje("¡Registro exitoso! Tu perfil está en revisión. Un administrador te asignará un programa para habilitar tu acceso.", "success");
                this.form.reset();
            } else {
                this.mostrarMensaje("No se pudo completar el registro. Verifica que el correo no esté ya registrado.", "error");
            }
        } catch (error) {
            console.error("Error al procesar el registro:", error);
            this.mostrarMensaje("Error de conexión al registrar. Inténtalo de nuevo.", "error");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Completar Registro";
            }
        }
    }
}
