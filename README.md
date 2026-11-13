# Workflow Tesis & Repositorio Digital de Monografías

Plataforma integral desarrollada en **Next.js 16 (App Router)**, **React 19** y **Material UI (MUI)** para digitalizar el flujo de trabajo de trabajos de culminación de estudios, revisiones de normas APA, control de similitud y emisión de autorizaciones de defensa para la **Unidad de Culminación de Estudios**.

---

## 🚀 Características Principales

* **Persistencia 100% en `localStorage`:** No requiere backend ni base de datos externa para funcionar. Incluye un módulo de *Seed Data* que precarga proyectos, versiones y observaciones de ejemplo automáticamente.
* **Componentes UI con Material UI:** Paleta universitaria profesional, diseño responsivo, AppBar con selector de roles, menús laterales dinámicos, diálogos modales, rúbricas cuantitativas y tablas de datos.
* **Selector Dinámico de Roles:** Cambia en cualquier momento entre **Estudiante**, **Tutor**, **Jurado** y **Unidad Académica** desde el AppBar superior para probar la experiencia completa de cada actor.
* **Botón de Restablecer:** Permite regresar todos los datos de prueba a su estado original en cualquier momento.

---

## 📋 Catálogo de Pantallas Implementadas

| Módulo | Ruta | Descripción |
| :--- | :--- | :--- |
| **Inicio & Workflow** | `/` | Vista de bienvenida, Stepper del ciclo de vida y tarjetas de acceso por rol. |
| **Estudiante** | `/estudiante` | Dashboard con estado del trámite, versión vigente e índice de similitud Turnitin. |
| **Estudiante** | `/estudiante/proyecto` | Ficha técnica del proyecto, integrantes, línea de investigación y resumen. |
| **Estudiante** | `/estudiante/versiones` | Historial de entregas (`v1.0`, `v1.1`...) y modal para subir nuevos borradores con changelog. |
| **Estudiante** | `/estudiante/observaciones`| Observaciones del tutor clasificadas (APA, Metodología, Fondo) con formulario para responder y subsanar. |
| **Docente Tutor** | `/tutor` | Panel de proyectos asignados con métricas de atención y observaciones pendientes. |
| **Docente Tutor** | `/tutor/proyectos/[id]/revision` | Mesa de revisión interactiva del borrador con panel para registrar comentarios estructurados. |
| **Docente Tutor** | `/tutor/proyectos/[id]/dictamen` | Formulario de declaración de conformidad (APA, metodología, similitud) y emisión de Visto Bueno. |
| **Jurado Evaluador** | `/jurado` | Lista de monografías asignadas para dictamen previo a defensa. |
| **Jurado Evaluador** | `/jurado/evaluacion/[id]` | Rúbrica de evaluación sobre 100 puntos y registro de dictamen favorable o con observaciones. |
| **Unidad Académica** | `/admin` | Panel de control institucional con métricas globales y tabla de expedientes. |
| **Unidad Académica** | `/admin/asignaciones` | Matriz de vinculación de tesistas con su tutor y terna de jurados evaluadores. |
| **Unidad Académica** | `/admin/autorizaciones` | Emisión y visualización del Acta Oficial Digital de Defensa con sello criptográfico. |
| **Acceso Abierto** | `/repositorio` | Repositorio institucional con buscador en tiempo real, filtros por carrera y generador de citas APA 7. |

---

## 🛠️ Cómo Iniciar el Proyecto

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

3. **Compilar para producción:**
   ```bash
   npm run build
   npm start
   ```

---

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── admin/                 # Pantallas de la Unidad de Culminación de Estudios
│   │   ├── asignaciones/
│   │   ├── autorizaciones/
│   │   └── page.js
│   ├── estudiante/            # Pantallas del tesista / grupo
│   │   ├── observaciones/
│   │   ├── proyecto/
│   │   ├── versiones/
│   │   └── page.js
│   ├── jurado/                # Pantallas del jurado evaluador
│   │   ├── evaluacion/[id]/
│   │   └── page.js
│   ├── repositorio/           # Catálogo público institucional
│   │   └── page.js
│   ├── tutor/                 # Pantallas del docente asesor
│   │   ├── proyectos/[id]/dictamen/
│   │   ├── proyectos/[id]/revision/
│   │   └── page.js
│   ├── layout.js              # Providers globales (MUI, Auth, Suspense)
│   └── page.js                # Portada principal y selector
├── components/
│   ├── layout/                # AppNavbar, AppSidebar, MainLayout
│   └── providers/             # MuiProvider
├── context/
│   └── AuthContext.js         # Estado reactivo de usuario y rol activo
├── services/
│   └── storageService.js      # Capa de persistencia con localStorage y Seed Data
└── theme/
    └── theme.js               # Paleta y diseño Material UI
```
