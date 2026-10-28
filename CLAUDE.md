# Web nueva de Josep Mira Lozano

Esta rama (`claude/project-thread-9vb26d`) contiene la web nueva en construcción. La web publicada sale de `master` y **no se toca** hasta el lanzamiento (fase 7).

El trabajo se hace por fases, una por chat. Antes de hacer nada:

1. Lee `plan/README.md` (estado de las fases y protocolo) y `plan/00-contexto.md` (objetivos, reglas, datos técnicos).
2. Lee solo el archivo de la fase que toca (`plan/fase-N-*.md`).
3. Sigue el protocolo de `plan/README.md`: marca tareas, actualiza el *Registro* de la fase y la tabla de estado al cerrar, y haz commit en esta rama.

Reglas fijas:
- Nunca hagas push a `master` ni publiques nada sin la orden expresa de Josep.
- Nunca toques el proyecto de Supabase "JML Studio" (`jgolxrpxyuxpqqdyikwb`); el de esta web es `oadmqwtnxpbotxcgzaoo`.
- Habla con Josep en español, en tono cercano.
- Comprobaciones antes de cada commit: `npm run lint`, `npx tsc --noEmit` y `npm run build`.
