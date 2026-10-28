# CECUVCloud

Plataforma educativa del Semillero OPENIN — Universidad Cooperativa de Colombia. Integra un prototipo visual de cabina UV, simulación fotocatalítica, telemetría simulada, CECUV-Bot, presupuesto y reportes de sesión.

## Desarrollo aislado

El desarrollo de CODEX se realiza en `codex/cecuvcloud-next`. Las ramas `main` y `Dev` se conservan. No hacer push forzado ni reescribir historia publicada: el proyecto original está conectado a Lovable.

## Instalación reproducible

Requisitos: **Node.js 24.x y npm 11**. El gestor de referencia es npm y el archivo de bloqueo es `package-lock.json`.

```sh
npm ci
npm run dev
```

## Verificaciones

```sh
npm run check        # ESLint, TypeScript y pruebas de lógica
npm audit           # Auditoría de dependencias
npm run build       # Compilación del destino detectado por Nitro
npm run format:check
npx playwright install chromium
npm run test:e2e     # Navegador en escritorio y móvil
```

Playwright inicia un servidor local. Para validar una vista previa publicada:

```sh
BASE_URL=https://direccion-de-la-vista-previa.vercel.app npm run test:e2e
```

Si se dispone de Chromium del sistema, se puede establecer `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Una vista previa protegida debe probarse mediante los mecanismos de acceso autorizados de Vercel, sin cambiar su audiencia.

El flujo `.github/workflows/quality.yml` ejecuta instalación limpia, lint, tipos, pruebas, auditoría, compilación para Vercel y navegador. No contiene secretos ni despliega a producción.

## URL permanente y publicación en Vercel

La dirección pública es **https://cecuvcloud.vercel.app/**. El QR, la URL canónica y `og:url` comparten este destino, incluso al probar la aplicación desde localhost o una vista previa.

El proyecto es `cecuvcloud-codex` (`prj_uYidOtiyRXOGGRFPXpuLwmib68mZ`) dentro del equipo **SaraQ**, scope `sara-q` (`team_Pntn14WpvRQxYnS604PXVfO2`). La cuenta `saraq328-lab` no es el scope del equipo. Conservar este proyecto y su dominio para las siguientes versiones.

Stack: React 19, TypeScript, TanStack Start/Router, Vite y Nitro. Se conserva `@lovable.dev/vite-tanstack-config`; no agregar una segunda instancia de sus plugins.

`vercel.json` configura TanStack Start, `npm ci`, las verificaciones de calidad y el build de Nitro para Vercel. La compilación local equivalente es:

```sh
npm run check && NITRO_PRESET=vercel npm run build
```

La salida se genera en `.vercel/output`, incluyendo la función SSR y los estáticos. No configurar una SPA estática ni un fallback global a `index.html`.

Publicar únicamente commits verificados de `codex/cecuvcloud-next`, conservando `main` y `Dev`. Con Vercel CLI 65.5.0, desde esta rama limpia y sincronizada con GitHub:

```sh
vercel deploy --prod --skip-domain --yes --archive tgz --scope sara-q --project prj_uYidOtiyRXOGGRFPXpuLwmib68mZ
# Validar la URL técnica del despliegue READY y después promover ese mismo build:
vercel promote <url-del-despliegue-validado> --yes --scope sara-q
```

La promoción actualiza la versión servida en `https://cecuvcloud.vercel.app/`. Las URLs técnicas que genera Vercel permiten comprobar versiones; la dirección pública se mantiene. La asignación automática de dominios del proyecto debe permanecer habilitada.

La sincronización automática por push depende de que **la aplicación Vercel de GitHub tenga acceso al repositorio `davidjerez-code/cecuvcloud`**. La integración actual de Sara solo enumera el namespace `saraq328-lab` y no encuentra este repositorio. Hasta completar esa autorización y conectar el repositorio al proyecto existente con rama de producción `codex/cecuvcloud-next`, los pushes ejecutan el flujo de calidad de GitHub, pero la publicación se hace mediante el comando anterior. No crear otro proyecto ni cambiar la rama predeterminada del repositorio.

No se requieren claves externas para el simulador o chatbot local. `.vercel/` y los archivos `.env` quedan excluidos de Git.

## Funciones y límites

- El interlock simulado apaga UV y agitación, detiene el cronómetro y bloquea el inicio con puerta abierta. Cerrar la puerta requiere un inicio manual.
- Gráfica, CSV y PDF utilizan las mismas muestras. Los eventos agregan registros; no reescriben la historia.
- Cada carga genera un identificador de sesión y conserva como máximo 3.600 muestras en memoria. **Descargar los datos antes de recargar o cerrar:** no hay almacenamiento permanente ni conexión a sensores físicos.
- El PDF incluye operador opcional, fecha, identificador, condiciones, escenario DoE de referencia y gráfico. Los datos son simulados y no constituyen una certificación de resultados experimentales.
- Las fórmulas siguen en `src/lib/cecuv-simulation.ts`. El estimador educativo permanece separado de los controles operativos.
- CECUV-Bot consulta una base de conocimiento local, sin llamar a un proveedor externo de modelos.
- Costos, total y ahorro provienen de `src/lib/cecuv-budget.ts`, compartido con el chatbot.
- El QR comparte siempre `https://cecuvcloud.vercel.app/`.
- Las fotografías originales se sirven desde `public/team`. John conserva sus iniciales porque no se proporcionó fotografía.
- El póster abre la [vista pública de Canva](https://www.canva.com/design/DAGFgwo55X4/yyUm1nnZ6K4hQICGAQuEpA/view). El trabajo escrito está disponible como PDF local. No se presenta una página de Canva como una descarga PDF.

## Estructura principal

| Ruta                              | Responsabilidad                                           |
| --------------------------------- | --------------------------------------------------------- |
| `src/routes`                      | Rutas y límites de error TanStack                         |
| `src/components/cecuv-cloud.tsx`  | Composición de la plataforma                              |
| `src/components/CecuvChatbot.tsx` | Interfaz de CECUV-Bot                                     |
| `src/lib/cecuv-simulation.ts`     | Cinética y salidas seguras                                |
| `src/lib/cecuv-telemetry.ts`      | Registro inmutable y CSV                                  |
| `src/lib/cecuv-exports.ts`        | Descargas y reporte PDF                                   |
| `src/lib/cecuv-budget.ts`         | Partidas, total y ahorro                                  |
| `src/lib/cecuv-team.ts`           | Identidades compartidas del equipo                        |
| `e2e`                             | Pruebas de navegación, seguridad simulada y exportaciones |

La disponibilidad y los permisos de los recursos de Canva y Onshape se administran en esos servicios.
