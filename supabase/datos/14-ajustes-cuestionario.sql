-- Ajustes de textos tras el cuestionario de Josep (2026-10-25). Solo textos y datos: no toca portadas ni vídeos.

update public.proyectos set
  titulo = $t$ForecourtTech 2025$t$,
  anio = 2025,
  productora = $t$ForecourtTech$t$,
  papel = $t$Grabación y edición$t$,
  con_juno = true,
  tarjeta = $t$El vídeo resumen de ForecourtTech 2025, el congreso anual sobre tecnología para estaciones de servicio, en Alicante.$t$,
  historia = $t$Para JUNO Media hice el vídeo resumen de ForecourtTech 2025, el congreso anual sobre tecnología para estaciones de servicio y tiendas de conveniencia. Se celebró el 1 y 2 de octubre en el hotel Asia Gardens, en Alicante. Ponencias, reuniones de uno a uno entre empresas, entrevistas a los asistentes y las cenas de networking, todo en inglés y montado en un solo vídeo. Llevo tres ediciones seguidas con este evento: 2024, 2025 y 2026.$t$,
  como_lo_hicimos = $t$$t$,
  el_reto = $t$$t$,
  el_resultado = $t$$t$
where idioma = 'es' and slug = 'forecourttech-2025';

update public.proyectos set
  titulo = $t$Formación de Mario Bravo, vídeo promocional$t$,
  anio = 2025,
  productora = $t$Mario Bravo$t$,
  papel = $t$Grabación y edición$t$,
  con_juno = true,
  tarjeta = $t$El vídeo promocional de una formación para agentes inmobiliarios, en horizontal y en vertical.$t$,
  historia = $t$Mario Bravo se dedica al crecimiento estratégico de agencias inmobiliarias. Para JUNO Media grabé una de sus formaciones para agentes y la convertí en un vídeo promocional, con la sesión, el trabajo en grupo y la opinión de los asistentes. Lo entregué en horizontal y en vertical.$t$,
  como_lo_hicimos = $t$$t$,
  el_reto = $t$$t$,
  el_resultado = $t$$t$
where idioma = 'es' and slug = 'formacion-mario-bravo';

update public.proyectos set
  titulo = $t$Consell Valencià de la Joventut, charla$t$,
  anio = 2025,
  productora = $t$Consell Valencià de la Joventut$t$,
  papel = $t$Grabación y edición$t$,
  con_juno = false,
  tarjeta = $t$El resumen de una charla del Consell Valencià de la Joventut, en horizontal y en vertical para redes.$t$,
  historia = $t$Para el Consell Valencià de la Joventut hice el vídeo resumen de una de sus charlas, en horizontal y en vertical, y una píldora para redes con los temas que se trataron. Grabamos entre Lara Ruiz Martín y yo.$t$,
  como_lo_hicimos = $t$$t$,
  el_reto = $t$$t$,
  el_resultado = $t$$t$
where idioma = 'es' and slug = 'consell-valencia-joventut-charla';

update public.proyectos set
  titulo = $t$Locos de Atar, el último concierto$t$,
  anio = 2025,
  productora = $t$Locos de Atar$t$,
  papel = $t$Grabación y edición$t$,
  con_juno = false,
  tarjeta = $t$El último concierto de Locos de Atar antes de despedirse para siempre.$t$,
  historia = $t$Me lo encargó JuanMi, el cantante del grupo: el vídeo resumen del concierto de Locos de Atar de 2025, el último antes de parar para siempre. Había que captar la emoción del cantante, de la banda y del público. Lara me ayudó como auxiliar.$t$,
  como_lo_hicimos = $t$- **Tres emociones.** El cantante, la banda y el público, cada uno con su espacio en el montaje.
- **Una despedida.** El vídeo tenía que guardar lo que significó esa noche para todos.$t$,
  el_reto = $t$Grabar una noche que no se iba a repetir, sabiendo que era la última.$t$,
  el_resultado = $t$$t$
where idioma = 'es' and slug = 'locos-de-atar-ultimo-concierto';

update public.proyectos set
  titulo = $t$Diferens, encuentro de equipo$t$,
  anio = 2025,
  productora = $t$Diferens$t$,
  papel = $t$Grabación y edición$t$,
  con_juno = true,
  tarjeta = $t$El resumen de un encuentro muy emocional entre los trabajadores de Diferens.$t$,
  historia = $t$Para JUNO Media hice el vídeo resumen del encuentro de Diferens, una reunión de sus trabajadores muy emocional y personal.$t$,
  como_lo_hicimos = $t$- **La emoción por delante.** El vídeo se centra en las personas y en lo que se vivió, más que en la agenda del día.$t$,
  el_reto = $t$$t$,
  el_resultado = $t$$t$
where idioma = 'es' and slug = 'diferens-encuentro-2025';

update public.proyectos set
  titulo = $t$Atávicas. Mujeres de Lorca hacia la libertad$t$,
  anio = 2026,
  productora = $t$Neira y Santamaría$t$,
  papel = $t$Grabación y edición$t$,
  con_juno = true,
  tarjeta = $t$El vídeo promocional de la obra de teatro Atávicas: un tráiler de cine, dinámico, de la propia función.$t$,
  historia = $t$Para JUNO Media hice el vídeo promocional oficial de *Atávicas. Mujeres de Lorca hacia la libertad*, la obra de la compañía Neira y Santamaría, de la que ya llevamos dos ediciones. El encargo principal era el vídeo resumen, y además la obra entera grabada en plano fijo. Grabamos el ensayo y la función en una misma tarde.$t$,
  como_lo_hicimos = $t$- **Dos cámaras, dos entregas.** Una cámara fija para la obra completa y otra en movimiento para el vídeo resumen.
- **Diversidad de encuadres.** Muchos planos y tamaños distintos para que el tráiler tenga ritmo.
- **El sonido de la obra.** El montaje usa el propio sonido de la función, para que sea inmersivo.
- **Una narrativa cortita con clímax.** El vídeo llega a los mismos clímax que tiene la obra.$t$,
  el_reto = $t$Sacar en una sola tarde, entre el ensayo y la función, la obra completa y el material para un tráiler de cine.$t$,
  el_resultado = $t$$t$
where idioma = 'es' and slug = 'atavicas-trailer-obra-de-teatro';

-- De momento ocultos (ni en la vista previa): se vuelven a enseñar poniendo publicado_en a null
update public.proyectos set publicado_en = now() where idioma = 'es' and estado = 'borrador' and slug in ('mandalorian-grogu-reel', 'redencion', 'tara');


-- Clientes: se quitan los tres «SOM Events» repetidos en borrador y se queda el publicado, el que tiene logo
delete from public.clientes
where id in ('563a0520-7a8c-46b9-9a61-5eee3e9d3e23', 'ea8f88ae-8023-4404-9358-c34dd8508afa', '284b0f08-873c-4f3c-9340-6b862e76b153')
  and estado = 'borrador' and nombre = 'SOM Events';
