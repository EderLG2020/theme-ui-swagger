## AUTOR:

**Eder Llancari Guerra**

# 🔍 OpenAPI Explorer — README (Resumido)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB.svg)](https://react.dev/)[![TailwindCSS](https://img.shields.io/badge/Styled%20with-TailwindCSS-38B2AC.svg)](https://tailwindcss.com/)[![Framer Motion](https://img.shields.io/badge/Animations-Framer%20Motion-ff0050.svg)](https://www.framer.com/motion/)[![Swagger UI](https://img.shields.io/badge/Docs-Swagger%20UI-brightgreen)](https://swagger.io/tools/swagger-ui/)

---

## 📖 Descripción breve

**OpenAPI Explorer** es una UI ligera para visualizar y navegar documentos **OpenAPI/Swagger**.  
Permite cargar un JSON desde una URL, explorar endpoints agrupados por tags, ver detalles (summary, descripción, parámetros, request body) y visualizar respuestas con resaltado de JSON y tabs por status code. Está diseñado con **React + TailwindCSS** y usa **Framer Motion** para animaciones suaves.

---

## 🧩 Objetivo de este README

Presentar el proyecto de forma clara en tu repositorio: qué hace, tecnologías, estructura y cómo **mostrar** o **presentar** el proyecto.

---

## 🚀 Tecnologías clave

- **React** (hooks)
- **TailwindCSS** (estilos)
- **Framer Motion** (animaciones)
- **Axios** (carga de JSON remoto)
- **react-markdown** (renderizar descripciones Markdown)
- **react-syntax-highlighter** (resaltar JSON)

---

## 📂 Estructura principal (resumen)

```
src/
 ├─ App.tsx                # Punto de entrada UI: carga JSON, estado global
 ├─ UrlLoader.tsx          # Input para la URL del OpenAPI JSON
 ├─ SidebarPaths.tsx       # Sidebar agrupando endpoints por tags
 ├─ TagGroup.tsx           # Lista de endpoints por tag
 ├─ EndpointDetails.tsx    # Muestra summary, description, params, request body
 ├─ Responses.tsx          # Pestañas y visualización de respuestas JSON
 ├─ interfaces/
 │    └─ swagger.interface.ts
```

---

## 🧭 Resumen de componentes y responsabilidades

- **App.tsx** — Controla la carga del JSON y el estado seleccionado (path + method).
- **UrlLoader** — Componente para ingresar la URL del OpenAPI/Swagger JSON.
- **SidebarPaths** — Agrupa los paths por `tag` y permite seleccionar un endpoint; incluye botón de recarga.
- **TagGroup** — Renderiza cada grupo (tag) y sus endpoints (path + método).
- **EndpointDetails** — Muestra summary, description (renderizado Markdown), parámetros (colapsables), request bodies y ejemplos con syntax highlight.
- **Responses** — Pestañas por status code y vista formateada del objeto `response` (con SyntaxHighlighter).

---

## 🖼 Demo (guía rápida)

1. Abre la aplicación (modo desarrollo o build) y muestra la pantalla principal.
2. Ingresa una **URL** de OpenAPI JSON (puede ser un ejemplo público).
3. En el sidebar selecciona un **endpoint**: muestra `EndpointDetails` (summary + Markdown) y luego `Responses`.
4. Muestra el botón **Reload** (recarga la misma URL) y cómo el icono indica actividad.

Si quieres mostrar código en el README, usa estos snippets (dentro del README real tus bloques de código se marcarán con `...` según tu preferencia):

---

### 🔹 Ejemplo de uso (fragmento de App.tsx — resumen funcional)

```tsx
// Extracto: manejar carga y reload
const handleLoadJson = async (url: string) => {
  setLoading(true);
  setError("");
  try {
    const res = await axios.get(url);
    setJsonData(res.data);
    setLastUrl(url);
  } catch (err: any) {
    setError(err.message || "Error al cargar el JSON");
  } finally {
    setLoading(false);
  }
};

const handleReload = async () => {
  if (lastUrl) await handleLoadJson(lastUrl);
};
```

---

### 🔹 Ejemplo visual (snippet para mostrar en README — contenedor con scroll)

```html
<div class="h-64 overflow-y-scroll scrollbar-thin scrollbar-rounded">
  <!-- Contenido desplazable (ej. lista de endpoints) -->
</div>
```

---

## 📌 Puntos fuertes para destacar en la presentación

- Carga dinámica de cualquier OpenAPI JSON por URL.
- Markdown en descripciones (negritas, listas, enlaces).
- Syntax highlighting para ejemplos JSON.
- UI compacta: sidebar (paths) — detalles — respuestas.
- Animaciones suaves para mejorar la experiencia.

---

## 📜 Licencia y créditos

- **Autor:** Eder Llancari Guerra
- **Licencia:** MIT — libre para uso, modificación y distribución.

---

## capturas

![Example](https://i.ibb.co/1tQHN34R/Captura-de-pantalla-2025-08-21-001648.png)

---

![Imagen](https://i.ibb.co/27ZXDzZZ/image.png)

---

## Demo completo

---

## ![EjemploDemo](https://i.ibb.co/v6JqCsst/2025-08-2100-44-10-ezgif-com-video-to-gif-converter.gif)

---
