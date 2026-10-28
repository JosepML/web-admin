// Campos de clientes, opiniones y canales de YouTube. Formato: plan/esquema.md.

import type { SeccionFormulario } from "../FormularioContenido";

export const PESTANAS_CONFIANZA = [
  { href: "/admin/clientes", nombre: "Clientes" },
  { href: "/admin/opiniones", nombre: "Opiniones" },
  { href: "/admin/canales", nombre: "Canales de YouTube" },
];

export const SECCIONES_CLIENTE: SeccionFormulario[] = [
  {
    id: "cliente",
    titulo: "Cliente",
    descripcion: "Sale en «Han confiado en mí», en Inicio.",
    campos: [
      { tipo: "texto", clave: "nombre", etiqueta: "Nombre" },
      {
        tipo: "seleccion",
        clave: "estilo",
        etiqueta: "Cómo se muestra",
        obligatorio: true,
        opciones: [
          { valor: "logo", nombre: "Con su logo" },
          { valor: "nombre", nombre: "Su nombre, en letra de la web" },
          { valor: "firma", nombre: "Su nombre en cursiva (artistas)" },
        ],
      },
      { tipo: "medio", clave: "logo_id", etiqueta: "Logo", ayuda: "Mejor en PNG o SVG con fondo transparente y en blanco. Solo se usa si eliges «Con su logo»." },
      { tipo: "numero", clave: "alto_logo", etiqueta: "Alto del logo (px)", min: 8, max: 200, placeholder: "28", ayuda: "Para igualar logos muy anchos o muy altos. Vacío = el de siempre", medio: true },
      { tipo: "enlace", clave: "enlace", etiqueta: "Su web", placeholder: "https://", medio: true },
      { tipo: "interruptor", clave: "con_juno", etiqueta: "Trabajo con JUNO Media", ayuda: "Sale en el apartado «Trabajo en sinergia con JUNO Media»" },
    ],
  },
];

export const SECCIONES_OPINION: SeccionFormulario[] = [
  {
    id: "opinion",
    titulo: "Opinión",
    descripcion: "Sale en el carrusel de opiniones de Inicio.",
    campos: [
      { tipo: "largo", clave: "texto", etiqueta: "Lo que dijo", filas: 4, ayuda: "Tal cual lo dijo. La cursiva va entre *asteriscos*" },
      { tipo: "texto", clave: "autor", etiqueta: "Quién", placeholder: "Laura y Dani", medio: true },
      { tipo: "texto", clave: "contexto", etiqueta: "De qué trabajo", placeholder: "Vídeo de boda", medio: true },
      { tipo: "proyecto", clave: "proyecto_id", etiqueta: "Proyecto relacionado", ayuda: "Opcional" },
    ],
  },
];

export const SECCIONES_CANAL: SeccionFormulario[] = [
  {
    id: "canal",
    titulo: "Canal",
    descripcion: "Sale en la sección de cifras de Inicio, junto a los premios.",
    campos: [
      { tipo: "texto", clave: "nombre", etiqueta: "Nombre del canal" },
      { tipo: "largo", clave: "texto", etiqueta: "De qué va", filas: 3 },
      { tipo: "enlace", clave: "url", etiqueta: "Enlace del canal", placeholder: "https://www.youtube.com/@…", ayuda: "Sin enlace, la tarjeta no muestra «Ver canal»" },
      { tipo: "texto", clave: "cifra", etiqueta: "Cifra", placeholder: "12.000 suscriptores", ayuda: "Opcional: vacío no se muestra" },
    ],
  },
];
