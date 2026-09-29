# 🏀 HoopPeru WEB - Documentación de Arquitectura y Estructura del Proyecto

Este documento explica la organización del proyecto, la arquitectura **MVC (Modelo - Vista - Controlador)** orientada a objetos en **TypeScript puro**, el funcionamiento del empaquetador (**esbuild**) y la guía para agregar nuevos módulos sin necesidad de IA.

---

## 📁 1. Árbol de Estructura de Carpetas

```text
HoopPeru WEB/
│
├── .env                      # Variables de entorno privadas (NO se sube a Git)
├── .env.example              # Plantilla pública de variables de entorno
├── .gitignore                # Reglas de exclusión para Git (ignora .env, node_modules, dist)
├── build.js                  # Script del Bundler (esbuild) que compila y empaqueta el proyecto
├── package.json              # Dependencias y scripts de ejecución (build, dev, type-check)
├── tsconfig.json             # Configuración del compilador de TypeScript
│
├── Index.html                # Interfaz de Login y Registro de usuarios
├── inicio.html               # Vista principal de la aplicación (Home / Dashboard)
├── userInfo.html             # Vista de detalles y perfil del usuario
│
├── resources/                # Recursos multimedia estáticos (imágenes, logos, iconos)
│   └── navbar-logo.webp
│
├── dist/                     # Código final generado automáticamente por el Bundler
│   └── bundle.js             # Archivo JS único y optimizado que carga el HTML
│
└── src/                      # CÓDIGO FUENTE (TypeScript)
    │
    ├── index.ts              # Punto de entrada principal de la aplicación
    │
    ├── config/               # Configuraciones y clientes externos
    │   └── supabase.ts       # Inicialización del cliente Supabase con credenciales seguras
    │
    ├── controllers/          # Controladores (Coordinan la vista y el modelo)
    │   └── Controller.ts     # Controlador general de la aplicación
    │
    ├── models/               # Modelos de dominio y lógica de negocio
    │   └── UserModules/
    │       ├── Cl_mNewUser.ts          # Entidad de usuario (getters, setters, validaciones)
    │       └── Cl_mMUserController.ts  # Administrador de acciones del modelo de usuario
    │
    ├── modules/ (o services/)# Servicios de comunicación con bases de datos o APIs
    │   └── userRegistro.ts   # Consultas e inserciones a la tabla de Supabase
    │
    ├── types/                # Definiciones de tipos e interfaces TypeScript
    │   └── types.ts          # Contratos de datos (ej. iUsuarioNew)
    │
    └── views/                # Capa de presentación y manipulación del DOM
        └── Cl_vRegisterUser.ts # Escucha eventos de la interfaz y muestra mensajes
```

---

## 🏛️ 2. Explicación de Cada Carpeta y su Responsabilidad

### `src/types/` (Tipos e Interfaces)
* **Objetivo:** Definir la forma exacta de los datos que viajan por el sistema.
* **Regla:** No contiene lógica ni cálculos, únicamente interfaces TypeScript (`interface`, `type`).
* **Ejemplo:** [`iUsuarioNew`](file:///c:/Users/DuvalP/OneDrive/Desktop/HoopPeru%20WEB/src/types/types.ts) define qué campos obligatorios tiene un usuario antes de ser guardado.

### `src/config/` (Configuración de Servicios)
* **Objetivo:** Instanciar librerías de terceros (Supabase, Firebase, APIs externas).
* **Regla:** No debe contener credenciales quemadas en texto plano. Las variables se leen de `process.env` inyectadas por el bundler.

### `src/models/` (Modelos y Lógica de Negocio)
* **Objetivo:** Representar las entidades del mundo real (Usuarios, Torneos, Partidos, Equipos).
* **Cl_mNewUser.ts:** Aplica encapsulamiento (atributos privados `_Nombre`, `_Password`), valida datos y sanitiza texto (`.trim().toLowerCase()`).
* **Cl_mMUserController.ts:** Coordina las acciones del modelo con el módulo de datos (crear, editar, validar).

### `src/views/` (Vistas y DOM)
* **Objetivo:** Manejar la interacción directa con el navegador.
* **Regla:** Es la **única capa** que accede a `document.getElementById`, formularios y eventos (`click`, `submit`).
* **Flujo:** Extrae la información de los inputs, valida que no vengan vacíos y se la entrega al Controlador.

### `src/controllers/` (Controladores)
* **Objetivo:** Actuar como el cerebro central.
* **Regla:** Conecta la **Vista** con el **Modelo**. La Vista no habla directamente con la Base de Datos; le pide al Controlador que ejecute la acción.

### `src/modules/` (Servicios / Base de Datos)
* **Objetivo:** Ejecutar las peticiones CRUD (`insert`, `select`, `update`, `delete`) hacia Supabase.
* **Regla:** Debe contener bloques `try / catch` para capturar errores de red o de base de datos sin romper la aplicación.

---

## 🔄 3. Flujo de Datos MVC (¿Cómo viaja la información?)

Cuando un usuario se registra en la web, el flujo sigue este orden estricto:

```
[ Usuario llena Formulario HTML ]
             │
             ▼
[ 1. Vista: Cl_vRegisterUser ] ──> Captura el evento 'submit', extrae FormData y valida campos.
             │
             ▼
[ 2. Controlador: Controller ] ──> Recibe el objeto con los datos y llama al modelo de usuario.
             │
             ▼
[ 3. Modelo: Cl_mNewUser ] ─────> Sanitiza datos (trim, minúsculas) y los transforma con toJSON().
             │
             ▼
[ 4. Servicio: userRegistro ] ───> Ejecuta supabaseClient.client.from('iUsuarioNews').insert([...]).
             │
             ▼
[ 5. Respuesta ] ───────────────> Devuelve true/false hacia arriba hasta que la Vista muestra la alerta al usuario.
```

---

## ⚡ 4. ¿Cómo Funciona el Bundler (`esbuild`)?

Los navegadores modernos no pueden leer archivos TypeScript directamente ni resolver módulos dentro de `node_modules` como `@supabase/supabase-js`.

El script [`build.js`](file:///c:/Users/DuvalP/OneDrive/Desktop/HoopPeru%20WEB/build.js) realiza las siguientes funciones:
1. **Lectura Segura de `.env`:** Lee las variables de entorno sin exponerlas en tu repositorio de Git.
2. **Empaquetado (Bundling):** Une todos tus archivos de TypeScript y las librerías externas en un único archivo listo para producción: [`dist/bundle.js`](file:///c:/Users/DuvalP/OneDrive/Desktop/HoopPeru%20WEB/dist/bundle.js).
3. **Inyección en Tiempo de Compilación:** Reemplaza automáticamente las referencias a `process.env.SUPABASE_URL` y `process.env.SUPABASE_KEY` por los valores reales en el archivo final.

---

## 🛠️ 5. Comandos de Trabajo Diario

En la terminal, dentro de la carpeta del proyecto:

| Comando | Acción |
| :--- | :--- |
| `npm run build` | Compila y genera el archivo `dist/bundle.js` una sola vez. |
| `npm run dev` | Inicia el empaquetador en modo **Watch** (se recompila automáticamente al guardar cambios en cualquier archivo `.ts`). |
| `npm run type-check` | Verifica que no existan errores de tipos en TypeScript. |

Para visualizar la web, abre [`Index.html`](file:///c:/Users/DuvalP/OneDrive/Desktop/HoopPeru%20WEB/Index.html) a través de un servidor local (por ejemplo con la extensión **Live Server** de VS Code o ejecutando `npx serve .`).

---

## 🚀 6. Guía Paso a Paso para Crear un Nuevo Módulo (Ejemplo: Torneos)

Cuando quieras agregar una nueva funcionalidad (por ejemplo, gestión de **Torneos**), sigue esta receta:

1. **Definir el Tipo en `src/types/types.ts`:**
   ```ts
   export interface iTorneo {
       id?: string;
       nombre: string;
       fechaInicio: Date;
       categoria: string;
   }
   ```

2. **Crear el Modelo en `src/models/TorneoModules/Cl_mTorneo.ts`:**
   * Crea la clase con atributos privados, getters, setters y el método `toJSON()`.

3. **Crear el Servicio de Base de Datos en `src/modules/torneoServicio.ts`:**
   * Usa `supabase` para hacer el `insert` o `select` a la tabla `'torneos'`.

4. **Crear la Vista en `src/views/Cl_vTorneo.ts`:**
   * Conecta el formulario HTML del torneo y escucha sus botones.

5. **Registrarlo en `src/controllers/Controller.ts`:**
   * Instancia la nueva vista y métodos dentro del controlador general.

6. **Compilar con `npm run build`** y ¡listo! Tu nuevo módulo funcionará integrado con la misma arquitectura profesional.
