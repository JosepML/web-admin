-- Migración 20261020151832 (ya aplicada en el proyecto). Se reconstruye aquí para que el repo recoja
-- todo el historial. Si se reaplica sobre una base vacía, es idempotente.

create table if not exists ajustes (
  clave text primary key,
  valor jsonb not null,
  actualizado_en timestamptz not null default now()
);

alter table ajustes enable row level security;

create policy "Lectura pública de ajustes" on ajustes for select to anon, authenticated using (true);

insert into ajustes (clave, valor) values (
  'sitio',
  '{"nombre": "Josep Mira Lozano", "lema": "Dirección de fotografía, filmmaker y edición", "estado": "Fase 1: la web nueva está en construcción"}'
)
on conflict (clave) do nothing;
