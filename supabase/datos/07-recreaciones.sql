-- Página «recreaciones»: cabecera, SEO, etiquetas y orden del deslizador, comparaciones y título de la llamada
-- de /recreaciones (las recreaciones salen de `proyectos`, tipo «recreacion»). Escrito a mano; repetible.
--
-- comparaciones: no hay fotogramas sueltos de las películas originales, solo comparaciones ya montadas
-- (1280×720, marco blanco). `recorte` toma cada mitad, 3 px por dentro del marco y de la franja, y sin
-- los rótulos quemados (por eso Nosferatu queda en plano medio).
-- Luke y Vader no tiene comparación: enseña el póster y el vídeo. Para cambiar una, basta con poner dos
-- medios sin `recorte` (`{"original":{"medio":…},"recreacion":{"medio":…}}`).
begin;

insert into public.paginas (slug, titulo, seo_titulo, seo_descripcion, estado, publicado_en) values ('recreaciones', 'Recreaciones',
  'Recreaciones de cine · Josep Mira Lozano',
  'Recreo planos míticos del cine con muy pocos recursos: Nosferatu, El Padrino y El Imperio Contraataca, sin CGI.',
  'publicado', now())
on conflict (idioma, slug) do nothing;

insert into public.bloques (pagina_id, orden, tipo, visible, datos)
select p.id, 0, 'texto', true, $json${
  "antetitulo": "Recreaciones de cine",
  "titulo": "*Recreaciones*",
  "texto": "Recrear un plano de una gran película es la mejor escuela que conozco. Lo desmonto pieza a pieza, luz, encuadre, textura, y lo vuelvo a montar en casa con lo que tengo a mano. Así demuestro que el cine es ingenio antes que presupuesto.",
  "etiquetaAntes": "Original",
  "etiquetaDespues": "Mi recreación",
  "llamada": "¿Y si lo próximo que creamos es tu historia?",
  "orden": ["recreacion-nosferatu", "recreacion-el-padrino", "recreacion-star-wars-luke-vader", "recreacion-star-wars-sin-cgi"],
  "comparaciones": {
    "recreacion-nosferatu": {
      "tamano": [1280, 720],
      "original": { "medio": "e078d7e1-8592-4f37-acd5-712f125a2f50", "recorte": [23, 21, 612, 364] },
      "recreacion": { "medio": "e078d7e1-8592-4f37-acd5-712f125a2f50", "recorte": [645, 21, 612, 364] }
    },
    "recreacion-el-padrino": {
      "tamano": [1280, 720],
      "original": { "medio": "f458ccd4-f51f-4e81-bd81-faf54b29d3b5", "recorte": [23, 21, 611, 676] },
      "recreacion": { "medio": "f458ccd4-f51f-4e81-bd81-faf54b29d3b5", "recorte": [645, 21, 611, 676] }
    },
    "recreacion-star-wars-sin-cgi": {
      "tamano": [1280, 720],
      "original": { "medio": "7713bac7-6f19-49dd-bda7-556ed15b0767", "recorte": [23, 21, 594, 334] },
      "recreacion": { "medio": "7713bac7-6f19-49dd-bda7-556ed15b0767", "recorte": [23, 362, 594, 334] }
    }
  }
}$json$::jsonb
from public.paginas p
where p.slug = 'recreaciones' and p.idioma = 'es'
  and not exists (select 1 from public.bloques x where x.pagina_id = p.id);

commit;
