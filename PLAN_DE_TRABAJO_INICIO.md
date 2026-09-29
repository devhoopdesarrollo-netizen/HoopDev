# 🏀 Plan de Trabajo y Guía Técnica: Conexión de JS/TS a `inicio.html`

> **Proyecto:** HoopPeru WEB  
> **Objetivo:** Integrar la lógica TypeScript/JavaScript, gestión de sesiones seguras con Supabase, control de modales interactivos y renderizado dinámico del feed en la página de inicio.  
> **Metodología:** Aprendizaje activo — comprender la arquitectura, razonar el flujo de datos y transcribir el código manualmente.

---

## 📊 1. Diagnóstico del Proyecto y Resumen de Avance

### 🏗️ Arquitectura Actual
El proyecto implementa un patrón **MVC (Modelo-Vista-Controlador)** desacoplado con servicios modulares:
* **Modelos (`src/models/`):** Clases TypeScript que encapsulan datos (`Cl_mNewUser`, `Cl_Post`), validan tipos y formatean objetos para la base de datos con `.toJSON()`.
* **Vistas (`src/views/`):** Clases encargadas exclusivamente de capturar eventos del DOM (`submit`, `click`, `change`), leer datos de formularios y delegar acciones al controlador.
* **Controlador (`src/controllers/Controller.ts`):** Actúa como mediador central entre las vistas y los servicios de negocio/modelos.
* **Módulos de Servicio (`src/modules/`):** Clases dedicadas a la comunicación con la API de Supabase (`UserLogin`, `userRegistro`, `Post_new`, `StorageImagenes`).
* **Seguridad y Utilidades (`src/models/Utils/Cl_Utils.ts`):** Hashing de contraseñas con `bcryptjs` y generación/verificación de tokens de sesión con `jose` (JWT).
* **Compilación (`build.js`):** Empaquetador `esbuild` de alto rendimiento con inyección de variables de entorno (`SUPABASE_URL`, `SUPABASE_KEY`).

### 🌟 Evaluación de Diseño y Escalabilidad
* **Diseño UI/UX (9/10):** La maquetación de `ventanas/inicio.html` con Tailwind CSS y Phosphor Icons es limpia, moderna y completamente responsiva.
* **Escalabilidad (8.5/10):** El código es altamente escalable gracias a la modularización y al tipado estricto en `src/types/types.ts`. Para producción, el siguiente paso evolutivo será mover la verificación criptográfica a Supabase Edge Functions / Auth nativo, pero el esquema actual es ideal para dominar el ciclo de vida de JWT y autenticación en TypeScript.

---

## 🛠️ 2. Guía Paso a Paso para la Jornada de Desarrollo

```
                    FLUJO GENERAL DE EJECUCIÓN
┌─────────────────────────────────────────────────────────────────┐
│ 1. Index.html (Login exitoso)                                   │
│    └─► Almacena Token + User en LocalStorage                    │
│    └─► Redirige a ventanas/inicio.html                          │
├─────────────────────────────────────────────────────────────────┤
│ 2. inicio.html (Carga dist/bundle.js)                           │
│    ├─► Cl_vUserInicio: Valida token en LocalStorage             │
│    │   ├─ Token Inválido ──► Redirige a Index.html              │
│    │   └─ Token Válido   ──► Pinta datos del usuario en Header  │
│    ├─► Cl_vPostNewModal: Controla apertura, preview y submit    │
│    └─► Post_Feed: Consulta y renderiza las publicaciones        │
└─────────────────────────────────────────────────────────────────┘
```

---

### 📌 BLOQUE 1: Vinculación del Bundle y Protección de DOM

#### 🧠 Concepto Clave
Como `dist/bundle.js` se ejecuta en varias páginas HTML (`Index.html`, `inicio.html`), si un script busca un elemento que solo existe en la otra página sin comprobar si es `null`, la aplicación fallará con un `Uncaught TypeError`.

#### 📝 Tareas a Realizar:

1. **Enlazar el bundle en `ventanas/inicio.html`:**
   Al final del archivo, justo antes de `</body>`, agrega:
   ```html
   <!-- Script de la aplicación empaquetada -->
   <script src="../dist/bundle.js"></script>
   ```

2. **Blindar constructores de vistas existentes contra elementos nulos:**
   En `src/views/CL_vLoginUser.ts`:
   ```typescript
   this.formUserLogin = document.getElementById("formLogin") as HTMLFormElement | null;
   if (this.formUserLogin) {
       this.formUserLogin.addEventListener("submit", async (e) => {
           e.preventDefault();
           this.LoginUser();
       });
   }
   ```

   En `src/views/Cl_vRegisterUser.ts`:
   ```typescript
   this.formNewUser = document.getElementById("registroNewUser") as HTMLFormElement | null;
   if (this.formNewUser) {
       this.formNewUser.addEventListener("submit", async (e) => {
           e.preventDefault();
           this.readDates();
       });
   }
   ```

---

### 📌 BLOQUE 2: Persistencia de Sesión y Control de Acceso

#### 🧠 Concepto Clave
El inicio de sesión debe guardar las credenciales activas en el almacenamiento local del navegador (`localStorage`) para que `inicio.html` sepa quién es el usuario conectado y evite accesos no autorizados.

#### 📝 Tareas a Realizar:

1. **Guardar sesión en `src/modules/User_Moduls/UserLogin.ts`:**
   Dentro del método `inicioSeccion`:
   ```typescript
   if (usuario.estatus === true) {
       // Guardar token y datos del usuario en localStorage
       localStorage.setItem("user_token", tokenID);
       localStorage.setItem("user_session", JSON.stringify({
           id_user: usuario.id_user,
           nombre: usuario.nombre,
           correo: usuario.correo_electronico,
           cargo: usuario.cargo
       }));

       this.directory.direccionCargo(usuario.cargo);
   }
   ```

2. **Validar sesión en `src/views/views_users/Cl_vUserInicio.ts`:**
   ```typescript
   import Controller from "../../controllers/Controller.js";
   import Cl_PostNewModal from "./PostModal/Cl_vPostNewModal.js";
   import Cl_UtilidadesLogin from "../../models/Utils/Cl_Utils.js";

   export default class Cl_vUserInicio {
       private VpostModal: Cl_PostNewModal;
       private controlador: Controller;

       constructor(controller: Controller) {
           this.controlador = controller;
           this.VpostModal = new Cl_PostNewModal(this.controlador);

           // Solo ejecutar si estamos en la ventana de inicio
           if (document.getElementById("feed-container") || document.getElementById("formNewPost")) {
               this.verificarSesion();
           }
       }

       private async verificarSesion(): Promise<void> {
           const token = localStorage.getItem("user_token");
           const sessionData = localStorage.getItem("user_session");

           if (!token || !sessionData) {
               window.location.href = "../Index.html";
               return;
           }

           try {
               await Cl_UtilidadesLogin.verificToken(token);
               const usuario = JSON.parse(sessionData);
               this.actualizarHeaderUsuario(usuario.nombre);
           } catch (error) {
               console.error("Sesión inválida o expirada:", error);
               localStorage.clear();
               window.location.href = "../Index.html";
           }
       }

       private actualizarHeaderUsuario(nombre: string): void {
           const spanNombre = document.getElementById("header-user-name");
           if (spanNombre) {
               spanNombre.textContent = nombre;
           }
       }
   }
   ```

---

### 📌 BLOQUE 3: Modal de Publicación y Previsualización Multimedia

#### 🧠 Concepto Clave
El usuario necesita abrir el modal, escribir contenido, seleccionar una imagen, ver la previsualización inmediata (usando la API nativa `FileReader`) y cancelar o confirmar la publicación.

#### 📝 Tareas a Realizar en `src/views/views_users/PostModal/Cl_vPostNewModal.ts`:

```typescript
import Controller from "../../../controllers/Controller.js";
import { iPostNew } from "../../../types/types.js";

export default class Cl_PostNewModal {
    private form: HTMLFormElement | null;
    private modalContenedor: HTMLElement | null;
    private btnAbrirModal: HTMLElement | null;
    private btnCerrarModal: HTMLElement | null;
    private inputImagen: HTMLInputElement | null;
    private previewImagen: HTMLImageElement | null;
    public controlador: Controller;

    constructor(controller: Controller) {
        this.controlador = controller;
        this.form = document.getElementById("formNewPost") as HTMLFormElement | null;
        this.modalContenedor = document.getElementById("modalNewPost") as HTMLElement | null;
        this.btnAbrirModal = document.getElementById("btnOpenNewPost") as HTMLElement | null;
        this.btnCerrarModal = document.getElementById("btnCloseNewPost") as HTMLElement | null;
        this.inputImagen = document.getElementById("inputPostImage") as HTMLInputElement | null;
        this.previewImagen = document.getElementById("previewPostImage") as HTMLImageElement | null;

        this.registrarEventos();
    }

    private registrarEventos(): void {
        if (!this.form) return;

        // Abrir y Cerrar Modal
        this.btnAbrirModal?.addEventListener("click", () => this.alternarModal(true));
        this.btnCerrarModal?.addEventListener("click", () => this.alternarModal(false));

        // Previsualización de imagen al seleccionarla
        this.inputImagen?.addEventListener("change", () => this.manejarPreviewImagen());

        // Envío del Formulario
        this.form.addEventListener("submit", (e) => this.manejarSubmit(e));
    }

    private alternarModal(abrir: boolean): void {
        if (!this.modalContenedor) return;
        if (abrir) {
            this.modalContenedor.classList.remove("hidden");
        } else {
            this.modalContenedor.classList.add("hidden");
            this.form?.reset();
            if (this.previewImagen) {
                this.previewImagen.src = "";
                this.previewImagen.classList.add("hidden");
            }
        }
    }

    private manejarPreviewImagen(): void {
        const file = this.inputImagen?.files?.[0];
        if (!file || !this.previewImagen) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result && this.previewImagen) {
                this.previewImagen.src = e.target.result as string;
                this.previewImagen.classList.remove("hidden");
            }
        };
        reader.readAsDataURL(file);
    }

    private async manejarSubmit(e: Event): Promise<void> {
        e.preventDefault();
        if (!this.form) return;

        const sessionData = localStorage.getItem("user_session");
        if (!sessionData) {
            alert("No hay sesión activa.");
            return;
        }

        const usuario = JSON.parse(sessionData);
        const formData = new FormData(this.form);
        const contenido = (formData.get("post_contenido") as string) || "";
        const file = this.inputImagen?.files?.[0];

        if (!contenido.trim() && !file) {
            alert("Escribe un mensaje o selecciona una imagen.");
            return;
        }

        const postDatos: iPostNew = {
            fk_user: usuario.id_user,
            contenido: contenido
        };

        const exito = await this.controlador.crearPublicacion(postDatos, file);
        if (exito) {
            this.alternarModal(false);
            alert("¡Publicación realizada con éxito!");
            // Disparar recarga del feed
        } else {
            alert("Ocurrió un error al publicar.");
        }
    }
}
```

---

### 📌 BLOQUE 4: Conexión en `Controller.ts` y Módulo `Post_new.ts`

#### 🧠 Concepto Clave
El controlador recibe los datos desde la vista y delega la subida de la imagen y la creación del registro a `Post_new.ts`.

#### 📝 Tareas a Realizar:

1. **Actualizar `src/controllers/Controller.ts`:**
   ```typescript
   import Post_New from "../modules/Post_Moduls/Post_new.js";
   import { iPostNew } from "../types/types.js";

   // Dentro de la clase Controller:
   async crearPublicacion(datos: iPostNew, archivo?: File): Promise<boolean> {
       try {
           const postModulo = new Post_New();
           const resultado = await postModulo.crearPostNew(datos, archivo);
           return resultado !== null;
       } catch (error) {
           console.error("Error en Controller al crear post:", error);
           return false;
       }
   }
   ```

2. **Ajustar `src/modules/Post_Moduls/Post_new.ts` para soportar posts sin imagen obligatoria:**
   ```typescript
   async crearPostNew(datos: iPostNew, file?: File): Promise<any> {
       try {
           let imgDireccion: string | null = null;
           if (file) {
               imgDireccion = await this.storage_Storage.uploadPostImagen(file);
           }

           const { data, error } = await this.supabaseCliente.client
               .from("Post")
               .insert([
                   {
                       fK_User: datos.fk_user,
                       img_direccion: imgDireccion,
                       contenido: datos.contenido,
                   }
               ])
               .select();

           if (error) throw error;
           return data;
       } catch (error) {
           console.error("Error en Post_New:", error);
           throw error;
       }
   }
   ```

---

### 📌 BLOQUE 5: Carga y Renderizado Dinámico del Feed

#### 🧠 Concepto Clave
Reemplazar el contenido estático del feed por tarjetas generadas a partir de la tabla `Post` de Supabase.

#### 📝 Tareas a Realizar:

1. **Crear el módulo `src/modules/Post_Moduls/Post_feed.ts`:**
   ```typescript
   import supabase from "../../config/supabase.js";

   export default class Post_Feed {
       private supabaseCliente: supabase;

       constructor() {
           this.supabaseCliente = new supabase();
       }

       async obtenerPosts(): Promise<any[]> {
           try {
               const { data, error } = await this.supabaseCliente.client
                   .from("Post")
                   .select("id_post, fK_User, img_direccion, contenido, fecha_creacion, User(nombre)")
                   .order("fecha_creacion", { ascending: false });

               if (error) throw error;
               return data || [];
           } catch (error) {
               console.error("Error al obtener feed:", error);
               return [];
           }
       }
   }
   ```

2. **Generar la plantilla HTML de cada Post en `src/views/views_users/Cl_vUserInicio.ts`:**
   ```typescript
   renderizarFeed(posts: any[]): void {
       const feedContainer = document.getElementById("feed-container");
       if (!feedContainer) return;

       if (posts.length === 0) {
           feedContainer.innerHTML = `<p class="text-center text-gray-500 py-8">No hay publicaciones aún. ¡Sé el primero en compartir algo!</p>`;
           return;
       }

       feedContainer.innerHTML = posts.map(post => `
           <article class="bg-white rounded-xl shadow-xs border border-gray-200 p-5 space-y-4">
               <div class="flex items-center space-x-3">
                   <div class="h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                       ${post.User?.nombre?.charAt(0).toUpperCase() || "U"}
                   </div>
                   <div>
                       <h4 class="font-semibold text-gray-900 text-sm">${post.User?.nombre || "Usuario"}</h4>
                       <p class="text-xs text-gray-400">${new Date(post.fecha_creacion).toLocaleString()}</p>
                   </div>
               </div>

               <p class="text-gray-700 text-sm leading-relaxed">${post.contenido || ""}</p>

               ${post.img_direccion ? `
                   <div class="rounded-lg overflow-hidden border border-gray-100 max-h-96">
                       <img src="${post.img_direccion}" alt="Publicación" class="w-full h-full object-cover">
                   </div>
               ` : ""}
           </article>
       `).join("");
   }
   ```

---

## 🎯 Lista de Verificación para Mañana

- [ ] ¿Compila correctamente con `npm run dev` sin errores en consola?
- [ ] ¿Iniciar sesión guarda el token en `localStorage` y redirige a `inicio.html`?
- [ ] ¿Si abres `inicio.html` sin haber iniciado sesión te redirige a `Index.html`?
- [ ] ¿Al seleccionar una imagen en el modal se muestra la previsualización?
- [ ] ¿Al enviar el formulario se sube la imagen al bucket `Multimedia` y se crea la fila en la tabla `Post`?
- [ ] ¿El feed muestra los posts reales ordenados cronológicamente?
