"use client";

import { useEffect } from "react";

// La web antigua usaba rutas con # (`/#/project/<id>`, `/#/portfolio`, `/#about`, etc.).
// El servidor no recibe el fragmento #, así que se traduce en el cliente al cargar y reemplaza la entrada del historial.
const RUTAS_FIJAS: Record<string, string> = {
  "/": "/",
  "/portfolio": "/trabajos",
  "/recreaciones": "/recreaciones",
  "/recreations": "/recreaciones",
  "/about": "/sobre-mi",
  "/blog": "/blog",
  "/contact": "/contacto",
  "/thanks": "/gracias",
  "/privacy": "/privacidad",
};

// Proyectos cuyo `id` en la web antigua (`legacy/constants.ts`) cambió de nombre al pasar a `slug` en la web nueva.
// Si además se cambiara algún otro en la base de datos, `/trabajos/[slug]` también busca por `id_antiguo` y redirige.
const PROYECTOS_ANTIGUOS: Record<string, string> = {
  "spot-juno-media": "expandete-spot-juno-media",
  "cobertura-conciertos": "conciertos",
  "bodas-cinematograficas": "bodas",
  "reels-rrss": "reels-redes-sociales",
  "nosferatu-recreacion": "recreacion-nosferatu",
  "star-wars-vader-recreacion": "recreacion-star-wars-luke-vader",
  "godfather-recreation": "recreacion-el-padrino",
  "star-wars-hoth-recreation": "recreacion-star-wars-sin-cgi",
};

const ARTICULOS_RETIRADOS = new Set(["dslr-vs-cine-la-camara-no-hace-al-cineasta"]);

export function RedireccionAntigua() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    if (hash === "#about") {
      window.location.replace("/sobre-mi");
      return;
    }

    const m = hash.match(/^#(\/[^?#]*)/);
    if (!m) return;
    const ruta = m[1].replace(/\/+$/, "") || "/";

    const proyecto = ruta.match(/^\/project\/([^/]+)$/);
    if (proyecto) {
      const id = decodeURIComponent(proyecto[1]);
      const slug = PROYECTOS_ANTIGUOS[id] ?? id;
      window.location.replace(`/trabajos/${encodeURIComponent(slug)}`);
      return;
    }

    const articulo = ruta.match(/^\/blog\/([^/]+)$/);
    if (articulo) {
      const id = decodeURIComponent(articulo[1]);
      window.location.replace(ARTICULOS_RETIRADOS.has(id) ? "/blog" : `/blog/${encodeURIComponent(id)}`);
      return;
    }

    const destino = RUTAS_FIJAS[ruta];
    if (destino) {
      window.location.replace(destino);
    }
  }, []);
  return null;
}
