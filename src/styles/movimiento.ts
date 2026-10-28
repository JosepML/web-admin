// Curvas y duraciones de movimiento para motion. Son las mismas que --jm-curva, --jm-curva-viaje y las
// duraciones de src/styles/tokens.css: si se cambia una, se cambia la otra.

/** Curva de toda la web: salida rápida y llegada suave */
export const CURVA = [0.22, 1, 0.36, 1] as const;

/** Deslizamientos largos (carrusel de Selección, scroll mágico) */
export const CURVA_VIAJE = [0.65, 0, 0.25, 1] as const;

/** Duraciones en segundos */
export const DURACION = {
  rapida: 0.3,
  media: 0.5,
  lenta: 0.7,
  entrada: 0.9,
  viaje: 0.6,
} as const;
