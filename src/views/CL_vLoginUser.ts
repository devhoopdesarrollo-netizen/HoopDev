import Controller from "../controllers/Controller.js";
import { iLoginDTO } from "../types/types.js";

export default class Cl_vLogingUser {
    private formUserLogin: HTMLFormElement | null;
    private loginAlert: HTMLElement | null;
    private loginAlertText: HTMLElement | null;
    public controller: Controller;

    constructor(Controller: Controller) {
        this.controller = Controller;
        this.formUserLogin = document.getElementById("formLogin") as HTMLFormElement | null;
        this.loginAlert = document.getElementById("login-alert") as HTMLElement | null;
        this.loginAlertText = document.getElementById("login-alert-text") as HTMLElement | null;

        if (this.formUserLogin) {
            this.formUserLogin.addEventListener("submit", async (e) => {
                e.preventDefault();
                await this.LoginUser();
            });
        }
    }

    private mostrarError(mensaje: string): void {
        if (this.loginAlert && this.loginAlertText) {
            this.loginAlertText.textContent = mensaje;
            this.loginAlert.classList.remove("hidden");
            // Auto-ocultar después de 8 segundos
            setTimeout(() => {
                this.loginAlert?.classList.add("hidden");
            }, 8000);
        }
    }

    private ocultarError(): void {
        this.loginAlert?.classList.add("hidden");
    }

    async LoginUser() {
        if (!this.formUserLogin) return;

        this.ocultarError();

        const formDat = new FormData(this.formUserLogin);
        const correo = (formDat.get("login-user") as string || "").trim();
        const password = (formDat.get("login-pass") as string || "").trim();

        if (!correo || !password) {
            this.mostrarError("Por favor ingresa tu correo y contraseña.");
            return;
        }

        const data: iLoginDTO = {
            correo_electronico: correo,
            password: password,
        };

        // Deshabilitar botón durante el login
        const submitBtn = this.formUserLogin.querySelector('button[type="submit"]') as HTMLButtonElement | null;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Verificando...</span>`;
        }

        try {
            const resultado = await this.controller.UserLong(data);

            if (resultado && !resultado.exito) {
                this.mostrarError(resultado.mensaje || "Error al iniciar sesión.");
            }
            // Si exito === true, UserLogin.ts ya redirige con directory.direccionCargo()
        } catch (error: any) {
            console.error("Error inesperado en login:", error);
            this.mostrarError("Error de conexión. Verifica tu internet e inténtalo de nuevo.");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span>Iniciar sesión</span>`;
            }
        }
    }
}