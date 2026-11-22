# SPP · Recorrido interactivo

Experiencia web educativa para explicar visualmente cómo interactúan los cuatro roles y los componentes principales del Software de Prácticas Pedagógicas (SPP).

## Características

- Recorrido guiado con reproducción, pausa, avance, retroceso y reinicio.
- Exploración independiente por estudiante, tutor académico, asesor pedagógico y director.
- Diagrama animado de interacción entre frontend, monolito, bases de datos y microservicios.
- Vista conceptual de la arquitectura híbrida.
- Diseño adaptable a computador, tableta y celular.
- No requiere instalación, backend, autenticación ni conexión con las bases de datos reales.

## Tecnologías

HTML5, CSS3 y JavaScript nativo. La tipografía se carga desde Google Fonts; existe una tipografía de respaldo del sistema.

## Ejecutar localmente

Abre `index.html` en un navegador. También puedes usar la extensión Live Server de Visual Studio Code.

## Publicar con GitHub Pages

1. Abre **Settings → Pages** en este repositorio.
2. En **Build and deployment**, selecciona **Deploy from a branch**.
3. Selecciona la rama `main` y la carpeta `/ (root)`.
4. Guarda los cambios y espera a que GitHub Pages publique el sitio.
5. La dirección será `https://edwinsebastian-crypto.github.io/Animacion_SPP/`.

## Crear el QR para el póster

Una vez que GitHub Pages esté publicado y hayas comprobado el enlace desde un celular, genera un código QR que apunte a la URL pública. No uses el enlace del repositorio como QR si lo que quieres es abrir directamente la animación.

## Alcance y fidelidad

Esta aplicación es una **simulación visual educativa**, no una consola conectada al SPP real. Los pasos describen flujos funcionales representativos a partir de la arquitectura documentada del repositorio SPP. Las animaciones no envían solicitudes, no modifican información y no consultan bases de datos.

Arquitectura representada:
- Frontend: React 19 + Vite.
- Monolito principal: Node.js + Express.
- Microservicio de evaluaciones: Python + FastAPI y PostgreSQL propio.
- Microservicio de notificaciones: Node.js + Express y MongoDB.
- Persistencia del monolito: PostgreSQL / Supabase y archivos en Cloudinary.

## Estructura

```
.
├── index.html
├── styles.css
├── app.js
└── README.md
```
