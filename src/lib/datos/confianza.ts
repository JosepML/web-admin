// Lo que da confianza: clientes, opiniones y canales de YouTube
import { filas } from "./cliente";
import { getMedios, medio } from "./medios";
import type { Canal, Cliente, Opinion } from "./tipos";

export async function getClientes(): Promise<Cliente[]> {
  const [clientes, medios] = await Promise.all([filas("clientes"), getMedios()]);
  return clientes
    .sort((a, b) => a.orden - b.orden)
    .map((c) => ({
      id: c.id,
      nombre: c.nombre,
      logo: medio(medios, c.logo_id),
      altoLogo: c.alto_logo,
      estilo: c.estilo,
      enlace: c.enlace,
      conJuno: c.con_juno,
    }));
}

export async function getOpiniones(): Promise<Opinion[]> {
  return (await filas("opiniones"))
    .sort((a, b) => a.orden - b.orden)
    .map((o) => ({ id: o.id, texto: o.texto, autor: o.autor, contexto: o.contexto }));
}

export async function getCanales(): Promise<Canal[]> {
  return (await filas("canales"))
    .sort((a, b) => a.orden - b.orden)
    .map((c) => ({ id: c.id, nombre: c.nombre, texto: c.texto, url: c.url, cifra: c.cifra }));
}
