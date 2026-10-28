-- Tipo de bloque «colaboracion»: la página de la colaboración con JUNO Media (/juno-media), en cuatro partes
-- (apertura, relacion, valor y productora). Ver plan/esquema.md, «Tipos de bloque».
alter type public.tipo_bloque add value if not exists 'colaboracion';
