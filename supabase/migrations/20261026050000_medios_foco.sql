-- Punto de interés de una foto: en porcentaje (0 a 100) desde la izquierda y desde arriba. Es lo que queda
-- visible cuando la foto se recorta a un formato (portada, tarjeta, cabecera). Vacío = centro (50 y 50).
alter table public.medios
  add column foco_x numeric check (foco_x is null or (foco_x >= 0 and foco_x <= 100)),
  add column foco_y numeric check (foco_y is null or (foco_y >= 0 and foco_y <= 100));

comment on column public.medios.foco_x is 'Punto de interés horizontal, en % (0 izquierda, 100 derecha). Vacío = 50';
comment on column public.medios.foco_y is 'Punto de interés vertical, en % (0 arriba, 100 abajo). Vacío = 50';
