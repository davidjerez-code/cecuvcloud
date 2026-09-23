# Plan de implementación — CECUV-Cloud

## Objetivo
Construir en la página principal una plataforma científica de una sola página, totalmente adaptable, con estética industrial, navegación por secciones y todos los simuladores y exportaciones funcionando sin servicios externos.

## Experiencia y diseño
- Definir un sistema visual claro/oscuro con acentos cian, verde y rojo, tipografía técnica, cuadrícula industrial y animaciones discretas.
- Crear una cabecera fija con identidad institucional, navegación, selector de tema y acceso QR.
- Presentar CECUV-Cloud con un modelo isométrico interactivo de la cabina, ocho puntos técnicos y accesos directos.

## Funcionalidad
- Añadir el módulo educativo, tarjetas científicas y CECUV-Bot con respuestas guiadas.
- Implementar el simulador DoE con controles de TiO₂, tiempo y potencia; recalcular curva cinética y eficiencia en tiempo real.
- Simular telemetría IoT: temperatura, humedad, intensidad UV, cronómetro, agitación e interlock, incluyendo alertas y gráfica histórica.
- Permitir descargar telemetría CSV y un reporte de ensayo imprimible/guardable como PDF.
- Incorporar viabilidad económica, tabla BOM filtrable, integrantes, dedicatoria y reconocimiento docente.
- Generar un QR funcional en una ventana modal y conectar toda la navegación y botones.

## Detalles técnicos
- Mantener la arquitectura TanStack existente del proyecto y encapsular la experiencia en componentes React ligeros, sin backend.
- Usar SVG y CSS propios para el modelo, las gráficas y la visualización QR, evitando dependencias pesadas adicionales.
- Definir todos los colores y estilos mediante tokens semánticos en el sistema global.
- Añadir metadatos sociales y SEO específicos de CECUV-Cloud.

## Verificación
- Comprobar compilación y errores de ejecución.
- Probar navegación, tema, modal QR, hotspots, controles DoE, interlock y descargas.
- Revisar visualmente escritorio y móvil para evitar desbordes, solapamientos y texto cortado.
