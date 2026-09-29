import Controller from "../controllers/Controller.js";
import { iUsuarioNew } from "../types/types.js";

export default class Cl_vRegisterUser {
    private form: HTMLFormElement | null;
    public controller: Controller;

    constructor(controller: Controller) {
        this.controller = controller;
        this.form = document.getElementById('registroNewUser') as HTMLFormElement | null;

        if (this.form) {
            this.form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.informacionNewUser();
            });
        }
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
            alert("Por favor completa los campos obligatorios (Nombre, Correo y Contraseña).");
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
                alert("✅ ¡Usuario registrado exitosamente en HoopPeru!");
                this.form.reset();
            } else {
                alert("❌ Hubo un error al registrar el usuario. Revisa la consola o las credenciales.");
            }
        } catch (error) {
            console.error("Error al procesar el registro:", error);
            alert("❌ Ocurrió un error inesperado al registrar el usuario.");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Completar Registro";
            }
        }
    }
}
