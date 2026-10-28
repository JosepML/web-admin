#!/usr/bin/env python3
"""Genera supabase/datos/11-proyectos-nuevos.sql a partir de las fichas de plan/contenido/proyectos-nuevos/.

Las fotos se enlazan por el título del medio: al subir a la biblioteca, cada archivo se queda con su nombre sin
extensión como título (`ais-10-anos-01.jpg` → `ais-10-anos-01`). Si una foto aún no está subida, se salta.
Uso: python3 scripts/generar-proyectos-nuevos.py
"""
import json
import sys
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
FICHAS = RAIZ / "plan/contenido/proyectos-nuevos"
SALIDA = RAIZ / "supabase/datos/11-proyectos-nuevos.sql"

# Fotos sacadas de los vídeos (D:\VIDEOS WEB\_WEB\SUBIR): cuántas tiene cada proyecto y cuál va de portada
FOTOS = {
    "frimar-evento-fotografia": (3, 1), "flama-contenido-cinematografico-ia": (8, 2), "zorom-ia": (8, 2),
    "albir-confort-real-estate": (6, 1), "atavicas-trailer-obra-de-teatro": (8, 2), "ep-color-adrian-munoz": (8, 3),
    "el-xato-evento-boda": (8, 4), "louk-the-grill": (8, 2), "lavanderia-grupo-lon": (7, 1), "ais-10-anos": (8, 5),
    "englobe-evento-redes": (8, 3), "evento-grupo-lon-el-langui": (6, 4), "flama-benissa-video-oficial": (8, 3),
    "la-vibra-video-oficial": (8, 5), "otra-movida-video-oficial": (8, 5), "madison-video-oficial": (8, 4),
    "flama-aftermovie": (8, 1), "aguita-de-coco-visuales": (5, 1), "diferens-encuentro-2025": (8, 4),
    "locos-de-atar-ultimo-concierto": (8, 3), "consell-valencia-joventut-charla": (8, 1),
    "forecourttech-2025": (7, 5), "formacion-mario-bravo": (7, 4), "flama-la-nucia-video-oficial": (8, 4),
    "albir-confort-reels": (7, 1), "eventos-deportivos": (8, 0),  # ya tiene portada: las nuevas se añaden al final de su galería
}

VIDEOS = {
    "mandalorian-grogu-reel": [{"tipo": "youtube-short", "id": "s8m1qUtDeNE", "titulo": "Reel"}],
    "redencion": [{"tipo": "instagram", "url": "https://www.instagram.com/p/DSrquANDcfQ/", "titulo": "Tráiler"}],
    "tara": [{"tipo": "instagram", "url": "https://www.instagram.com/p/DePg7vdogPE/", "titulo": "Tráiler"}],
}

R2 = "https://pub-6f35ba056b9043b7bcb5b19b06b6a6e2.r2.dev"  # bucket público jml-videos (Cloudflare R2)


def videos_r2():
    """scripts/videos-r2.txt → {slug: [(archivo, título, principal, vertical)]}"""
    d = {}
    for linea in (RAIZ / "scripts/videos-r2.txt").read_text().splitlines():
        if linea.startswith("#") or not linea.strip():
            continue
        slug, archivo, titulo, principal, vertical = linea.split("|")
        d.setdefault(slug, []).append((archivo, titulo, principal == "1", vertical == "1"))
    return d


VIDEOS_R2 = videos_r2()

# Sin cargar: Azahara (vídeo sin terminar)
FUERA = {"azahara-video-oficial"}
OCULTOS = {"frimar-evento-fotografia", "redencion", "tara", "mandalorian-grogu-reel"}  # de momento fuera de la vista previa

SECCIONES = {"Tarjeta": "tarjeta", "El proyecto": "historia", "Decisiones clave": "como_lo_hicimos",
             "El reto": "el_reto", "Resultado": "el_resultado", "Frase final": "frase"}


def lit(v):
    if v is None:
        return "null"
    if isinstance(v, (int, bool)):
        return str(v).lower()
    return "$t$" + str(v) + "$t$"


def limpio(v):
    """Quita lo que no se publica: [pendiente] deja el campo vacío, [confirmar] se queda en las preguntas."""
    v = v.strip()
    if v.startswith("[pendiente") or v.startswith("[compañía"):
        return ""
    return re.sub(r"\s*\[confirmar[^\]]*\]", "", v)


def leer(ruta):
    texto = ruta.read_text()
    _, cabecera, cuerpo = texto.split("---", 2)
    meta = {}
    for linea in cabecera.strip().splitlines():
        clave, _, valor = linea.partition(":")
        meta[clave.strip()] = valor.strip()
    textos, actual = {}, None
    for linea in cuerpo.splitlines():
        if linea.startswith("## "):
            actual = SECCIONES.get(linea[3:].strip())
            continue
        if actual and not linea.startswith(">"):
            textos[actual] = textos.get(actual, "") + linea + "\n"
    textos = {k: v.strip() for k, v in textos.items()}
    lista = lambda v: [x.strip() for x in v.strip("[]").split(",") if x.strip()]
    anio = limpio(meta.get("año", ""))
    return {
        "slug": meta["slug"], "titulo": meta["titulo"], "tipo": meta["tipo"],
        "extra": lista(meta.get("categorias_extra", "")), "servicios": lista(meta.get("servicios", "")),
        "anio": int(anio) if anio.isdigit() else None, "direccion": limpio(meta.get("direccion", "")),
        "productora": limpio(meta.get("productora_cliente", "")), "papel": limpio(meta.get("mi_papel", "")),
        "camara": limpio(meta.get("camara", "")), "con_juno": meta.get("con_juno", "no").startswith("s"), **textos,
    }


def galeria(slug):
    n, _ = FOTOS.get(slug, (0, 0))
    titulos = ",".join(f"'{slug}-{i:02d}'" for i in range(1, n + 1))
    return f"pg_temp.gal(array[{titulos}]::text[])" if n else "'[]'::jsonb"


def portada(slug):
    n, p = FOTOS.get(slug, (0, 0))
    return f"pg_temp.foto('{slug}-{p:02d}')" if n and p else "null"


def videos_sql(slug):
    """Enlaces (YouTube, Instagram) más los vídeos propios, que se enlazan por su medio (url_origen en R2)"""
    fijos = lit(json.dumps(VIDEOS.get(slug, []), ensure_ascii=False)) + "::jsonb"
    propios = VIDEOS_R2.get(slug, [])
    if not propios:
        return fijos
    piezas = []
    for archivo, titulo, principal, vertical in propios:
        extra = ("'rol', 'principal'," if principal else "") + ("'vertical', true," if vertical else "")
        piezas.append(f"jsonb_build_object('tipo', 'archivo', {extra} 'titulo', {lit(titulo)}, 'medio', pg_temp.med('{R2}/{slug}/{archivo}'))")
    return f"{fijos} || jsonb_build_array({', '.join(piezas)})"


def sql_proyecto(f, orden):
    s = f["slug"]
    extra = ",".join(f"'{e}'" for e in f["extra"])
    extra_sql = f"array(select id from public.tipos_proyecto where idioma = 'es' and slug in ({extra}))" if extra else "'{}'::uuid[]"
    campos = {
        "slug": lit(s), "titulo": lit(f["titulo"]),
        "tipo_id": f"(select id from public.tipos_proyecto where idioma = 'es' and slug = '{f['tipo']}')",
        "categorias_extra": extra_sql, "anio": lit(f["anio"]), "direccion": lit(f["direccion"]),
        "productora": lit(f["productora"]), "papel": lit(f["papel"]), "camara": lit(f["camara"]),
        "tarjeta": lit(f.get("tarjeta", "")), "historia": lit(f.get("historia", "")),
        "como_lo_hicimos": lit(f.get("como_lo_hicimos", "")), "el_reto": lit(f.get("el_reto", "")),
        "el_resultado": lit(f.get("el_resultado", "")), "frase": lit(f.get("frase", "")), "con_juno": lit(f["con_juno"]),
        "videos": videos_sql(s),
    }
    if s == "eventos-deportivos":
        # Ya existe y está publicado: se actualizan textos y datos, y se añaden las fotos nuevas a su galería
        sets = ",\n  ".join(f"{k} = {v}" for k, v in campos.items() if k != "slug")
        return (f"-- {f['titulo']} (ya existía: se renueva)\nupdate public.proyectos set\n  {sets},\n"
                f"  galeria = galeria || (select coalesce(jsonb_agg(g), '[]'::jsonb) from jsonb_array_elements({galeria(s)}) g\n"
                f"    where not galeria @> jsonb_build_array(jsonb_build_object('medio', g ->> 'medio')))\n"
                f"where idioma = 'es' and slug = '{s}';\n")
    campos |= {"imagen_id": portada(s), "galeria": galeria(s), "orden": str(orden), "estado": "'borrador'",
               # Oculto: publicado alguna vez y luego retirado (la vista previa tampoco lo enseña)
               "publicado_en": "now()" if s in OCULTOS else "null"}
    columnas = ", ".join(campos)
    valores = ",\n  ".join(campos.values())
    actualiza = ", ".join(f"{k} = excluded.{k}" for k in campos if k not in ("slug", "orden", "estado", "publicado_en"))
    return (f"-- {f['titulo']}\ninsert into public.proyectos ({columnas})\nvalues (\n  {valores})\n"
            f"on conflict (idioma, slug) do update set {actualiza};\n")


def sql_servicios(f):
    lineas = []
    for i, srv in enumerate(f["servicios"]):
        lineas.append(
            "insert into public.proyecto_servicios (proyecto_id, servicio_id, orden, destacado) "
            f"select p.id, s.id, {100 + i}, false from public.proyectos p, public.servicios s "
            f"where p.idioma = 'es' and p.slug = '{f['slug']}' and s.slug = '{srv}' and s.idioma = 'es' "
            "on conflict (proyecto_id, servicio_id) do nothing;")
    return "\n".join(lineas) + "\n"


AJUSTES = ["forecourttech-2025", "formacion-mario-bravo", "consell-valencia-joventut-charla",
           "locos-de-atar-ultimo-concierto", "diferens-encuentro-2025", "atavicas-trailer-obra-de-teatro"]


TEXTOS_PENDIENTES = {"albir-confort-real-estate"}  # propuestas sin confirmar por Josep: no se cargan


def textos():
    """Solo textos, camara y frase final de las fichas reescritas el 2026-10-26: --textos"""
    partes = ["-- Textos completos de las fichas nuevas (respuestas de Josep del 2026-10-26). Solo textos, cámara y frase final."]
    for r in sorted(FICHAS.glob("*.md")):
        if r.stem in ("README", "cuestionario") or r.stem in TEXTOS_PENDIENTES or r.stem in OCULTOS - {"mandalorian-grogu-reel"} or r.stem in FUERA:
            continue
        f = leer(r)
        campos = {"tarjeta": f.get("tarjeta", ""), "historia": f.get("historia", ""), "como_lo_hicimos": f.get("como_lo_hicimos", ""),
                  "el_reto": f.get("el_reto", ""), "el_resultado": f.get("el_resultado", ""), "frase": f.get("frase", ""),
                  "camara": f["camara"], "papel": f["papel"]}
        sets = ",\n  ".join(f"{k} = {lit(v)}" for k, v in campos.items())
        partes.append(f"update public.proyectos set\n  {sets}\nwhere idioma = 'es' and slug = '{f['slug']}';")
    print("\n\n".join(partes))


def ajustes():
    """Solo textos y datos de las fichas ya cargadas (sin tocar portadas, galerías ni vídeos): scripts/... --ajustes"""
    partes = ["-- Ajustes de textos tras el cuestionario de Josep (2026-10-25). Solo textos y datos: no toca portadas ni vídeos."]
    for slug in AJUSTES:
        f = leer(FICHAS / f"{slug}.md")
        campos = {"titulo": f["titulo"], "anio": f["anio"], "productora": f["productora"], "papel": f["papel"],
                  "con_juno": f["con_juno"], "tarjeta": f.get("tarjeta", ""), "historia": f.get("historia", ""),
                  "como_lo_hicimos": f.get("como_lo_hicimos", ""), "el_reto": f.get("el_reto", ""),
                  "el_resultado": f.get("el_resultado", "")}
        sets = ",\n  ".join(f"{k} = {lit(v)}" for k, v in campos.items())
        partes.append(f"update public.proyectos set\n  {sets}\nwhere idioma = 'es' and slug = '{slug}';")
    ocultos = ", ".join(f"'{s}'" for s in sorted(OCULTOS - {"frimar-evento-fotografia"}))
    partes.append("-- De momento ocultos (ni en la vista previa): se vuelven a enseñar poniendo publicado_en a null\n"
                  f"update public.proyectos set publicado_en = now() where idioma = 'es' and estado = 'borrador' and slug in ({ocultos});")
    print("\n\n".join(partes))


def solo(slug):
    """Un solo proyecto (cabecera de funciones, vídeos en la biblioteca, proyecto y servicios): --solo <slug>"""
    ficha = next(leer(r) for r in FICHAS.glob("*.md") if r.stem == slug)
    cab = CABECERA.split("create function")[0].split("begin;")[0]  # solo los comentarios iniciales
    cab = "-- Proyecto suelto, generado por scripts/generar-proyectos-nuevos.py --solo " + slug + "\n"
    fun = "create or replace function" + CABECERA.split("create function", 1)[1].split("-- Vídeos propios")[0]
    medios = "\n".join(
        f"insert into public.medios (url_origen, tipo, mime, titulo) values ('{R2}/{slug}/{a}', 'video', 'video/mp4', {lit(slug + ' · ' + t)}) on conflict do nothing;"
        for a, t, _, _ in VIDEOS_R2.get(slug, []))
    orden = 20 + sorted(r.stem for r in FICHAS.glob("*.md")).index(slug)
    print(cab + fun.replace("create function", "create or replace function") + "\n" + medios + "\n\n" + sql_proyecto(ficha, orden) + sql_servicios(ficha))


def main():
    if "--textos" in sys.argv:
        return textos()
    if "--ajustes" in sys.argv:
        return ajustes()
    if "--solo" in sys.argv:
        return solo(sys.argv[sys.argv.index("--solo") + 1])
    fichas = [leer(r) for r in sorted(FICHAS.glob("*.md")) if r.stem not in ("README", "cuestionario") and r.stem not in FUERA]
    medios = "\n".join(
        f"insert into public.medios (url_origen, tipo, mime, titulo) values ('{R2}/{slug}/{a}', 'video', 'video/mp4', {lit(slug + ' · ' + t)}) on conflict do nothing;"
        for slug, lista in VIDEOS_R2.items() for a, t, _, _ in lista
    )
    partes = [CABECERA.replace("@@MEDIOS@@", medios)]
    for i, f in enumerate(fichas):
        partes.append(sql_proyecto(f, 20 + i))
        partes.append(sql_servicios(f))
    partes.append(FINAL)
    SALIDA.write_text("\n".join(partes))
    print(f"{SALIDA.relative_to(RAIZ)}: {len(fichas)} proyectos")


CABECERA = """-- Proyectos nuevos de 2025 y 2026 (generado por scripts/generar-proyectos-nuevos.py desde
-- plan/contenido/proyectos-nuevos/; no se edita a mano). Incluye la migración 20261025120000_proyectos_categorias_extra.
--
-- Antes de ejecutarlo: subir a la biblioteca las fotos de D:\\VIDEOS WEB\\_WEB\\SUBIR (todas a la vez). Se enlazan
-- por su título, que es el nombre del archivo. Las que falten se saltan; se puede repetir cuando estén.
-- Los proyectos nuevos entran como borrador: se ven en la vista previa y se publican desde el panel.
-- Repetirlo rehace los textos desde las fichas: si ya los has cambiado en el panel, no lo repitas.

begin;

-- La columna de la migración 20261025120000 (por si no se ha ejecutado: así basta con este archivo)
alter table public.proyectos add column if not exists categorias_extra uuid[] not null default '{}';

create function pg_temp.foto(t text) returns uuid language sql as $$
  select id from public.medios where titulo = t and tipo = 'imagen' order by creado_en desc limit 1 $$;
create function pg_temp.gal(titulos text[]) returns jsonb language sql as $$
  select coalesce(jsonb_agg(jsonb_build_object('medio', pg_temp.foto(t), 'pie', '') order by o), '[]'::jsonb)
  from unnest(titulos) with ordinality x(t, o) where pg_temp.foto(t) is not null $$;

create function pg_temp.med(u text) returns uuid language sql as $$ select id from public.medios where url_origen = u order by creado_en limit 1 $$;

-- Vídeos propios, alojados en el bucket público jml-videos de Cloudflare R2: cada uno entra en la biblioteca por su dirección
@@MEDIOS@@
-- Tipos nuevos (por si la migración no los creó)
insert into public.tipos_proyecto (slug, nombre, orden)
select v.slug, v.nombre, v.orden from (values ('corporativo', 'Corporativo', 10), ('visuales-e-ia', 'Visuales e IA', 11)) as v(slug, nombre, orden)
where not exists (select 1 from public.tipos_proyecto t where t.slug = v.slug);
"""

FINAL = """
-- La ficha genérica «Conciertos» se oculta: cada orquesta tiene ya la suya
update public.proyectos set estado = 'borrador' where idioma = 'es' and slug = 'conciertos';

-- Destacados de Inicio (decididos por Josep el 2026-10-25). Los nuevos salen al publicarlos.
update public.proyectos set destacado_orden = null where idioma = 'es' and destacado_orden is not null;
update public.proyectos p set destacado_orden = d.n
from (values ('y-el-ano-que-viene-que', 1), ('ep-color-adrian-munoz', 2), ('atavicas-trailer-obra-de-teatro', 3),
  ('flama-aftermovie', 4), ('kiboko', 5), ('eventos-deportivos', 6), ('mandalorian-grogu-reel', 7),
  ('flama-contenido-cinematografico-ia', 8), ('ais-10-anos', 9)) as d(slug, n)
where p.idioma = 'es' and p.slug = d.slug;

-- Página de Spots y corporativo: también los proyectos corporativos
update public.bloques b set datos = jsonb_set(b.datos, '{tipos}', '["publicidad", "corporativo"]'::jsonb)
from public.paginas pg
where pg.id = b.pagina_id and pg.slug = 'filmmaker-spots-y-corporativo' and pg.idioma = 'es' and b.tipo = 'trabajos';

-- Filtros de /trabajos: categorías nuevas «Corporativo» y «Visuales e IA»
update public.bloques b set datos = jsonb_set(b.datos, '{filtros}', (
  select jsonb_object_agg(k, case
    when k in ('todos', 'filmmaker') then v || '[{"nombre": "Corporativo", "tipos": ["corporativo"]}]'::jsonb
    else v end
    || case when k in ('todos', 'edicion') then '[{"nombre": "Visuales e IA", "tipos": ["visuales-e-ia"]}]'::jsonb else '[]'::jsonb end)
  from jsonb_each(b.datos -> 'filtros') as f(k, v)
  where true))
from public.paginas pg
where pg.id = b.pagina_id and pg.slug = 'trabajos' and pg.idioma = 'es' and b.orden = 0
  and b.datos ? 'filtros' and not (b.datos -> 'filtros' -> 'todos') @> '[{"nombre": "Corporativo"}]'::jsonb;

-- Clientes nuevos (sin logo todavía). Borrador sin publicar: se ven en la vista previa
insert into public.clientes (nombre, con_juno, orden, estado)
select v.nombre, v.juno, 30 + v.n, 'borrador' from (values
  ('AIS', true, 1), ('LOUK', true, 2), ('Englobe', true, 3), ('Agüita de Coco', false, 4), ('Las Chicas de Venus', false, 5),
  ('Alicante Light Film', false, 6), ('Diferens', true, 7), ('Neira y Santamaría', true, 8), ('Mario Bravo', false, 9)
) as v(nombre, juno, n)
where not exists (select 1 from public.clientes c where lower(c.nombre) = lower(v.nombre));

commit;
"""

if __name__ == "__main__":
    main()
