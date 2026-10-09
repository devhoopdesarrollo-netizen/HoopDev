# 🛡️ Propuesta de Arquitectura: Gestión de Sesiones, Clientes Autenticados y RLS en Supabase

> **Proyecto:** HoopPeru WEB  
> **Tema:** Análisis de Escalabilidad, Seguridad en RLS e Integración de Storage y Base de Datos.  
> **Fecha:** 30 de Septiembre de 2026  

---

## 🎯 1. Resumen Ejecutivo y Objetivo

El presente documento analiza el impacto arquitectónico y de **escalabilidad** de la refactorización en la gestión de instancias del cliente de Supabase (`@supabase/supabase-js`), el paso de cabeceras de autorización hacia **Storage** y **Base de Datos**, y el endurecimiento de las políticas de seguridad **RLS (Row Level Security)**.

---

## 🔍 2. Diagnóstico del Estado Actual vs. Desafíos de Escalabilidad

### ⚠️ Problema 1: Mutación de Cabeceras Globales en un Cliente Compartido (Singleton)
Actualmente, en `src/config/supabase.ts`, se inyecta el token mediante:
```typescript
// ❌ Estado actual:
UserAuntentiked_Token(User_Token: string) {
    (this.client as any).rest.headers['Authorization'] = `Bearer ${User_Token}`;
}
```

#### Impacto en la Escalabilidad y Concurrencia:
1. **Pérdida de Autorización en Storage y Realtime:**
   * La propiedad `rest.headers` solo afecta al submódulo PostgREST (tablas SQL).
   * El cliente de Storage (`client.storage`) utiliza su propia configuración de red interna y **ignora** `rest.headers`. Como consecuencia, las subidas de archivos al bucket `Multimedia` viajan como usuario anónimo (`anon`), generando errores `403 Forbidden` o `42501 (Permission Denied)`.
2. **Efectos Secundarios en Memoria (State Pollution):**
   * Al mutar un objeto compartido a nivel de módulo, si el usuario cierra sesión o cambia de usuario, el cliente singleton conserva cabeceras residuales a menos que se sobreescriba explícitamente.

---

### ⚠️ Problema 2: Vulnerabilidad de Suplantación de Identidad en RLS (*Identity Spoofing*)
Si la política de inserción en la tabla `Post` utiliza `WITH CHECK (true)`:
```sql
-- 🚨 Vulnerable a suplantación:
CREATE POLICY "Permitir crear posts" ON public."Post"
FOR INSERT TO authenticated
WITH CHECK (true);
```

#### Impacto en Seguridad y Escalabilidad:
* Cualquier usuario con un token válido podría forzar un payload JSON con `fk_user: "ID_DE_OTRO_USUARIO"`.
* La base de datos aceptaría el registro y lo publicaría a nombre de otra persona, corrompiendo la integridad del feed social.

---

## 🚀 3. Análisis de Escalabilidad con la Solución Propuesta

La propuesta consiste en implementar el método **`getAuthenticatedClient(token)`** utilizando la configuración oficial `global.headers` de Supabase:

```
                  ARQUITECTURA DE CLIENTES SUPABASE
  ┌─────────────────────────────────────────────────────────────┐
  │                 SupabaseService (Singleton)                 │
  └──────────────┬──────────────────────────────┬───────────────┘
                 │                              │
        .client (Público/Anon)         .getAuthenticatedClient(token)
                 │                              │
                 ▼                              ▼
     ┌───────────────────────┐      ┌───────────────────────┐
     │ - Lecturas públicas   │      │ - Global Bearer Header│
     │ - Landing / Login     │      │ - Base de Datos (REST)│
     │ - Ver posts públicos  │      │ - Storage (Multimedia)│
     │                       │      │ - Realtime Sockets    │
     └───────────────────────┘      └───────────────────────┘
```

### 📈 Beneficios para la Escalabilidad del Proyecto:
1. **Aislamiento Total de Contexto:** Cada operación autenticada utiliza un cliente configurado con sus credenciales exactas sin contaminar el cliente público.
2. **Soporte Nativo Multi-módulo:** Una sola configuración de headers autoriza simultáneamente `PostgREST`, `Storage API` (`/storage/v1`) y suscripciones `Realtime`.
3. **Facilidad de Renovación de Token (Token Refresh):** Cuando se implemente expiración y rotación de tokens JWT, simplemente se genera un nuevo cliente pasando el token actualizado sin reiniciar la aplicación.
4. **Integridad de Datos en PostgreSQL:** Al validar `fk_user = auth.uid()` en base de datos, la seguridad no depende del frontend (el cual puede ser manipulado en el navegador), sino del motor criptográfico de PostgreSQL.

---

## 🛠️ 4. Implementación Técnica Paso a Paso

### 4.1. Refactorización de [`src/config/supabase.ts`](file:///c:/Users/DuvalP/OneDrive/Desktop/HoopPeru%20WEB/src/config/supabase.ts)

```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';

declare const process: {
    env: {
        SUPABASE_URL?: string;
        SUPABASE_KEY?: string;
    };
};

class SupabaseService {
    public client: SupabaseClient; 
    private supabaseUrl: string;
    private supabaseKey: string;

    constructor() {
        this.supabaseUrl = (typeof process !== 'undefined' && process.env?.SUPABASE_URL) 
            || 'https://tu-proyecto.supabase.co';
        this.supabaseKey = (typeof process !== 'undefined' && process.env?.SUPABASE_KEY) 
            || 'tu-anon-key';

        // Cliente base para operaciones anónimas / públicas
        this.client = createClient(this.supabaseUrl, this.supabaseKey);
    }

    /**
     * Genera un cliente con autorización global para DB, Storage y Realtime
     */
    getAuthenticatedClient(token: string): SupabaseClient {
        return createClient(this.supabaseUrl, this.supabaseKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });
    }
}

const supabaseService = new SupabaseService();
export default supabaseService;
```

---

### 4.2. Módulo de Storage: [`src/modules/Post_Moduls/StorageImagenes.ts`](file:///c:/Users/DuvalP/OneDrive/Desktop/HoopPeru%20WEB/src/modules/Post_Moduls/StorageImagenes.ts)

```typescript
import { SupabaseClient } from "@supabase/supabase-js";
import supabaseService from "../../config/supabase.js";

export default class StorageImagen {
    /**
     * Sube una imagen al Storage utilizando el cliente autenticado
     */
    async uploadPostImagen(file: File, clientAuth?: SupabaseClient): Promise<string> {
        const client = clientAuth || supabaseService.client;
        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `User_img_post/${fileName}`;

            const { error } = await client.storage
                .from("Multimedia")
                .upload(filePath, file);

            if (error) throw error;

            const { data: publicUrlData } = client.storage
                .from("Multimedia")
                .getPublicUrl(filePath);

            return publicUrlData.publicUrl;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            console.error('Error al subir imagen:', errorMessage);
            throw new Error('No se pudo cargar la imagen al servidor.');
        }
    }
}
```

---

### 4.3. Módulo de Publicación: [`src/modules/Post_Moduls/Post_new.ts`](file:///c:/Users/DuvalP/OneDrive/Desktop/HoopPeru%20WEB/src/modules/Post_Moduls/Post_new.ts)

```typescript
import supabaseService from "../../config/supabase.js";
import { iPostNew } from "../../types/types.js";
import StorageImagen from "./StorageImagenes.js";

export default class Post_New {
    async crearPostNew(datos: iPostNew, file?: File): Promise<any> {
        const token = localStorage.getItem("user_token");
        if (!token) {
            throw new Error("Sesión no válida o expirada.");
        }

        // Obtener cliente autenticado
        const authClient = supabaseService.getAuthenticatedClient(token);
        const storage = new StorageImagen();

        try {
            let imgDireccion: string | null = null;

            // Subir imagen solo si fue seleccionada
            if (file) {
                imgDireccion = await storage.uploadPostImagen(file, authClient);
            }

            // Inserción en la tabla Post
            const { data, error } = await authClient
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
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            console.error('Error al crear post:', errorMessage);
            throw new Error('No se pudo guardar la publicación.');
        }
    }
}
```

---

### 4.4. Políticas SQL en Supabase (Editor SQL)

```sql
-- 1. Tabla Post: Habilitar RLS y forzar autoría real
ALTER TABLE public."Post" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir crear posts solo al dueño del token"
ON public."Post"
FOR INSERT
TO authenticated
WITH CHECK (
    fK_User = (auth.jwt() ->> 'sub')::text
);

CREATE POLICY "Permitir lectura de posts a usuarios autenticados"
ON public."Post"
FOR SELECT
TO authenticated
USING (true);

-- 2. Storage: Políticas para el Bucket Multimedia
CREATE POLICY "Permitir subir imagenes a usuarios autenticados"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'Multimedia');

CREATE POLICY "Permitir ver imagenes publicas"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'Multimedia');
```

---

## 📌 5. Conclusión y Recomendación

La propuesta eleva el estándar del proyecto a nivel **profesional y productivo**:
* **Seguridad:** Cero posibilidad de suplantación en publicaciones gracias a `auth.jwt() ->> 'sub'`.
* **Escalabilidad:** Separación limpia entre cliente público y clientes autenticados de vida corta.
* **Mantenibilidad:** Código alineado con las especificaciones oficiales de Supabase JS v2.
