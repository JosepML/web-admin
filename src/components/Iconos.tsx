// Iconos de trazo fino, dibujados a mano para no añadir dependencias.

const TRAZOS: Record<string, React.ReactNode> = {
  sol: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  luna: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  menu: <path d="M4 8h16M4 16h16" />,
  cerrar: <path d="M6 6l12 12M18 6L6 18" />,
  flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
  izquierda: <path d="M15 6l-6 6 6 6" />,
  derecha: <path d="M9 6l6 6-6 6" />,
  ampliar: <path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5" />,
  play: <path d="M8 5.5v13l11-6.5z" fill="currentColor" />,
  correo: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.4-4.3a8.5 8.5 0 1 1 15.6-4.5z" />
      <path d="M9 8.5c0 3.5 2.9 6.5 6.5 6.5l1-1.6-2-1-1 .9a4 4 0 0 1-2.8-2.8l.9-1-1-2z" />
    </>
  ),
  ojo: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  "ojo-no": (
    <>
      <path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  papelera: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />,
  mas: <path d="M12 5v14M5 12h14" />,
  asa: (
    <>
      <circle cx="9" cy="6" r="1" fill="currentColor" />
      <circle cx="15" cy="6" r="1" fill="currentColor" />
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
      <circle cx="9" cy="18" r="1" fill="currentColor" />
      <circle cx="15" cy="18" r="1" fill="currentColor" />
    </>
  ),
  lapiz: <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4zM13.5 6.5l4 4" />,
  reiniciar: <path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4" />,
  camara: (
    <>
      <rect x="2" y="7" width="14" height="11" rx="3" />
      <path d="M16 11l6-3v9l-6-3" />
    </>
  ),
  // Claqueta: la tablilla de abajo y la pala de arriba, levantada sobre su bisagra con las rayas en diagonal (sin más detalle, para que no cargue)
  claqueta: (
    <>
      <rect x="3" y="10.5" width="18" height="9.5" rx="2" />
      <g transform="rotate(-9 3.5 10.5)">
        <rect x="3.5" y="5.5" width="17" height="5" rx="1.2" />
        <path d="M8 5.5l-2 5M12.5 5.5l-2 5M17 5.5l-2 5" />
      </g>
    </>
  ),
  ritmo: <path d="M3 12h3l2-6 4 12 3-9 2 3h4" />,
  // Laurel de festival: dos ramas curvas con hojas a cada lado
  laurel: (
    <>
      <path d="M9.5 20.5C5.5 19 3.5 15 4 10.5M14.5 20.5c4-1.5 6-5.5 5.5-10" />
      <g fill="currentColor" stroke="none">
        <ellipse cx="4.6" cy="17" rx="1.1" ry="2.1" transform="rotate(-50 4.6 17)" />
        <ellipse cx="3.3" cy="13.4" rx="1" ry="2" transform="rotate(-25 3.3 13.4)" />
        <ellipse cx="3.4" cy="9.6" rx="0.9" ry="1.9" transform="rotate(5 3.4 9.6)" />
        <ellipse cx="7.4" cy="18.8" rx="0.9" ry="1.8" transform="rotate(-80 7.4 18.8)" />
        <ellipse cx="6.1" cy="15.4" rx="0.8" ry="1.6" transform="rotate(-60 6.1 15.4)" />
        <ellipse cx="5.4" cy="11.9" rx="0.8" ry="1.6" transform="rotate(-35 5.4 11.9)" />
        <ellipse cx="19.4" cy="17" rx="1.1" ry="2.1" transform="rotate(50 19.4 17)" />
        <ellipse cx="20.7" cy="13.4" rx="1" ry="2" transform="rotate(25 20.7 13.4)" />
        <ellipse cx="20.6" cy="9.6" rx="0.9" ry="1.9" transform="rotate(-5 20.6 9.6)" />
        <ellipse cx="16.6" cy="18.8" rx="0.9" ry="1.8" transform="rotate(80 16.6 18.8)" />
        <ellipse cx="17.9" cy="15.4" rx="0.8" ry="1.6" transform="rotate(60 17.9 15.4)" />
        <ellipse cx="18.6" cy="11.9" rx="0.8" ry="1.6" transform="rotate(35 18.6 11.9)" />
      </g>
    </>
  ),
  // Panel y editor
  subir: <path d="M12 16V4M7 9l5-5 5 5M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />,
  duplicar: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="3" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  arriba: <path d="M12 19V5M6 11l6-6 6 6" />,
  abajo: <path d="M12 5v14M6 13l6 6 6-6" />,
  deshacer: <path d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" />,
  rehacer: <path d="M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h3" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  buscar: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </>
  ),
  estrella: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />,
  "estrella-llena": <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" fill="currentColor" />,
  imagen: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="9" cy="10" r="1.8" />
      <path d="M21 16l-5-5-8 9" />
    </>
  ),
  carpeta: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  historial: <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2" />,
  externo: <path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />,
  salir: <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4" />,
  rejilla: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="2" />
      <rect x="13" y="4" width="7" height="7" rx="2" />
      <rect x="4" y="13" width="7" height="7" rx="2" />
      <rect x="13" y="13" width="7" height="7" rx="2" />
    </>
  ),
  pagina: <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM14 3v5h5M9 13h6M9 17h6" />,
  alerta: <path d="M12 4l9 16H3zM12 10v4M12 17.5v.5" />,
  ajustes: <path d="M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4" />,
};

export function Icono({ nombre, className = "h-5 w-5" }: { nombre: keyof typeof TRAZOS | string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {TRAZOS[nombre]}
    </svg>
  );
}
