import { filas } from "./cliente";
import { getMedios, listaMedios, medio } from "./medios";
import type { Servicio } from "./tipos";
import { lista, objeto, texto, textos } from "./util";

/** Servicios publicados, en su orden */
export async function getServicios(): Promise<Servicio[]> {
  const [servicios, medios] = await Promise.all([filas("servicios"), getMedios()]);
  return servicios
    .sort((a, b) => a.orden - b.orden)
    .map((s) => ({
      id: s.id,
      slug: s.slug,
      nombre: s.nombre,
      frase: s.frase,
      resumen: s.resumen,
      mirada: textos(s.mirada),
      // La columna llega con la migración servicios_titulo_mirada; mientras, undefined
      tituloMirada: s.titulo_mirada ?? "",
      aporto: textos(s.aporto),
      paraQuien: textos(s.para_quien),
      conQuien: s.con_quien,
      pasos: lista(s.pasos).map((p) => ({ titulo: texto(objeto(p).titulo), texto: texto(objeto(p).texto) })),
      preguntas: lista(s.preguntas)
        .map((p) => ({ pregunta: texto(objeto(p).pregunta), respuesta: texto(objeto(p).respuesta) }))
        .filter((p) => p.pregunta),
      llamada: s.llamada,
      imagen: medio(medios, s.imagen_id),
      // La columna llega con la migración servicios_fotos_cabecera; mientras, undefined
      imagenApaisada: medio(medios, s.imagen_apaisada_id),
      fotosCabecera: listaMedios(medios, s.fotos_cabecera).map((x) => x.imagen),
      seo: { titulo: s.seo_titulo, descripcion: s.seo_descripcion },
    }));
}

export async function getServicio(slug: string) {
  return (await getServicios()).find((s) => s.slug === slug) ?? null;
}
