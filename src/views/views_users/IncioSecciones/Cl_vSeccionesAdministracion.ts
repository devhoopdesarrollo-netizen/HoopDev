import Controller from "../../../controllers/Controller.js";
import { iTemplateCargo_Programa } from "../../../types/types.js";
import Cl_UtilidadesLogin from "../../../models/Utils/Cl_Utils.js";

export default class Cl_vSeccionesAdministracion {
    public controlador: Controller;

    // Elementos de Usuario
    private formActualizarUsuario: HTMLFormElement | null;
    private selectUsuarioAdmin: HTMLSelectElement | null;
    private inputNombre: HTMLInputElement | null;
    private inputEspecializacion: HTMLInputElement | null;
    private selectPrograma: HTMLSelectElement | null;
    private selectCargo: HTMLSelectElement | null;
    private selectEstatus: HTMLSelectElement | null;
    private inputNuevaPassword: HTMLInputElement | null;
    private btnTogglePasswordAdmin: HTMLButtonElement | null;

    // Elementos de Programas
    private formNuevoPrograma: HTMLFormElement | null;
    private inputNuevoPrograma: HTMLInputElement | null;
    private listaProgramasAdmin: HTMLElement | null;

    // Elementos de Cargos
    private formNuevoCargo: HTMLFormElement | null;
    private inputNuevoCargo: HTMLInputElement | null;
    private listaCargosAdmin: HTMLElement | null;

    // Cache local de datos
    private usuariosCache: any[] = [];

    constructor(controller: Controller) {
        this.controlador = controller;

        this.formActualizarUsuario = document.getElementById("formActualizarUsuario") as HTMLFormElement | null;
        this.selectUsuarioAdmin = document.getElementById("selectUsuarioAdmin") as HTMLSelectElement | null;
        this.inputNombre = document.getElementById("nombre") as HTMLInputElement | null;
        this.inputEspecializacion = document.getElementById("especializacion") as HTMLInputElement | null;
        this.selectPrograma = document.getElementById("programa") as HTMLSelectElement | null;
        this.selectCargo = document.getElementById("cargo") as HTMLSelectElement | null;
        this.selectEstatus = document.getElementById("estatus") as HTMLSelectElement | null;
        this.inputNuevaPassword = document.getElementById("nuevaPassword") as HTMLInputElement | null;
        this.btnTogglePasswordAdmin = document.getElementById("btnTogglePasswordAdmin") as HTMLButtonElement | null;

        this.formNuevoPrograma = document.getElementById("formNuevoPrograma") as HTMLFormElement | null;
        this.inputNuevoPrograma = document.getElementById("inputNuevoPrograma") as HTMLInputElement | null;
        this.listaProgramasAdmin = document.getElementById("listaProgramasAdmin") as HTMLElement | null;

        this.formNuevoCargo = document.getElementById("formNuevoCargo") as HTMLFormElement | null;
        this.inputNuevoCargo = document.getElementById("inputNuevoCargo") as HTMLInputElement | null;
        this.listaCargosAdmin = document.getElementById("listaCargosAdmin") as HTMLElement | null;

        // Si no estamos en la página de administración, salir de manera segura
        if (!this.formActualizarUsuario && !this.formNuevoPrograma && !this.formNuevoCargo) {
            return;
        }

        this.inicializar();
    }

    private async inicializar(): Promise<void> {
        await Promise.all([
            this.cargarProgramas(),
            this.cargarCargos(),
            this.cargarUsuarios()
        ]);

        this.asignarEventos();
    }

    private asignarEventos(): void {
        // Evento cambio de usuario seleccionado
        if (this.selectUsuarioAdmin) {
            this.selectUsuarioAdmin.addEventListener("change", () => {
                const userId = this.selectUsuarioAdmin?.value;
                if (userId) {
                    this.seleccionarUsuario(userId);
                }
            });
        }

        // Evento actualizar usuario
        if (this.formActualizarUsuario) {
            this.formActualizarUsuario.addEventListener("submit", async (e) => {
                e.preventDefault();
                await this.actualizarUsuario();
            });
        }

        // Evento toggle visibilidad de contraseña
        if (this.btnTogglePasswordAdmin && this.inputNuevaPassword) {
            this.btnTogglePasswordAdmin.addEventListener("click", () => {
                const isPassword = this.inputNuevaPassword!.type === "password";
                this.inputNuevaPassword!.type = isPassword ? "text" : "password";
                const icon = this.btnTogglePasswordAdmin!.querySelector("i");
                if (icon) {
                    icon.className = isPassword ? "ph ph-eye-slash text-base text-blue-600" : "ph ph-eye text-base";
                }
            });
        }

        // Evento nuevo programa
        if (this.formNuevoPrograma) {
            this.formNuevoPrograma.addEventListener("submit", async (e) => {
                e.preventDefault();
                await this.crearPrograma();
            });
        }

        // Evento nuevo cargo
        if (this.formNuevoCargo) {
            this.formNuevoCargo.addEventListener("submit", async (e) => {
                e.preventDefault();
                await this.crearCargo();
            });
        }
    }

    // ==========================================
    // PROGRAMAS
    // ==========================================

    public async cargarProgramas(): Promise<void> {
        try {
            const programas = await this.controlador.cargarProgramas();

            // Llenar selector del formulario de usuario
            if (this.selectPrograma) {
                const valorActual = this.selectPrograma.value;
                this.selectPrograma.innerHTML = `<option value="" disabled ${!valorActual ? "selected" : ""}>Seleccione un programa</option>`;
                programas.forEach((prog: any) => {
                    const id = prog.id_programa || prog.id_programas || prog.id;
                    const nombre = prog.nombre;
                    this.selectPrograma!.innerHTML += `<option value="${id}">${nombre}</option>`;
                });
                if (valorActual) this.selectPrograma.value = valorActual;
            }

            // Llenar lista administrativa de programas con botón de borrado
            if (this.listaProgramasAdmin) {
                this.listaProgramasAdmin.innerHTML = "";

                if (!programas || programas.length === 0) {
                    this.listaProgramasAdmin.innerHTML = `<div class="px-3.5 py-3 text-center text-xs text-gray-500">No hay programas registrados.</div>`;
                    return;
                }

                programas.forEach((prog: any) => {
                    const id = prog.id_programa || prog.id_programas || prog.id;
                    const nombre = prog.nombre;

                    const item = document.createElement("div");
                    item.className = "flex items-center justify-between px-3.5 py-2.5 text-sm text-gray-700 hover:bg-white transition-colors";
                    item.innerHTML = `
                        <div class="flex items-center space-x-2.5">
                            <div class="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span class="font-medium text-xs sm:text-sm">${nombre}</span>
                        </div>
                        <button type="button" data-id="${id}" class="btn-eliminar-prog h-7 w-7 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-all cursor-pointer" title="Eliminar">
                            <i class="ph ph-trash text-sm"></i>
                        </button>
                    `;
                    this.listaProgramasAdmin!.appendChild(item);
                });

                // Asignar eventos de eliminación
                this.listaProgramasAdmin.querySelectorAll(".btn-eliminar-prog").forEach((btn) => {
                    btn.addEventListener("click", async (e) => {
                        const target = e.currentTarget as HTMLElement;
                        const id = target.getAttribute("data-id");
                        if (!id || id === "undefined" || id === "null") {
                            alert("⚠️ Error: No se pudo identificar el ID del programa a eliminar.");
                            return;
                        }
                        if (confirm("¿Estás seguro de eliminar este programa?")) {
                            const exito = await this.controlador.deletePrograma(id);
                            if (exito) {
                                await this.cargarProgramas();
                            } else {
                                alert("❌ No se pudo eliminar el programa. Revisa la consola o permisos.");
                            }
                        }
                    });
                });
            }
        } catch (error) {
            console.error("Error al cargar programas en vista:", error);
        }
    }

    private async crearPrograma(): Promise<void> {
        if (!this.inputNuevoPrograma) return;
        const nombre = this.inputNuevoPrograma.value.trim();
        if (!nombre) return;

        const data: iTemplateCargo_Programa = { nombre };
        const submitBtn = this.formNuevoPrograma?.querySelector('button[type="submit"]') as HTMLButtonElement | null;
        if (submitBtn) submitBtn.disabled = true;

        try {
            await this.controlador.crearPrograma(data);
            this.inputNuevoPrograma.value = "";
            await this.cargarProgramas();
        } catch (error) {
            console.error("Error al registrar programa:", error);
            alert("❌ Ocurrió un error al registrar el programa.");
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    }

    // ==========================================
    // CARGOS
    // ==========================================

    public async cargarCargos(): Promise<void> {
        try {
            const cargos = await this.controlador.cargarCargos();

            // Llenar selector del formulario de usuario
            if (this.selectCargo) {
                const valorActual = this.selectCargo.value;
                this.selectCargo.innerHTML = `<option value="" disabled ${!valorActual ? "selected" : ""}>Seleccione un cargo</option>`;
                cargos.forEach((c: any) => {
                    const id = c.id_cargo || c.id;
                    const nombre = c.nombre;
                    this.selectCargo!.innerHTML += `<option value="${id}">${nombre}</option>`;
                });
                if (valorActual) this.selectCargo.value = valorActual;
            }

            // Llenar lista administrativa de cargos con botón de borrado
            if (this.listaCargosAdmin) {
                this.listaCargosAdmin.innerHTML = "";

                if (!cargos || cargos.length === 0) {
                    this.listaCargosAdmin.innerHTML = `<div class="px-3.5 py-3 text-center text-xs text-gray-500">No hay cargos registrados.</div>`;
                    return;
                }

                cargos.forEach((c: any) => {
                    const id = c.id_cargo || c.id_cargos || c.id;
                    const nombre = c.nombre;

                    const item = document.createElement("div");
                    item.className = "flex items-center justify-between px-3.5 py-2.5 text-sm text-gray-700 hover:bg-white transition-colors";
                    item.innerHTML = `
                        <div class="flex items-center space-x-2.5">
                            <div class="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span class="font-medium text-xs sm:text-sm">${nombre}</span>
                        </div>
                        <button type="button" data-id="${id}" class="btn-eliminar-cargo h-7 w-7 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-all cursor-pointer" title="Eliminar">
                            <i class="ph ph-trash text-sm"></i>
                        </button>
                    `;
                    this.listaCargosAdmin!.appendChild(item);
                });

                // Asignar eventos de eliminación
                this.listaCargosAdmin.querySelectorAll(".btn-eliminar-cargo").forEach((btn) => {
                    btn.addEventListener("click", async (e) => {
                        const target = e.currentTarget as HTMLElement;
                        const id = target.getAttribute("data-id");
                        if (!id || id === "undefined" || id === "null") {
                            alert("⚠️ Error: No se pudo identificar el ID del cargo a eliminar.");
                            return;
                        }
                        if (confirm("¿Estás seguro de eliminar este cargo?")) {
                            const exito = await this.controlador.deleteCargo(id);
                            if (exito) {
                                await this.cargarCargos();
                            } else {
                                alert("❌ No se pudo eliminar el cargo. Revisa la consola o permisos.");
                            }
                        }
                    });
                });
            }
        } catch (error) {
            console.error("Error al cargar cargos en vista:", error);
        }
    }

    private async crearCargo(): Promise<void> {
        if (!this.inputNuevoCargo) return;
        const nombre = this.inputNuevoCargo.value.trim();
        if (!nombre) return;

        const data: iTemplateCargo_Programa = { nombre };
        const submitBtn = this.formNuevoCargo?.querySelector('button[type="submit"]') as HTMLButtonElement | null;
        if (submitBtn) submitBtn.disabled = true;

        try {
            await this.controlador.crearCargo(data);
            this.inputNuevoCargo.value = "";
            await this.cargarCargos();
        } catch (error) {
            console.error("Error al registrar cargo:", error);
            alert("❌ Ocurrió un error al registrar el cargo.");
        } finally {
            if (submitBtn) submitBtn.disabled = false;
        }
    }

    // ==========================================
    // USUARIOS
    // ==========================================

    public async cargarUsuarios(): Promise<void> {
        try {
            this.usuariosCache = await this.controlador.cargarUsuariosControl();

            if (this.selectUsuarioAdmin) {
                this.selectUsuarioAdmin.innerHTML = `<option value="" disabled selected>-- Seleccione un usuario registrado (${this.usuariosCache.length}) --</option>`;
                this.usuariosCache.forEach((u: any) => {
                    const id = u.id_user;
                    const nombre = u.nombre || "Sin nombre";
                    const correo = u.correo_electronico ? `(${u.correo_electronico})` : "";
                    this.selectUsuarioAdmin!.innerHTML += `<option value="${id}">${nombre} ${correo}</option>`;
                });
            }
        } catch (error) {
            console.error("Error al cargar usuarios en vista:", error);
        }
    }

    private seleccionarUsuario(idUser: string): void {
        const usuario = this.usuariosCache.find((u: any) => u.id_user === idUser);
        if (!usuario) return;

        if (this.inputNombre) {
            this.inputNombre.value = usuario.nombre || "";
        }
        if (this.inputEspecializacion) {
            this.inputEspecializacion.value = usuario.especializacion || "";
        }
        if (this.selectPrograma && usuario.fk_programas) {
            this.selectPrograma.value = usuario.fk_programas;
        }
        if (this.selectCargo && usuario.fk_cargo) {
            this.selectCargo.value = usuario.fk_cargo;
        }
        if (this.inputNuevaPassword) {
            this.inputNuevaPassword.value = "";
        }
        if (this.selectEstatus) {
            const isActivo = usuario.estatus === true || usuario.estatus === "activo" || usuario.estatus === "true" || usuario.estatus === 1;
            this.selectEstatus.value = isActivo ? "activo" : "inactivo";
        }
    }

    private async actualizarUsuario(): Promise<void> {
        const userId = this.selectUsuarioAdmin?.value;
        if (!userId) {
            alert("⚠️ Por favor selecciona primero un usuario para modificar sus datos.");
            return;
        }

        const nombre = this.inputNombre?.value.trim() || "";
        const especializacion = this.inputEspecializacion?.value.trim() || "";
        const fk_programas = this.selectPrograma?.value || undefined;
        const fk_cargo = this.selectCargo?.value || undefined;
        const estatusVal = this.selectEstatus?.value;
        
        // El estatus debe ser True o False (Activo / Inactivo)
        const estatus: boolean = (estatusVal === "activo" || estatusVal === "true");

        if (!nombre) {
            alert("⚠️ El nombre de usuario no puede estar vacío.");
            return;
        }

        const datosActualizar: any = {
            nombre,
            especializacion,
            estatus
        };
        if (fk_programas) datosActualizar.fk_programas = fk_programas;
        if (fk_cargo) datosActualizar.fk_cargo = fk_cargo;

        // Si se especificó una nueva contraseña, validarla y cifrarla con bcrypt
        const nuevaPassword = this.inputNuevaPassword?.value.trim() || "";
        if (nuevaPassword) {
            if (nuevaPassword.length < 6) {
                alert("⚠️ La nueva contraseña debe tener al menos 6 caracteres.");
                return;
            }
            try {
                const hashedPassword = await Cl_UtilidadesLogin.cifrarPassword(nuevaPassword);
                datosActualizar.password = hashedPassword;
            } catch (err) {
                console.error("Error cifrando contraseña:", err);
                alert("❌ Error al procesar la nueva contraseña.");
                return;
            }
        }

        const submitBtn = this.formActualizarUsuario?.querySelector('button[type="submit"]') as HTMLButtonElement | null;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <i class="ph ph-spinner animate-spin text-base"></i>
                <span>Actualizando...</span>
            `;
        }

        try {
            const resp = await this.controlador.actualizarUsuario(userId, datosActualizar);
            if (resp && resp.exito) {
                alert(`✅ ¡Datos del usuario actualizados exitosamente!${nuevaPassword ? " (Contraseña modificada)" : ""}`);
                if (this.inputNuevaPassword) this.inputNuevaPassword.value = "";
                await this.cargarUsuarios();
                if (this.selectUsuarioAdmin) {
                    this.selectUsuarioAdmin.value = userId;
                    this.seleccionarUsuario(userId);
                }
            } else {
                if (resp?.error?.code === '42501') {
                    alert("❌ Error 42501 (Permiso denegado por PostgreSQL):\n\nLa base de datos Supabase tiene bloqueado el UPDATE en la tabla 'User'.\n\nDebes ejecutar en Supabase SQL Editor:\n\nGRANT UPDATE, SELECT ON public.\"User\" TO authenticated, anon;\n\nCREATE POLICY \"Permitir update a authenticated\" ON public.\"User\" FOR UPDATE TO authenticated USING (true) WITH CHECK (true);");
                } else {
                    const mensaje = resp?.error?.message || "Revisa la consola para más detalles.";
                    alert(`❌ No se pudieron actualizar los datos del usuario: ${mensaje}`);
                }
            }
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            alert("❌ Ocurrió un error inesperado al actualizar el usuario.");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <i class="ph ph-check-circle text-base"></i>
                    <span>Actualizar Datos</span>
                `;
            }
        }
    }
}
