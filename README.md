# 🇵🇪 HoopPerú - Plataforma Web de Gestión y Voluntariado

Plataforma web integral diseñada para la organización no gubernamental **Hoop Perú**, facilitando la interacción comunitaria, control de voluntarios, gestión de programas educativos, programación de horarios, recursos documentales y administración de perfiles.

---

## 👨‍💻 Desarrollador del Proyecto

* **Desarrollador Principal:** **Duval Pérez**
* **Organización / GitHub:** [@devhoopdesarrollo-netizen](https://github.com/devhoopdesarrollo-netizen)
* **Contacto:** devhoopdesarrollo@gmail.com

---

## 🚀 Características Principales

1. **Feed de Publicaciones e Interacción:**
   * Publicación de novedades y anuncios con carga de imágenes a almacenamiento en la nube.
   * Sistema interactivo de reacciones ("Me gusta") con actualización dinámica de contadores y estados visuales.

2. **Gestión de Horarios y Anuncios:**
   * Asignación de días y turnos semanales a voluntarios por programa.
   * Validación estricta de programas (`fk_programas`) para garantizar integridad referencial.
   * Publicación de reuniones con rango horario (`horaInicio < horaFinal`).
   * Limpieza automática: las reuniones caducadas con más de 3 días de antigüedad se eliminan automáticamente de la base de datos al ser consultadas.

3. **Centro de Recursos y Documentos:**
   * Carga de archivos y manuales asociados a programas educativos.
   * Selección amigable por nombre de programa con vinculación de IDs correspondientes a Supabase.
   * Descarga y previsualización segura de documentos.

4. **Gestión de Perfiles y Roles (Panel Administrativo):**
   * Creación, edición y cambio seguro de contraseña de usuarios/voluntarios.
   * Catálogo dinámico para añadir y eliminar programas y cargos institucionales.
   * Modales de confirmación con doble validación para evitar eliminaciones accidentales.

5. **Perfil de Usuario y Notificaciones:**
   * Carga y actualización de foto de perfil con almacenamiento en Supabase Storage (`User_photos_perfiles`).
   * Panel de notificaciones dinámicas que alerta sobre reuniones activas con indicador visual tipo badge.

6. **Mantenimiento Preventivo Keep-Alive:**
   * Mecanismo automatizado de verificación periódica contra Supabase en cada carga de la aplicación para prevenir la inactivación de la base de datos en planes gratuitos.

---

## 🛠️ Tecnologías Utilizadas

* **Lenguaje:** TypeScript (ES2020)
* **Empaquetador:** ESBuild (compilación rápida en `dist/bundle.js`)
* **Base de Datos & Storage:** [Supabase](https://supabase.com/) (PostgreSQL + Supabase Storage)
* **Estilos:** Tailwind CSS + Paleta corporativa Hoop (`resources/hoop-theme.css`)
* **Iconos:** Phosphor Icons Web v2
* **Despliegue:** [Vercel](https://vercel.com/)

---

## 📂 Estructura del Proyecto

```text
├── dist/                          # Salida empaquetada (bundle.js)
├── resources/                     # Recursos visuales y estilos corporativos
│   ├── hoop-theme.css             # Paleta de colores oficial de Hoop Perú
│   └── navbar-logo.webp           # Logotipo institucional
├── src/
│   ├── config/                    # Conexión a Supabase y keep-alive
│   ├── controllers/               # Enrutador y controlador de vistas
│   ├── models/                    # Modelos de datos TypeScript
│   ├── modules/                   # Servicios y lógica de negocio
│   ├── types/                     # Definiciones de tipos e interfaces
│   ├── views/                     # Vistas y componentes interactivos
│   └── index.ts                   # Punto de entrada de la aplicación
├── ventanas/                      # Vistas HTML principales
│   ├── inicio_Administracion.html # Panel administrativo
│   └── inicio_usuario.html        # Panel del usuario/voluntario
├── Index.html                     # Pantalla de Login institucional
├── vercel.json                    # Configuración de despliegue en Vercel
├── build.js                       # Script de empaquetado con ESBuild
└── tsconfig.json                  # Configuración del compilador TypeScript
```

---

## ⚙️ Instalación y Desarrollo Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/devhoopdesarrollo-netizen/HoopDev.git
   cd HoopDev
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crear un archivo `.env` en la raíz con las credenciales de Supabase:
   ```env
   SUPABASE_URL=tu_supabase_url
   SUPABASE_KEY=tu_supabase_anon_key
   JWT_SECRET=tu_jwt_secret
   ```

4. **Compilar el proyecto:**
   ```bash
   # Compilación única
   npm run build

   # Modo observación continua (watch)
   npm run build:watch
   ```

5. **Verificación de tipos:**
   ```bash
   npm run type-check
   ```

---

## 📄 Licencia

Este proyecto es de uso exclusivo y propiedad de **Hoop Perú**. Desarrollado con dedicación por **Duval Pérez**.
