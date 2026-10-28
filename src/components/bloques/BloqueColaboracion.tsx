"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useMemo, useRef } from "react";
import type { Bloque, Cliente } from "@/lib/datos/tipos";
import { RUTAS } from "@/lib/rutas";
import { lista, objeto, texto } from "@/lib/datos/util";
import { useReducir } from "../comun/hooks";
import { Enlace } from "../comun/Enlace";
import { enfoque, img } from "../comun/imagen";
import { Icono } from "../Iconos";
import { CambiarImagen, Editable, useEditando } from "../edicion/contexto";
import { useDatos } from "../marco/DatosWeb";
import { CURVA, Parrafos, Revelar, Titular, TituloConAcento } from "../piezas";
import { Logo } from "./BloquesConfianza";

/**
 * Colaboración con una productora (página /juno-media). Un mismo tipo de bloque con cuatro partes, cada una una
 * sección de la página, para poder ordenarlas y meter otras entre medias (los proyectos hechos juntos):
 * - `apertura`: los dos nombres unidos, el titular y tres fotos de proyectos hechos juntos.
 * - `relacion`: lo que nos une, en tres facetas con foto dentro de un mismo cristal (no son pasos: van a la vez).
 * - `valor`: qué gana el proyecto del cliente cuando entra la productora, y las dos formas de que entre.
 * - `productora`: la productora en sí, con su marca, su lema, su web y las marcas con las que hemos trabajado.
 * Las fotos que falten salen solas de los proyectos marcados «con JUNO Media».
 */
export function BloqueColaboracion({ bloque }: { bloque: Bloque }) {
  switch (texto(bloque.datos.parte)) {
    case "relacion":
      return <Relacion bloque={bloque} />;
    case "valor":
      return <Valor bloque={bloque} />;
    case "productora":
      return <Productora bloque={bloque} />;
    default:
      return <Apertura bloque={bloque} />;
  }
}

type Foto = { url: string; alt: string; pie?: string; href?: string; foco?: { x: number; y: number } | null };

/** Fotos de reserva: la portada de cada proyecto hecho con JUNO Media, en el orden de los trabajos */
function useFotosJuno(): Foto[] {
  const { proyectos } = useDatos();
  return useMemo(
    () =>
      proyectos
        .filter((p) => p.conJuno && p.poster)
        .map((p) => ({ url: p.poster!.url, alt: p.poster!.alt || p.titulo, pie: p.titulo, href: RUTAS.proyecto(p.slug) })),
    [proyectos],
  );
}

/** Foto elegida en el bloque (id de medio) o, si no hay, la de reserva */
function useFoto(id: unknown, reserva?: Foto): Foto | null {
  const { medios } = useDatos();
  const m = typeof id === "string" ? medios[id] : undefined;
  return m ? { url: m.url, alt: m.alt } : (reserva ?? null);
}

/** La marca de la productora tal como la escribe ella: JUNO en negrita y MEDIA fina */
function MarcaJuno({ className = "" }: { className?: string }) {
  return (
    <span className={`whitespace-nowrap ${className}`}>
      <span className="font-extrabold">JUNO</span>
      <span className="ml-[0.3em] font-light">MEDIA</span>
    </span>
  );
}

/**
 * Apertura: los dos nombres se acercan desde los lados y se unen en un aspa de cristal; debajo, el titular y la
 * entradilla. Cierra un tríptico de fotos de proyectos hechos juntos, la del centro apaisada y las de los lados
 * verticales, que suben a distinto ritmo con el scroll. Detrás, dos luces (la roja de la web y una fría) que se
 * funden despacio en el centro.
 */
function Apertura({ bloque }: { bloque: Bloque }) {
  const { antetitulo, titulo = "", texto: entrada } = bloque.datos;
  const editando = useEditando();
  const reducir = useReducir();
  const { medios, proyectos } = useDatos();
  const reserva = useFotosJuno();
  // Si la foto elegida es de un proyecto (portada o galería), lleva a su ficha y, sin pie, lleva su nombre
  const elegidas = lista(bloque.datos.imagenes).flatMap((x): Foto[] => {
    const o = objeto(x);
    const m = typeof o.medio === "string" ? medios[o.medio] : undefined;
    if (!m) return [];
    const p = proyectos.find((p) => p.poster?.id === m.id || p.galeria.some((g) => g.imagen.id === m.id));
    return [{ url: m.url, alt: m.alt || p?.titulo || "", pie: texto(o.pie) || p?.titulo, href: p ? RUTAS.proyecto(p.slug) : undefined, foco: m.foco }];
  });
  // Los proyectos elegidos a mano (su portada) mandan sobre las fotos sueltas; lo que falte lo pone la reserva
  const deProyectos = lista(bloque.datos.proyectos).flatMap((x): Foto[] => {
    const p = proyectos.find((p) => p.id === x);
    return p?.poster ? [{ url: p.poster.url, alt: p.poster.alt || p.titulo, pie: p.titulo, href: RUTAS.proyecto(p.slug), foco: p.poster.foco }] : [];
  });
  const fotos = [0, 1, 2].map((i) => deProyectos[i] ?? elegidas[i] ?? reserva[i]).filter(Boolean) as Foto[];

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yLados = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const yCentro = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const desde = (x: number) => (reducir ? { opacity: 0 } : { opacity: 0, x });

  return (
    <section ref={ref} className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-8 sm:pt-16 lg:pb-[5svh]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[70%]">
        <motion.div
          className="absolute left-1/2 top-[8%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,var(--jm-orbe-a),transparent)]"
          initial={{ x: "-95%", opacity: 0 }}
          animate={{ x: "-70%", opacity: 1 }}
          transition={{ duration: 2.4, ease: CURVA }}
        />
        <motion.div
          className="absolute left-1/2 top-[14%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,var(--jm-orbe-c),transparent)]"
          initial={{ x: "-5%", opacity: 0 }}
          animate={{ x: "-30%", opacity: 1 }}
          transition={{ duration: 2.4, ease: CURVA }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        <p className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-lg sm:gap-5 sm:text-2xl" aria-label="Josep Mira y JUNO Media">
          <motion.span className="text-right font-extrabold tracking-[-0.03em]" initial={desde(-28)} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, ease: CURVA, delay: 0.15 }}>
            Josep Mira
          </motion.span>
          <motion.span
            aria-hidden
            className="cristal flex h-9 w-9 items-center justify-center rounded-full text-xl font-light leading-none text-[var(--jm-suave)] sm:h-11 sm:w-11 sm:text-2xl"
            initial={{ opacity: 0, scale: 0.6, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.1, ease: CURVA, delay: 0.55 }}
          >
            ×
          </motion.span>
          <motion.span className="text-left tracking-[0.16em]" initial={desde(28)} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, ease: CURVA, delay: 0.15 }}>
            <MarcaJuno />
          </motion.span>
        </p>

        <Revelar retraso={0.3}>
          <h2 className="mx-auto mt-8 max-w-4xl text-[clamp(2.5rem,min(6vw,8.4svh),5.4rem)] font-extrabold leading-[1.02] tracking-[-0.045em] [text-wrap:balance]">
            <Editable campo="titulo" valor={titulo} vacio="Título">
              <TituloConAcento texto={titulo} />
            </Editable>
          </h2>
        </Revelar>
        {(antetitulo || editando) && (
          <Revelar retraso={0.36}>
            <span className="cristal mt-6 inline-flex rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--jm-suave)]">
              <Editable campo="antetitulo" valor={antetitulo} vacio="Antetítulo">
                {antetitulo}
              </Editable>
            </span>
          </Revelar>
        )}

        {(entrada || editando) && (
          <Revelar retraso={0.42}>
            <div className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[var(--jm-suave)] [text-wrap:pretty] sm:text-xl">
              <Editable campo="texto" valor={entrada} multilinea bloqueHtml vacio="Entradilla">
                <Parrafos texto={entrada ?? ""} />
              </Editable>
            </div>
          </Revelar>
        )}
      </div>

      {fotos.length === 3 && (
        <div className="relative mx-auto mt-12 grid max-w-7xl grid-cols-[1fr_1.7fr_1fr] items-center gap-2.5 sm:gap-4 lg:mt-[5svh]">
          {fotos.map((f, i) => (
            <motion.div key={`${f.url}-${i}`} style={{ y: reducir ? 0 : i === 1 ? yCentro : yLados }}>
              <Revelar retraso={0.5 + (i === 1 ? 0 : 0.15)} y={40}>
                <FotoConPie foto={f} className={i === 1 ? "aspect-[16/11] lg:aspect-auto lg:h-[min(40svh,440px)]" : "aspect-[4/5] lg:aspect-auto lg:h-[min(32svh,340px)]"} />
              </Revelar>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

/** Foto redonda con el nombre del proyecto en una pastilla; si viene de un proyecto, lleva a su ficha */
function FotoConPie({ foto, className }: { foto: Foto; className: string }) {
  const contenido = (
    <>
      <img src={img(foto.url, 1920)} alt={foto.alt} style={enfoque(foto)} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
      {foto.pie && (
        <span className="absolute bottom-2.5 left-2.5 hidden max-w-[calc(100%-1.25rem)] truncate rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md sm:bottom-4 sm:left-4 sm:block">
          {foto.pie}
        </span>
      )}
    </>
  );
  const clases = `group relative block overflow-hidden rounded-[22px] bg-[var(--jm-fondo-2)] shadow-[var(--jm-sombra)] sm:rounded-[32px] ${className}`;
  return foto.href ? (
    <Enlace href={foto.href} className={clases} aria-label={foto.pie}>
      {contenido}
    </Enlace>
  ) : (
    <div className={clases}>{contenido}</div>
  );
}

/**
 * Lo que nos une: tres facetas (profesional, artística y personal, en ese orden) dentro de un solo cristal, cada
 * una con su foto y la palabra en la letra artística. Juntas y sin números, porque no son pasos: son la misma
 * relación vista desde tres lados. En pantallas anchas, líneas finas las separan.
 */
function Relacion({ bloque }: { bloque: Bloque }) {
  const reserva = useFotosJuno();
  const facetas = lista(bloque.datos.facetas).map((x) => objeto(x));
  return (
    <section className="px-4 py-20 sm:px-8 sm:py-28 lg:py-[5svh]">
      <div className="mx-auto max-w-7xl">
        <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} texto={bloque.datos.texto} centrado />
        <Revelar retraso={0.15} className="mt-12 lg:mt-[5svh]">
          <div className="cristal grid gap-2 rounded-[40px] p-2 md:grid-cols-3 md:gap-0">
            {facetas.map((f, i) => (
              <Faceta key={i} indice={i} datos={f} reserva={reserva[(i + 3) % Math.max(reserva.length, 1)]} />
            ))}
          </div>
        </Revelar>
      </div>
    </section>
  );
}

function Faceta({ indice: i, datos, reserva }: { indice: number; datos: Record<string, unknown>; reserva?: Foto }) {
  const foto = useFoto(datos.imagen, reserva);
  const titulo = texto(datos.titulo);
  const cuerpo = texto(datos.texto);
  return (
    <motion.article
      className={`group flex flex-col ${i > 0 ? "md:border-l md:border-[var(--jm-linea)]" : ""} md:px-2`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, ease: CURVA, delay: 0.2 + i * 0.14 }}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] bg-[var(--jm-fondo-2)] lg:aspect-auto lg:h-[min(30svh,300px)]">
        {foto && (
          <img
            src={img(foto.url, 1200)}
            style={enfoque(foto)}
            alt={foto.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        )}
        <CambiarImagen campo={`facetas.${i}.imagen`} />
      </div>
      <div className="px-5 pb-7 pt-6 sm:px-6 lg:pb-8">
        <h3 className="jm-serif jm-degradado-acento inline-block pr-2 text-[2.6rem] leading-[1.1] sm:text-5xl">
          <Editable campo={`facetas.${i}.titulo`} valor={titulo} vacio="Faceta">
            {titulo}
          </Editable>
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--jm-suave)] [text-wrap:pretty] sm:text-base">
          <Editable campo={`facetas.${i}.texto`} valor={cuerpo} multilinea vacio="Texto">
            {cuerpo}
          </Editable>
        </p>
      </div>
    </motion.article>
  );
}

/**
 * Para tu proyecto: una foto grande de un rodaje a un lado, que se acerca despacio con el scroll, con la marca
 * «con JUNO Media» encima; al otro, por qué conviene una productora y las dos formas de que entre (si lo pide el
 * cliente o si lo propone Josep), en dos tarjetas de cristal.
 */
function Valor({ bloque }: { bloque: Bloque }) {
  const reserva = useFotosJuno();
  const foto = useFoto(bloque.datos.imagen, reserva[6]);
  const opciones = lista(bloque.datos.opciones).map((x) => objeto(x));
  const reducir = useReducir();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const escala = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  return (
    <section className="px-4 py-20 sm:px-8 sm:py-28 lg:py-[5svh]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <Revelar>
          <div ref={ref} className="relative aspect-[4/5] overflow-hidden rounded-[40px] bg-[var(--jm-fondo-2)] shadow-[var(--jm-sombra)] sm:aspect-[5/4] lg:aspect-auto lg:h-[min(76svh,740px)]">
            {foto && <motion.img src={img(foto.url, 1920)} alt={foto.alt} style={{ scale: reducir ? 1 : escala, ...enfoque(foto) }} className="absolute inset-0 h-full w-full object-cover [will-change:transform]" />}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
            <span className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-3.5 py-1.5 text-xs text-white backdrop-blur-md sm:bottom-7 sm:left-7">
              <span className="font-medium text-white/65">con</span>
              <MarcaJuno className="tracking-[0.14em]" />
            </span>
            <CambiarImagen campo="imagen" />
          </div>
        </Revelar>
        <div>
          <Titular antetitulo={bloque.datos.antetitulo} titulo={bloque.datos.titulo} texto={bloque.datos.texto} />
          <div className="mt-10 flex flex-col gap-3 lg:mt-[4svh]">
            {opciones.map((o, i) => (
              <Revelar key={i} retraso={0.2 + i * 0.12}>
                <div className="cristal flex gap-5 rounded-[28px] p-6 sm:p-7">
                  <span aria-hidden className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[linear-gradient(135deg,var(--jm-acento),var(--jm-calido))] shadow-[var(--jm-sombra-acento)]" />
                  <div>
                    <h3 className="text-xl font-bold tracking-[-0.025em]">
                      <Editable campo={`opciones.${i}.titulo`} valor={texto(o.titulo)} vacio="Título">
                        {texto(o.titulo)}
                      </Editable>
                    </h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--jm-suave)] [text-wrap:pretty] sm:text-base">
                      <Editable campo={`opciones.${i}.texto`} valor={texto(o.texto)} multilinea vacio="Texto">
                        {texto(o.texto)}
                      </Editable>
                    </p>
                  </div>
                </div>
              </Revelar>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Un nombre por marca: en Clientes hay alguna repetida («SOM Events» y «Som Events») */
function unicos(clientes: Cliente[]) {
  const vistos = new Set<string>();
  return clientes.filter((c) => {
    const k = c.nombre.trim().toLowerCase();
    if (vistos.has(k)) return false;
    vistos.add(k);
    return true;
  });
}

/**
 * La productora: un gran cristal con su marca escrita a todo el ancho y, debajo, su lema en la letra artística,
 * quiénes son, el botón a su web y, abajo, las marcas y artistas con los que hemos trabajado juntos (los clientes marcados
 * «con JUNO Media» en el panel).
 */
function Productora({ bloque }: { bloque: Bloque }) {
  const { clientes } = useDatos();
  const editando = useEditando();
  const { antetitulo, texto: cuerpo } = bloque.datos;
  const lema = texto(bloque.datos.lema);
  const rotulo = texto(bloque.datos.rotulo);
  const enlace = objeto(bloque.datos.enlace);
  const href = texto(enlace.href);
  const juno = unicos(clientes.filter((c) => c.conJuno));
  return (
    <section className="px-3 py-16 sm:px-6 sm:py-24 lg:py-[5svh]">
      <Revelar>
        <div className="cristal relative mx-auto max-w-7xl overflow-hidden rounded-[48px] px-6 py-14 sm:px-14 sm:py-20 lg:py-[7svh]">
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,var(--jm-orbe-c),transparent)]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-24 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(closest-side,var(--jm-orbe-b),transparent)]" />
          <div className="relative">
            {(antetitulo || editando) && (
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--jm-ante)]">
                <Editable campo="antetitulo" valor={antetitulo} vacio="Antetítulo">
                  {antetitulo}
                </Editable>
              </span>
            )}
            {/* La marca a todo el ancho; las letras se van juntando al aparecer */}
            <h2 className="mt-5 text-[clamp(2rem,9.6vw,9.5rem)] leading-[0.9] text-[var(--jm-texto)]" aria-label="JUNO Media">
              <motion.span
                className="block"
                initial={{ opacity: 0, letterSpacing: "0.22em" }}
                whileInView={{ opacity: 1, letterSpacing: "0.06em" }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: CURVA }}
              >
                <MarcaJuno />
              </motion.span>
            </h2>
            <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              {(lema || editando) && (
                <p className="jm-serif jm-degradado-acento inline-block self-start pr-2 text-4xl leading-tight sm:text-5xl">
                  <Editable campo="lema" valor={lema} vacio="Lema">
                    {lema}
                  </Editable>
                </p>
              )}
              <div>
                {(cuerpo || editando) && (
                  <div className="text-lg leading-relaxed text-[var(--jm-suave)] [text-wrap:pretty]">
                    <Editable campo="texto" valor={cuerpo} multilinea bloqueHtml vacio="Texto">
                      <Parrafos texto={cuerpo ?? ""} />
                    </Editable>
                  </div>
                )}
                {href && (
                  <a href={href} target="_blank" rel="noopener" className="boton boton-acento mt-8 px-7 py-3.5 text-sm">
                    {texto(enlace.texto) || "Visitar su web"}
                    <Icono nombre="flecha" className="h-4 w-4 -rotate-45" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {juno.length > 0 && (
            <div className="relative mt-14 border-t border-[var(--jm-linea)] pt-8 lg:mt-[6svh]">
              {(rotulo || editando) && (
                <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--jm-ante)]">
                  <Editable campo="rotulo" valor={rotulo} vacio="Rótulo de las marcas">
                    {rotulo}
                  </Editable>
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
                {juno.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: CURVA, delay: 0.1 + i * 0.04 }}
                  >
                    <Logo cliente={c} compacto />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Revelar>
    </section>
  );
}
