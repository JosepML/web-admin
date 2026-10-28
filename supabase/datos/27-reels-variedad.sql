-- Reels para redes (2026-10-26): más variedad. El reel del Consell Valencià sale del vídeo de R2 (no de Instagram) y se suman
-- Lavandería de Grupo LON, El Langui con Grupo LON y Shimano Super Cup Massi. Ya aplicado en la base de datos; este archivo es el registro.
update public.proyectos set videos = $j$[
 {"tipo":"archivo","medio":"7d0c34f6-4683-476d-8a3c-961525197809","titulo":"Reels para el Consell Valencià de la Joventut"},
 {"tipo":"archivo","medio":"7f13f700-55d6-48ff-bf08-889ad3840fde","titulo":"Lavandería de Grupo LON","vertical":true},
 {"tipo":"archivo","medio":"88f4dbb6-730a-43c0-be0a-146744cb09c6","titulo":"El Langui con Grupo LON","vertical":true},
 {"tipo":"archivo","medio":"48c3982c-dbab-4162-8b13-207896f8743d","titulo":"Shimano Super Cup Massi"},
 {"id":"s8m1qUtDeNE","tipo":"youtube-short","titulo":"Publicidad para Disney"},
 {"id":"8mUizSJ357s","tipo":"youtube-short","titulo":"Reels para Youtubers"},
 {"id":"rUv-Ql7NxCQ","tipo":"youtube-short","titulo":"Reels cinematográficos"}
]$j$::jsonb where idioma = 'es' and slug = 'reels-redes-sociales';
