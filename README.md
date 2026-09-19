# CVListo

**Tu próximo trabajo empieza aquí.** CVListo es un MVP en español para crear una hoja de vida, recibir sugerencias de mejora y practicar para entrevistas. Está enfocado inicialmente en personas que buscan empleo en Colombia.

## Qué incluye

- Creador de hoja de vida con educación, experiencias, habilidades e información adicional.
- Vista profesional del CV, con edición y copia al portapapeles.
- Analizador de CV funcional en **modo demo**.
- Preguntas y respuestas sugeridas de entrevista según el cargo.
- Diseño responsive, metadatos SEO y sin cuentas, pagos ni claves.

## Stack y requisitos

Esta primera versión usa HTML, CSS y JavaScript moderno (módulos ES), sin dependencias. Así puede probarse sin instalar Node.js ni pagar servicios. La estructura separa interfaz (`src/components`) y proveedor de IA (`src/services/ai`) para facilitar una migración posterior a React/Next.js o la conexión con IA real.

Solo necesitas un navegador moderno. Para ejecutar un servidor local simple, puedes usar cualquier extensión de servidor estático de tu editor, o si tienes Python instalado:

```bash
python -m http.server 8080
```

Después abre `http://localhost:8080` en el navegador.

## Cómo desplegar gratis

Como es un sitio estático, sube estos archivos a GitHub Pages, Cloudflare Pages o Netlify. No requiere proceso de compilación, base de datos ni variables de entorno para el modo demo.

## Conectar IA real después

El punto de conexión está en `src/services/ai/demo-ai.js`. Sus dos métodos son:

- `analyzeCv(text)` para analizar y optimizar una hoja de vida.
- `interviewQuestions(role)` para producir preguntas de entrevista.

Para usar un proveedor LLM, crea un backend o ruta de API que conserve la clave en el servidor y reemplaza el contenido de esos métodos por llamadas a esa ruta. **Nunca** pongas una clave privada en `src/` ni en el navegador. Cuando exista un backend, define allí una variable como `LLM_API_KEY` en el panel del proveedor de despliegue; esta V1 no requiere ningún archivo `.env`.

## Próximos pasos recomendados

1. Migrar la interfaz a Next.js cuando Node.js esté disponible en el entorno de desarrollo.
2. Añadir API de IA a través de un backend seguro.
3. Incorporar autenticación e historial de CV.
4. Generar y descargar PDF.
5. Añadir plantillas, adaptación a vacantes y planes premium.
