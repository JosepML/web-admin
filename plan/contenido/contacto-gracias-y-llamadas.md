# Contacto, Gracias, legales, menú y llamadas a la acción

## Menú

Trabajos · Servicios (desplegable: Dirección de fotografía · Filmmaker · Edición) · Sobre mí · Blog · Contacto · botón destacado **Hablemos**

Recreaciones se enlaza desde Trabajos (filtro y tarjeta), desde Sobre mí y desde el pie, no desde el menú principal.

## Pie de página

- **Frase:** Historias hechas de luz. Alicante, Comunidad Valenciana.
- **Enlaces:** Trabajos · Servicios · Recreaciones · Sobre mí · Blog · Contacto
- **Redes:** Instagram (@josepmiralozano) · LinkedIn · YouTube
- **Legal:** Privacidad · Cookies · © [año] Josep Mira Lozano

## Contacto

- **SEO título:** Contacto · Josep Mira Lozano
- **SEO descripción:** Cuéntame tu proyecto audiovisual en Alicante o la Comunidad Valenciana. Hablemos de cómo contarlo.
- **Título:** Hablemos
- **Introducción:** ¿Tienes un proyecto en mente? Cuéntamelo con tus palabras, aunque solo sea una idea. Cada proyecto es distinto, así que el presupuesto nace de lo que necesite el tuyo. Empecemos por la historia.

### Formulario guiado

| Campo | Etiqueta | Tipo | Obligatorio |
| --- | --- | --- | --- |
| servicio | ¿Qué necesitas? | Opciones: Dirección de fotografía · Filmmaker (idea, rodaje y edición) · Edición · Aún no lo sé | Sí |
| tipo | ¿Qué tipo de proyecto es? | Opciones: Cortometraje · Videoclip · Spot o vídeo de marca · Evento o concierto · Boda · Contenido para redes · Otro | No |
| fecha | ¿Para cuándo? | Fecha aproximada o "Sin fecha aún" | No |
| mensaje | Cuéntame tu idea | Texto largo. Ejemplo: "Somos un grupo de Alcoy y queremos un videoclip para nuestro próximo single..." | Sí |
| nombre | Tu nombre | Texto | Sí |
| email | Tu correo | Email | Sí |
| telefono | Teléfono (opcional) | Texto | No |
| privacidad | He leído y acepto la Política de privacidad. Usaré tus datos solo para responder a tu mensaje. | Casilla | Sí |

- **Botón:** Enviar mensaje
- **Enviando:** Enviando...
- **Error:** Algo ha fallado al enviar. Prueba otra vez o escríbeme directamente a josep.mira@gmail.com.
- Si se llega desde un servicio (`/contacto?servicio=...`), el campo "¿Qué necesitas?" viene marcado.

### Otras formas de contacto

- **WhatsApp:** botón "Escríbeme por WhatsApp" que abre el chat con un mensaje inicial ("Hola Josep, te escribo desde tu web..."). Número: +34 618 867 115, guardado en `ajustes`. No se muestra en texto para que no lo recojan los robots de spam.
- **Correo:** josep.mira@gmail.com
- **Redes:** Instagram · LinkedIn · YouTube

## Gracias

- **Título:** ¡Gracias por escribirme!
- **Texto:** Ya tengo tu mensaje. Lo leo con calma y te contesto en cuanto pueda. Mientras tanto, puedes echar un vistazo a mis trabajos.
- **Botones:** Ver trabajos → /trabajos · Volver al inicio → /

## Legales

- **Privacidad:** se migra el texto actual de `legacy/pages/PrivacyPolicyPage.tsx`, cambiando "Formspree" por el nuevo sistema (los mensajes se guardan en la base de datos de la web, alojada en Supabase, UE).
- **Cookies:** página nueva. Explica que la web usa Google Analytics para estadísticas anónimas y cómo rechazarlas. Banner: "Uso cookies de estadística para saber qué funciona en la web. ¿Me dejas?" · Aceptar · Rechazar.

## Llamadas a la acción (reutilizables)

| Dónde | Texto | Botón |
| --- | --- | --- |
| Final de Inicio | ¿Tienes una historia que contar? | Hablemos |
| Página de servicio | (frase propia de cada servicio) | Cuéntamela |
| Ficha de proyecto | ¿Quieres algo así? | Hablemos |
| Recreaciones | ¿Y si lo próximo que creamos es tu historia? | Hablemos |
| Sobre mí | Me encantará escucharte. | Hablemos |
| Final de artículo | Si tienes un proyecto entre manos, hablemos. | Escríbeme |
| Página 404 | Este plano se quedó en la sala de montaje. | Volver al inicio |
