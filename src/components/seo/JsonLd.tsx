import type { Ajustes, Articulo, Proyecto, Servicio } from "@/lib/datos/tipos";
import { RUTAS } from "@/lib/rutas";
import { sinAcento, URL_SITIO, urlAbsoluta } from "@/lib/seo/url";

function ScriptJsonLd({ datos }: { datos: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos) }}
    />
  );
}

function autorPersona(ajustes?: Ajustes) {
  const redes = [
    ajustes?.redes.instagram,
    ajustes?.redes.youtube,
    ajustes?.redes.linkedin,
  ].filter((u): u is string => Boolean(u));

  return {
    "@type": "Person",
    "@id": `${URL_SITIO}/#persona`,
    name: ajustes?.nombre || "Josep Mira Lozano",
    jobTitle: ajustes?.lema || "Director de fotografía, filmmaker y editor",
    url: URL_SITIO,
    ...(ajustes?.ubicacion
      ? {
          address: {
            "@type": "PostalAddress",
            addressLocality: ajustes.ubicacion,
            addressCountry: "ES",
          },
        }
      : {}),
    ...(redes.length > 0 ? { sameAs: redes } : {}),
  };
}

/** Schema.org Person + ProfessionalService en el marco general de la web */
export function JsonLdPersona({ ajustes }: { ajustes: Ajustes }) {
  const persona = autorPersona(ajustes);
  return (
    <ScriptJsonLd
      datos={{
        "@context": "https://schema.org",
        "@graph": [
          persona,
          {
            "@type": "ProfessionalService",
            "@id": `${URL_SITIO}/#servicio-profesional`,
            name: ajustes.nombre || "Josep Mira Lozano",
            description: ajustes.lema,
            url: URL_SITIO,
            founder: { "@id": `${URL_SITIO}/#persona` },
            ...(ajustes.ubicacion ? { areaServed: ajustes.ubicacion } : {}),
          },
        ],
      }}
    />
  );
}

/** Schema.org Service (+ FAQPage si tiene preguntas frecuentes) para /servicios/[slug] */
export function JsonLdServicio({ servicio, ajustes }: { servicio: Servicio; ajustes: Ajustes }) {
  const url = urlAbsoluta(RUTAS.servicio(servicio.slug));
  const grafo: Record<string, unknown>[] = [
    {
      "@type": "Service",
      "@id": `${url}#service`,
      name: sinAcento(servicio.nombre),
      description: sinAcento(servicio.seo.descripcion || servicio.resumen || servicio.frase),
      url,
      provider: autorPersona(ajustes),
      ...(servicio.imagen ? { image: servicio.imagen.url } : {}),
      ...(ajustes.ubicacion ? { areaServed: ajustes.ubicacion } : {}),
    },
  ];

  if (servicio.preguntas.length > 0) {
    grafo.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: servicio.preguntas.map((q) => ({
        "@type": "Question",
        name: sinAcento(q.pregunta),
        acceptedAnswer: {
          "@type": "Answer",
          text: sinAcento(q.respuesta),
        },
      })),
    });
  }

  return (
    <ScriptJsonLd
      datos={{
        "@context": "https://schema.org",
        "@graph": grafo,
      }}
    />
  );
}

/** Schema.org CreativeWork para la ficha de un proyecto (/trabajos/[slug]) */
export function JsonLdProyecto({ proyecto, ajustes }: { proyecto: Proyecto; ajustes?: Ajustes }) {
  const url = urlAbsoluta(RUTAS.proyecto(proyecto.slug));
  const imagen = proyecto.imagenCabecera?.url ?? proyecto.poster?.url;
  const premios = proyecto.premios
    .map((p) => [p.nombre, p.festival, p.anio].filter(Boolean).join(" · "))
    .filter(Boolean);

  return (
    <ScriptJsonLd
      datos={{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "@id": `${url}#obra`,
        name: sinAcento(proyecto.titulo),
        description: sinAcento(proyecto.seo.descripcion || proyecto.textos.tarjeta || proyecto.textos.historia),
        url,
        inLanguage: "es",
        creator: autorPersona(ajustes),
        ...(proyecto.anio ? { dateCreated: String(proyecto.anio) } : {}),
        ...(proyecto.tipo ? { genre: proyecto.tipo.nombre } : {}),
        ...(imagen ? { image: imagen } : {}),
        ...(premios.length > 0 ? { award: premios } : {}),
      }}
    />
  );
}

/** Schema.org BlogPosting / Article para un artículo del blog (/blog/[slug]) */
export function JsonLdArticulo({ articulo, ajustes }: { articulo: Articulo; ajustes?: Ajustes }) {
  const url = urlAbsoluta(RUTAS.articulo(articulo.slug));
  return (
    <ScriptJsonLd
      datos={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${url}#articulo`,
        headline: sinAcento(articulo.titulo),
        description: sinAcento(articulo.seo.descripcion || articulo.extracto),
        datePublished: articulo.fecha,
        inLanguage: "es",
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: autorPersona(ajustes),
        publisher: autorPersona(ajustes),
        ...(articulo.imagen ? { image: [articulo.imagen.url] } : {}),
        ...(articulo.categoria ? { articleSection: articulo.categoria.nombre } : {}),
      }}
    />
  );
}
