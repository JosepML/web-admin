
import type { Project, BlogPost } from './types';

export const NAV_LINKS = [
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Sobre Mí', path: '/#about' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contacto', path: '/contact' },
];

export const PROJECTS: Project[] = [
  {
    id: 'y-el-ano-que-viene-que',
    title: 'Y el año que viene, ¿qué?',
    category: ['Dirección', 'Dirección de Fotografía', 'Postproducción'],
    thumbnailUrl: 'https://i.imgur.com/ESU7wLA.jpeg',
    youtubeVideoId: 'dHp3YUb1x2I',
    context: `Este cortometraje nace de un desafío formidable: el **ESCAC Dreammakers Contest 2024 de Cupra**. El reto consistía en dar vida a una historia cinematográfica en tan solo **30 días**, partiendo de tres palabras aparentemente dispares: *Ojo, Cine y Barcelona*. Más que un simple concurso, se convirtió en la excusa perfecta para plasmar una de mis mayores pasiones, el cine, y para contar una historia íntima y personal. El proyecto, titulado **"Y el año que viene, ¿qué?"**, se convirtió en un reflejo de mi propia narrativa, una exploración de mi historia y mi profundo vínculo con el séptimo arte.`,
    role: `Como arquitecto de esta visión, asumí un rol de **"hombre orquesta"**, encargándome de todas las etapas creativas. Mis responsabilidades incluyeron:

· **Guionista**: Encargado de la concepción de la idea.

· **Director**: Liderando la visión artística y la acción en el set.

· **Director de Fotografía**: Capturando cada plano para contar la historia a través de la luz.

· **Montador**: Uniendo las piezas para crear el ritmo y la emoción de la obra.

· **Actor Protagonista**: Pieza clave para contar esta historia desde una perspectiva íntima y personal.

Contar con el **apoyo crucial de Adrià Mira Lozano y Lara Ruiz Martín** fue fundamental para que este sueño pudiera hacerse realidad.`,
    process: [`La obligada conexión con las tres palabras clave, *Ojo, Cine y Barcelona*, fue el punto de partida de un intenso proceso creativo. Tras una profunda reflexión, llegué a la conclusión de que la única forma de entrelazarlas era a través de una **narrativa profundamente personal e intimista**. Decidí adoptar un estilo de narración similar al de la icónica película **Amélie**, donde la voz en off guía al espectador por un viaje introspectivo. Para contrastar con la calidez de la voz, imprimí un **ritmo muy acelerado al montaje**, dándole un dinamismo que se alinea con la energía y la efervescencia de mi propia pasión por el cine.`],
    challenges: `El mayor desafío de este proyecto fue, sin duda, **el tiempo**. La necesidad de idear, grabar, editar y culminar el cortometraje en un plazo de solo **15 días** supuso una verdadera carrera contra el reloj. Esta experiencia me enseñó la importancia de la **eficiencia, la toma de decisiones rápidas y la resiliencia bajo presión**. Me obligó a consolidar mis habilidades técnicas y creativas en un entorno de alta demanda, demostrando que la pasión y la dedicación pueden superar cualquier barrera.`,
    results: `El esfuerzo rindió sus frutos al ser seleccionado como **finalista del concurso**. Este reconocimiento me abrió las puertas a diversas **becas de la prestigiosa ESCAC**, una de las escuelas de cine más importantes de España. Más allá de los logros externos, la mayor recompensa fue la **inmensa satisfacción personal** que me proporcionó el proyecto y los valiosos aprendizajes que me llevo. Aunque este cortometraje fue un ejercicio de ser un "hombre orquesta", se confirma una vez más que el cine y el audiovisual son, en su esencia, un **trabajo de equipo**.`,
    images: ['https://i.imgur.com/qtM2MCm.jpg', 'https://i.imgur.com/FdyOIDU.jpg'],
  },
  {
    id: '100-baladas-arkano',
    title: '100 Baladas, Arkano',
    category: ['Videoclip', 'Dirección', 'Dirección de Fotografía', 'Postproducción'],
    thumbnailUrl: 'https://i.ytimg.com/vi/AWHJJA92MXM/maxresdefault.jpg',
    youtubeVideoId: 'AWHJJA92MXM',
    context: 'Este proyecto es el videoclip del single **100 Baladas**, una canción muy personal del artista **Arkano** junto a su pareja. El videoclip fue lanzado estratégicamente el 14 de febrero, una fecha emblemática que resuena con el mensaje de la canción. La obra, producida por **JUNO Media**, se concibió como una pieza visual que complementa la letra del este single, llevando la canción a la pantalla de una manera auténtica y dinamica.',
    role: 'Como director de este proyecto, mi principal responsabilidad fue transformar la idea original de Álex Gómez en una realidad audiovisual. Asumí el rol de supervisar todos los aspectos técnicos y artísticos para asegurar que la narrativa visual estuviera en perfecta armonía con la música. Mis principales responsabilidades fueron:\n\n· **Adaptación Audiovisual:** Reinterpretando la idea original para ajustarla al formato y a los ritmos del videoclip.\n\n· **Director:** Liderando la visión artística y la acción durante el rodaje.\n\n· **Operador de Cámara:** Encargado del manejo y operación de la cámara durante el rodaje para capturar los planos.\n\n· **Edición:** Responsable de ensamblar las tomas para dar forma final al videoclip, ajustando el ritmo y la narrativa.\n\n· **Supervisión Artística:** Encargado de todos los aspectos técnicos y artísticos del proyecto.\n\nDurante el rodaje, conté con el invaluable apoyo de **Noelia Fluxà** y **Julie-Estel Soard** en la producción, lo cual fue fundamental para que el proyecto se desarrollara sin contratiempos.',
    process: ['El proceso creativo fue un ejercicio de adaptación y fluidez. Partiendo de una idea original ya establecida, mi tarea fue reinterpretarla para el formato audiovisual, asegurando que el ritmo de la edición y la estética visual se alinearan con las exigencias del videoclip. El resultado es un videoclip dinámico en el que vemos como Arkano y su novia se van acercando cada vez más.'],
    results: 'Realizar un videoclip para un artista de la talla de Arkano fue una experiencia **inmensamente gratificante**. Fue un privilegio poder contribuir con mi visión a la carrera de un referente musical. Este proyecto representa un **hito personal y profesional**, un reflejo de mi pasión por el audiovisual y una confirmación de que el trabajo duro y la dedicación pueden dar vida a proyectos de gran envergadura.',
    images: [
      'https://i.imgur.com/7Cs37zX.png',
      'https://i.imgur.com/fkGQTMm.png',
      'https://i.imgur.com/NWdrT3L.png',
      'https://i.imgur.com/6u1rfiM.png',
      'https://i.imgur.com/r00RLoG.png'
    ],
  },
  {
    id: 'el-viajero',
    title: 'El Viajero',
    category: ['Dirección', 'Dirección de Fotografía', 'Postproducción'],
    thumbnailUrl: 'https://i.ytimg.com/vi/-TZXzZCVf8Y/maxresdefault.jpg',
    youtubeVideoId: '-TZXzZCVf8Y',
    context: `**El Viajero** es un cortometraje de **ciencia ficción** que nació como un proyecto final para el **ciclo superior** de realización. Este ambicioso proyecto se llevó a cabo con un equipo mínimo de solo cuatro personas y con una premisa clara: demostrar que la falta de **presupuesto** no es una barrera para la **creatividad**. El resultado es una pieza que explora el tema de los **viajes en el tiempo** de una manera personal y visualmente impactante.\n\nEl cortometraje nos transporta a la década de los **años 50**. El protagonista, **Pedro**, es un joven y obsesivo **relojero** que finalmente logra crear su obra maestra: una **máquina del tiempo**. Sin embargo, su éxito se vuelve su peor pesadilla. El **futuro** que ha alterado se presenta ante él de forma perjudicial, y el propio Pedro del futuro viaja al pasado para advertirle sobre las dolorosas consecuencias de sus acciones, en un intento desesperado por evitar su destino.`,
    role: `Como creador de la **idea original**, **guionista** y **director**, mi visión fue la fuerza impulsora detrás de **El Viajero**. Además, asumí el rol de **director de fotografía** para asegurar que cada encuadre y cada luz comunicaran la atmósfera que habíamos imaginado. Mi trabajo consistió en coordinar al equipo, desde la concepción de la historia hasta la última fase de producción, para dar vida a este complejo universo.`,
    process: [
      `**Ambientación**: La elección de los **años 50** fue crucial para el cortometraje. Para lograr la estética de la época, utilizamos un **apartamento antiguo** y recolectamos objetos de utilería (**atrezzo**) de las casas de familiares, como un teléfono de mesa y una radio, lo que añadió una sensación de autenticidad y calidez a la ambientación.`,
      `**Fotografía e Iluminación**: La **iluminación** fue clave para diferenciar los espacios. En las escenas de la **máquina del tiempo**, optamos por una iluminación de **clave baja**. La bombilla de la máquina fue la **luz principal**, lo que no solo dio un aspecto creíble, sino que también intensificó la tensión de la escena.`,
      `**Diseño de la Máquina del Tiempo**: La máquina fue construida de **cero** por el equipo. Diseñamos cada **detalle**, incluyendo una **manivela funcional**, **engranajes** y **tuberías**. Estos elementos tenían un propósito práctico y permitían que el actor interactuara con ellos, lo que hacía la escena más **intensa** y **realista**.`,
      `**Banda Sonora**: La **música original** fue creada por **David Bellido** y **Jesus Jiménez**. La banda sonora se inspiró en el trabajo de **Ludwig Göransson** en la película **Oppenheimer**, con un motivo recurrente de "**clic de reloj**" que resonaba a lo largo de toda la historia, conectando al espectador con la temática del tiempo.`
    ],
    challenges: `El mayor desafío fue, sin duda, la falta de **presupuesto**. Nos obligó a ser **creativos** con los recursos disponibles y a encontrar soluciones ingeniosas para cada obstáculo. La construcción de la **máquina del tiempo** fue uno de los retos más grandes, ya que requería una dedicación y un ingenio que superaran la ausencia de fondos. Este reto confirmó la idea principal del proyecto: la limitación más grande en la producción de una película no es el dinero, sino la falta de **creatividad**.`,
    results: `Este proyecto no habría sido posible sin la colaboración de un **equipo talentoso** y **dedicado**:\n\n**Alba Gisbert**: Ayudante de dirección\n\n**Sebastian Alonso Perez**: Actor\n\n**Andreu Pastor**: Sonidista\n\n**Mar Garrido**: Actriz\n\n**Lara Ruiz Martin**: Actriz\n\n**El Viajero** no solo cumplió su propósito como un proyecto **académico**, sino que también demostró que es posible producir una película de **calidad** con un equipo pequeño, gran **pasión** y una **idea sólida**. El cortometraje ha sido una **lección invaluable** sobre la importancia de la **creativity** y la **colaboración** en el **cine independiente**. Además, su final abierto nos deja la puerta a una **posible secuela** que en algún futuro me gustaría llevar a cabo.`,
    images: [
      'https://i.imgur.com/YFpoep5.png',
      'https://i.imgur.com/COiqMyC.png',
      'https://i.imgur.com/JFVS8SY.png',
      'https://i.imgur.com/HjsEDrF.png',
      'https://i.imgur.com/VOWw0tD.png',
      'https://i.imgur.com/l0KwxAB.png'
    ],
  },
  {
    id: 'kiboko',
    title: 'Kiboko, Documental Cinematográfico',
    category: ['Postproducción'],
    thumbnailUrl: 'https://i.ibb.co/vx4gxGQh/Captura-de-pantalla-2026-05-12-201300.png',
    youtubeVideoId: 'O-TDpUpxIGw',
    context: 'Kiboko es un viaje documental dirigido y producido por Noelia Fluxá y Julie-Estel Soard (JUNO Media). Esta docuficción explora la esencia social y cultural de La Vila Joiosa en la década de los 80, centrándose en el mítico bar Kiboko: un refugio de libertad, música y vanguardia en tiempos convulsos. A través de la mirada de Ana, una cronista ficticia que investiga la historia del local en la actualidad, la película funde el presente y el pasado para rendir homenaje a una generación que desafió los prejuicios y construyó una nueva forma de vivir.',
    role: 'En esta obra me hice cargo de la Edición. Asumí el reto de enfrentarme a un proyecto de altísima complejidad narrativa y técnica. Mi labor principal consistió en construir un relato coherente capaz de entrelazar una gran cantidad de entrevistas reales con las escenas de ficción recreadas y la voz en off de la protagonista. Mi objetivo en la sala de montaje fue asegurar que la transición entre el testimonio documental puro y la narrativa cinematográfica fluyera con total naturalidad, manteniendo la emoción intacta.',
    process: [
      '**Estructuración del Híbrido Narrativo:** El desafío más grande en la línea de tiempo fue encontrar el equilibrio perfecto entre la realidad y la ficción. Trabajé minuciosamente el montaje para que los testimonios de las personas que vivieron el Kiboko original dialogaran de forma orgánica y constante con la trama de la cronista en el presente, sin que la historia perdiera su foco.',
      '**Gestión de la Complejidad:** La inmensa cantidad de material rodado exigió un flujo de trabajo extremadamente riguroso. Sincronizar, cribar y estructurar horas de entrevistas junto a la escenografía de ficción y la música requirió una precisión absoluta para que el mensaje de libertad y resistencia colectiva no se diluyera entre los distintos saltos temporales.',
      '**Ritmo y Nostalgia:** Para trasladar al espectador a 1986, el ritmo de edición tuvo que ajustarse al pulso de la época. Las escenas recreadas del bar exigían un montaje dinámico y vibrante, apoyado fuertemente en la banda sonora, contrastando rítmicamente con los momentos más íntimos y reflexivos de las entrevistas reales.'
    ],
    results: '',
    images: [
      'https://i.ibb.co/pB88YNSL/INICIOKIBOKO-V6-mp4-snapshot-00-12-000.jpg',
      'https://i.ibb.co/fGHZtRV6/INICIOKIBOKO-V6-mp4-snapshot-01-50-777.jpg',
      'https://i.ibb.co/yn3Y5k4T/INICIOKIBOKO-V6-mp4-snapshot-03-00-000.jpg'
    ],
    sectionTitles: {
      context: 'Contexto',
      role: 'Mi Rol',
      process: 'Proceso Creativo'
    }
  },
  {
    id: 'no-se-esta-tan-mal-lovva',
    title: 'No se está tan mal, Lovva',
    category: ['Videoclip', 'Dirección de Fotografía', 'Postproducción'],
    thumbnailUrl: 'https://i.ibb.co/nN1R7bkV/No-Se-Esta-Tan-Mal-LOVVA-V4-4k-mp4-snapshot-00-12-047.jpg',
    youtubeVideoId: '8E1R23u8jjc',
    context: 'No se está tan mal es un videoclip musical para el artista Lovva, realizado bajo la dirección de Ángela Manzano. La pieza plantea un viaje emocional hacia la aceptación personal y el amor propio. El concepto central requería construir un espacio visual seguro para el artista, una "burbuja" estética donde pudiera exponer sus emociones de forma honesta, mostrando el delicado equilibrio entre la vulnerabilidad y el empoderamiento.',
    role: 'En esta producción asumí una doble función a cargo de la Dirección de Fotografía y la Edición. Mi reto consistió en materializar desde la cámara esa sensación de intimidad y protección, para posteriormente, en la sala de montaje, unificar una gran variedad de escenarios en un flujo rítmico coherente que acompañara la delicadeza de la canción.',
    process: [
      '**La Luz como Refugio Narrativo:** La propuesta lumínica se diseñó para materializar la dualidad entre la fragilidad y la fortaleza. En lugar de una iluminación plana, opté por esculpir el espacio mediante destellos delicados, contraluces marcados y puntos de luz estratégicos. Esta decisión técnica permitió envolver al artista en una atmósfera de pureza y belleza, reforzando esa idea de "burbuja" protectora.',
      '**Texturas y Refracción Etérea:** Para visualizar la exposición de los sentimientos, jugué constantemente con la interacción de la luz sobre distintas texturas, principalmente cristales y agua. Estos elementos generaron un juego de reflejos orgánicos que enriquecieron la imagen, dotando a cada plano de una sensibilidad etérea y singular.',
      '**Despliegue Técnico y Cohesión en Montaje:** El proyecto exigió una enorme versatilidad, ya que se llegaron a construir y rodar hasta 7 sets distintos, cada uno con su propio esquema lumínico complejo. Durante la fase de edición, mi labor fue sincronizar estos siete universos visuales, asegurando que el salto entre espacios mantuviera el dinamismo necesario para un videoclip sin romper en ningún momento la atmósfera íntima y cohesionada de la obra.'
    ],
    images: [
      'https://i.ibb.co/6RLX7RwQ/No-Se-Esta-Tan-Mal-LOVVA-V4-4k-mp4-snapshot-00-05-391.jpg',
      'https://i.ibb.co/nN1R7bkV/No-Se-Esta-Tan-Mal-LOVVA-V4-4k-mp4-snapshot-00-12-047.jpg',
      'https://i.ibb.co/hJ70TfQW/No-Se-Esta-Tan-Mal-LOVVA-V4-4k-mp4-snapshot-02-20-863.jpg',
      'https://i.ibb.co/tPwcqPyC/No-Se-Esta-Tan-Mal-LOVVA-V4-4k-mp4-snapshot-00-44-400.jpg',
      'https://i.ibb.co/Wp7ZCfxz/No-Se-Esta-Tan-Mal-LOVVA-V4-4k-mp4-snapshot-01-25-345.jpg',
      'https://i.ibb.co/TDs4pBhq/No-Se-Esta-Tan-Mal-LOVVA-V4-4k-mp4-snapshot-02-41-047.jpg'
    ]
  },
  {
    id: 'el-cirujano',
    title: 'El Cirujano',
    category: ['Dirección de Fotografía'],
    thumbnailUrl: 'https://www.platinocrowdfunding.com/storage/project/5454/img/eO2uv54rRAQy1AgsNjm0ybjXLN92jg4mkW9zFxZR.png',
    youtubeVideoId: '9uyjeDnqixo',
    context: 'El Cirujano es un cortometraje de thriller creado por Kevin Ramos y Emilio Graña (Impulsos Creativos). La historia sigue a Silvia, una brillante inspectora de policía atrapada en una pesadilla: la caza de un asesino en serie que transforma a sus víctimas en macabras obras de arte. El terror psicológico alcanza su punto álgido cuando las pistas apuntan a que el monstruo podría ser su propio compañero de investigación y amante, Gabriel.',
    role: 'Como Director de Fotografía, mi objetivo fue construir un universo visual que reflejara el terror psicológico y el colapso de los personajes. Mi enfoque se alejó de una representación estrictamente naturalista para abrazar una estética altamente simbólica, donde la luz y el color actúan como un conducto directo hacia la mente retorcida del asesino.',
    process: [
      '**Estética Abrasadora y el "Rojo Infierno":** Diseñamos una propuesta visual con un enfoque abrasador para enfatizar la brutalidad oculta de la historia. En las escenas más oscuras y tensas, utilizamos un rojo visceral que evoca el mismo infierno. Esta agresiva licencia cromática actúa como una metáfora visual del peligro inminente y del descenso a la oscuridad.',
      '**La Mente como Fuente de Luz:** El planteamiento lumínico en los espacios donde el asesino consuma sus crímenes trasciende la realidad terrenal. En lugar de justificar la iluminación con lámparas o ventanas lógicas, la luz emana directamente de la psique del asesino. Es su mente la que ilumina y moldea el espacio, creando una atmósfera de pesadilla.',
      '**Dualidad Visual:** El reto fue equilibrar esta atmósfera casi sobrenatural de los crímenes con la realidad fría y analítica de la investigación policial de Silvia, acentuando mediante el contraste fotográfico la doble vida de los protagonistas y manteniendo la tensión constante del thriller.'
    ],
    images: [
      'https://www.platinocrowdfunding.com/storage/project/5454/img/eO2uv54rRAQy1AgsNjm0ybjXLN92jg4mkW9zFxZR.png',
      'https://www.platinocrowdfunding.com/storage/project/5454/img/bj9n3eW3a65uyo5krgOrW1dhpgJAtqk8bvY5x687.png',
      'https://iili.io/BmoHrCl.png'
    ]
  },
  {
    id: 'sin-piedad',
    title: 'Sin Piedad',
    category: ['Dirección de Fotografía'],
    thumbnailUrl: 'https://i.imgur.com/j3loxUV.png',
    context: 'Sin Piedad es un cortometraje de ficción dirigido por Ángela Manzano que explora las profundidades del abuso laboral y sus secuelas psicológicas desde una perspectiva onírica. La trama nos sitúa en el punto de vista del protagonista, un hombre marcado por el maltrato profesional que decide tomar una medida extrema: secuestrar a su jefa. A partir de esta premisa, la pieza se desarrolla como un viaje introspectivo sobre el límite de la resistencia humana y el trauma acumulado.',
    role: 'En este proyecto personal de Ángela Manzano, asumí la Dirección de Fotografía. Como responsable de la imagen, mi mayor reto fue traducir el estado mental fracturado del personaje en una propuesta visual coherente. Mi trabajo se centró en coordinar la luz y la composición para que cada encuadre comunicara la atmósfera angustiante necesaria para la narrativa, asegurando que el espectador habitara la opresión que vive el protagonista.',
    process: [
      '**La Atmósfera de la Angustia y el Poder:** Diseñamos una evolución lumínica donde la luz actúa como un elemento intrusivo. En las escenas de confrontación, utilizamos luces prácticas cálidas para simular normalidad, pero aplicando sombras profundas sobre el protagonista para subrayar su aislamiento frente a la figura de autoridad. Para el momento del secuestro, recurrimos a una iluminación de fondo intensa que genera un halo teatral, elevando la tensión dramática del clímax.',
      '**El Ciclorama como Lienzo de Memoria:** Gran parte del rodaje se realizó en un ciclorama blanco, con el desafío técnico de transformar un espacio neutro en múltiples escenarios emocionales mediante la iluminación.',
      '**El Limbo Corporativo:** Utilizamos una luz uniforme y fría sobre el fondo blanco para representar los recuerdos del entorno laboral. Este espacio estéril refuerza la frialdad corporativa y la crueldad de las dinámicas de oficina.',
      '**Incarcelación Visual:** En los momentos de mayor introspección, empleamos sombras duras proyectadas por persianas y tonos azulados. Esto nos permitió crear una sensación de "prisión mental" sin necesidad de paredes físicas, reforzando el tono onírico de la obra.'
    ],
    results: 'Actualmente, el cortometraje se encuentra en fase previa a su distribución oficial, con una estrategia diseñada para competir en el circuito de festivales nacionales e internacionales.',
    images: ['https://i.ibb.co/Z6sq4zns/3a45388c-c86c-4c6c-a65e-08ecc09924d4.jpg', 'https://i.ibb.co/8LbdJj5g/adfb7bc1-79ad-49fb-9085-05ed6ad25614.jpg', 'https://i.ibb.co/LX70LVX2/7858818b-410d-4e0e-b79d-2f325f66c072.jpg'],
    sectionTitles: {
      context: 'Contexto',
      role: 'Mi Rol',
      process: 'Proceso Creativo',
      results: 'Recorrido y Distribución',
    }
  },
  {
    id: 'spot-juno-media',
    title: 'EXPÁNDE(TE) — Spot Publicitario para Juno Media',
    category: ['Eventos y Publicidad', 'Dirección', 'Postproducción'],
    thumbnailUrl: 'https://i.imgur.com/Km09TG5.png',
    youtubeVideoId: 'Pa6URCIllhE',
    context: 'Este proyecto nace con el objetivo de crear el primer spot publicitario para Juno Media. La prioridad absoluta era transmitir fielmente la filosofía de la empresa: hacer "cine para sanar" y contar historias de alta calidad cinematográfica. Apostamos por una pieza narrativa y emotiva, inspirada en las grandes campañas publicitarias que desarrollan conceptos universales, con el fin de conectar profundamente tanto con empresas como con artistas.',
    role: 'En esta producción asumí la Dirección, Producción y Postproducción. Mi labor abarcó la planificación integral del proyecto: desde el desarrollo de la idea original y el guion, hasta el casting, la búsqueda de localizaciones y el montaje final. Trabajé mano a mano con el Director de Fotografía, Juan Fran, para coordinar el rodaje y asegurar que la propuesta visual estuviera perfectamente alineada con el tono mágico y emocional que requería la historia.',
    process: [
      '**Metáfora Narrativa:** La historia gira en torno a la imaginación y la creatividad. Presentamos a Juno, una niña con ideas infinitas que personifica la esencia de la productora, y a su vecino, un adulto que sufre un bloqueo creativo y que simboliza al cliente. La trama ilustra metafóricamente cómo JUNO Media interviene para desbloquear y expandir esas ideas atrapadas.',
      '**Estructura y Tono:** Estructuramos el spot en tres actos para mantener al espectador inmerso en la historia sin revelar su naturaleza publicitaria hasta el desenlace. Este giro final no solo refuerza el mensaje, sino que muestra en acción a las CEO de la productora (Noelia Fluxà y Julie-Estel Soard), quienes participan en la pieza cerrando el círculo narrativo.',
      '**El Reto de las Localizaciones:** A nivel de producción, el mayor desafío logístico fue encontrar el entorno perfecto. La historia exigía dos viviendas enfrentadas donde la habitación de la niña y el estudio del adulto estuvieran conectados visualmente a través de la ventana. Esta disposición espacial era vital para enmarcar la evolución de la relación entre los personajes.',
      '**Casting Estratégico:** Para el papel protagonista, seleccionamos a la actriz infantil Amaia Miranda por su amplia experiencia, lo cual nos garantizaba agilidad y fluidez en un rodaje intensivo. La integración de perfiles profesionales con las fundadoras reales de la marca dotó al resultado final de una capa extra de autenticidad.'
    ],
    results: '',
    images: [
      'https://i.ibb.co/Kj0zPfnz/Captura-de-pantalla-2026-05-12-183748.png',
      'https://i.ibb.co/BKjhBXkX/Captura-de-pantalla-2026-05-12-183832.png',
      'https://i.ibb.co/cjmJvQW/Captura-de-pantalla-2026-05-12-183854.png',
      'https://i.ibb.co/HLMYh8Qq/Captura-de-pantalla-2026-05-12-183915.png',
      'https://i.ibb.co/3yfgBhP9/Captura-de-pantalla-2026-05-12-183945.png',
      'https://i.ibb.co/4wMbsJyt/Captura-de-pantalla-2026-05-12-184024.png'
    ],
    sectionTitles: {
      context: 'Contexto',
      role: 'Mi Rol',
      process: 'Proceso Creativo'
    }
  },
  {
    id: 'ep-oscuridad-adrian-munoz',
    title: 'EP Oscuridad, Adrián Muñoz',
    category: ['Dirección de Fotografía', 'Videoclip'],
    thumbnailUrl: 'https://i.imgur.com/MgsvdAf.png',
    youtubeVideoId: 'At7qqcIhdHw',
    context: 'El proyecto visual para el EP Oscuridad del artista Adrián Muñoz es una obra conceptual compuesta por siete visualizers (uno para cada tema) y un tráiler promocional dirigido y producido por JUNO Media. La pieza explora las diferentes manifestaciones de la "oscuridad" que envuelven el amor y el desamor de una pareja. A través de cada canción, la narrativa visual transita por estados emocionales complejos y destructivos: el enfado, la soledad, la ruptura, los conflictos internos, las cicatrices emocionales y, finalmente, la resignación plasmada en "K le den a Cupido".',
    role: 'En esta obra me hice cargo de la Dirección de Fotografía. Mi reto principal fue traducir el viaje emocional del EP en un arco estético y lumínico coherente. Diseñé una propuesta visual que no solo funcionara para cada canción de manera individual, sino que conectara los siete vídeos a través de un descenso técnico y emocional hacia esa "oscuridad" que da título al proyecto.',
    process: [
      '**Composición en Pantalla Dividida (Split Screen):** Para el formato de los visualizers, planteamos una estructura de pantalla partida. Un lado de la imagen mostraba el playback del artista, mientras que el otro reproducía bucles narrativos (loops) sobre la historia de la pareja. A nivel fotográfico, esto requirió una planificación rigurosa del encuadre y la iluminación para que ambas mitades dialogaran perfectamente, manteniendo el equilibrio y sin saturar visualmente al espectador.',
      '**El Arco Cromático del Desamor:** La apuesta estética más fuerte del proyecto fue la evolución del color. Para reflejar la degradación de la relación, establecimos una transición progresiva a lo largo del EP: arrancamos la primera canción en color y, tema tras tema, fuimos modificando la paleta y desaturando la imagen hasta culminar la séptima canción en un puro y dramático blanco y negro.',
      '**Iluminando la Psicología de la Pareja:** Para representar conceptos abstractos como la "soledad" o las "cicatrices", los esquemas de luz se fueron adaptando a las necesidades de cada bucle narrativo. Mantuvimos siempre un contraste cuidado y atmósferas densas que arropaban la actuación del artista, logrando un acabado cinematográfico e íntimo.'
    ],
    results: '',
    images: [
      'https://i.ibb.co/Q7ZBv1XG/Captura-de-pantalla-2026-05-12-190438.png',
      'https://i.ibb.co/RdNPNMz/Captura-de-pantalla-2026-05-12-190601.png',
      'https://i.ibb.co/fd9B05gY/Captura-de-pantalla-2026-05-12-190728.png',
      'https://i.ibb.co/KccQH5Pd/Captura-de-pantalla-2026-05-12-190900.png',
      'https://i.ibb.co/rG5phXmZ/Captura-de-pantalla-2026-05-12-191105.png',
      'https://i.ibb.co/xKVznYVn/Captura-de-pantalla-2026-05-12-191155.png'
    ],
    sectionTitles: {
      context: 'Contexto',
      role: 'Mi Rol',
      process: 'Proceso Creativo'
    }
  },
  {
    id: 'sin-tiempo-peiko',
    title: 'Sin Tiempo, Peiko',
    category: ['Videoclip', 'Dirección', 'Dirección de Fotografía', 'Postproducción'],
    thumbnailUrl: 'https://i.imgur.com/uUiXiQT.png',
    youtubeVideoId: 'wCnVb2o-k7Y',
    context: 'Sin Tiempo es un videoclip narrativo y conceptual para el artista Peiko. La pieza entrelaza la interpretación musical con una intensa trama dramática que explora el paso del tiempo, las consecuencias de los actos y la pérdida de la libertad. Todo el proyecto se articula sobre una fuerte dicotomía visual entre dos mundos enfrentados, el mundo moderno, exitoso y lujoso en contraposición a uno podrido. Una critica que la propia canción hace sobre la distancia del fracaso y del éxito.',
    role: 'Como Director y Director de Fotografía en un proyecto estudiantil, mi labor consistió en concebir y ejecutar la propuesta visual y narrativa de la obra guiando a todo el equipo. Me encargué de traducir el ritmo de la canción en una rigurosa planificación técnica, asegurando que cada movimiento de cámara y decisión óptica acompañara el arco dramático del personaje y potenciara la dualidad de los espacios que exigía el guion.',
    process: [
      '**Dualidad Estética (Moderna vs. Podrida):** Diseñamos dos atmósferas opuestas para reflejar el estado del protagonista. Contrastamos la estética de la "Casa Moderna" con la ruina de la "Casa Podrida". Esta separación visual fue fundamental para ilustrar la fractura en la vida del personaje a lo largo del videoclip.',
      '**Clímax Dramático:** El desenlace visual rompe con los espacios residenciales para introducir un tono más frío y opresivo. Culmina con el artista interpretando la canción aferrado a los barrotes de una celda, cerrando el videoclip con una carga visual de encierro total.'
    ],
    results: '',
    images: [
      'https://i.ibb.co/MDqyCBQ1/Captura-de-pantalla-2026-05-12-193744.png',
      'https://i.ibb.co/Df7JzTry/Captura-de-pantalla-2026-05-12-193832.png',
      'https://i.ibb.co/q30FzfyN/Captura-de-pantalla-2026-05-12-193908.png',
      'https://i.ibb.co/7JDnD0s9/Captura-de-pantalla-2026-05-12-194115.png'
    ],
    sectionTitles: {
      context: 'Contexto',
      role: 'Mi Rol',
      process: 'Proceso Creativo'
    }
  },
  {
    id: 'cobertura-conciertos',
    title: 'Conciertos',
    category: ['Eventos y Publicidad', 'Postproducción'],
    thumbnailUrl: 'https://i.ibb.co/HDqT2xzW/Captura-de-pantalla-2026-05-12-210438.png',
    multipleVideos: [
      { id: 'na4SmBeo7X8', title: 'Miami Show' },
      { id: 'JK_tjTfrlOk', title: 'Flama' },
      { id: 'hTYKt-15v7k', title: 'Legends' }
    ],
    processVideoId: 'VdDBgDkqCio',
    context: 'La grabación de conciertos y actuaciones de orquestas de pueblo exige capturar mucho más que la música: se trata de inmortalizar la energía pura del directo. El objetivo de estas piezas, o aftermovies, es encapsular la espectacularidad del evento, la entrega de los artistas sobre el escenario y el disfrute máximo del público. Todo ello condensado en un formato visual trepidante y magnético, diseñado para atrapar al espectador desde los tres primeros segundos y transmitir la verdadera atmósfera del espectáculo.',
    role: 'En estos proyectos asumo la Grabación y Edición, aportando un valor diferencial clave: mi formación como músico. Esta base musical transforma por completo mi enfoque en la sala de montaje. No me limito a encadenar planos estéticos, sino que entiendo la estructura de las canciones desde dentro. Esto me permite jugar con los ritmos, los acentos y el dinamismo de una forma totalmente orgánica, logrando que la edición destaque sobre otras propuestas al hacer que la imagen baile al compás exacto del directo.',
    process: [
      '**El Mix Musical como Columna Vertebral:** Antes de tocar la imagen, el proceso de edición arranca creando un mix musical sólido. Se seleccionan los temas más potentes para construir un ritmo continuo que permita transitar entre canciones sin perder la inercia, introduciendo cambios de tempo estratégicos que sorprenden y reconectan constantemente la atención del espectador.',
      '**Grabación con Visión de Montaje:** La captura del evento se ejecuta siempre pensando en la edición final. Manteniendo una comunicación fluida con los artistas para conocer los momentos álgidos de su repertorio, me aseguro de registrar una gran variedad de encuadres y de captar el playback perfecto. Esta anticipación garantiza que en postproducción la sincronía entre los labios, los instrumentos y el ritmo sea impecable.',
      '**Estructura de "Sándwich" y Diseño Sonoro:** Narrativamente, la pieza se construye colocando el material más rompedor al principio para generar un impacto inmediato, y reservando la actuación más espectacular para el gran cierre, dejando a la audiencia con ganas de más. Todo el apartado visual se potencia además con un diseño sonoro inmersivo —integrando efectos y el calor del público— para que el resultado final no solo se vea, sino que se sienta como estar en primera fila.'
    ],
    challenges: '',
    results: '',
    images: [
      'https://i.ibb.co/JWs3rX1g/Captura-de-pantalla-2026-05-12-210536.png',
      'https://i.ibb.co/xKnqM1dq/Captura-de-pantalla-2026-05-12-210716.png',
      'https://i.ibb.co/HDqT2xzW/Captura-de-pantalla-2026-05-12-210438.png',
      'https://i.ibb.co/LdwnXNrm/Captura-de-pantalla-2026-05-12-210211.png'
    ],
  },
  {
    id: 'bodas-cinematograficas',
    title: 'Bodas',
    category: ['Eventos y Publicidad', 'Postproducción'],
    thumbnailUrl: 'https://i.imgur.com/uk36C7v.png',
    hideComingSoonOverlay: true,
    context: 'He tenido el placer de acompañar a numerosas parejas en su gran día, obteniendo siempre excelentes valoraciones por la sensibilidad y el compromiso con el resultado final. Mi enfoque en el sector nupcial es convertir un evento personal en una obra de cine perdurable, capturando la esencia de la celebración con una mirada profesional y cercana.',
    role: 'Como cineasta de bodas, me encargo de la cobertura integral y la edición de la pieza. Mi objetivo es que los novios se olviden de la cámara para que los momentos capturados sean auténticos, encargándome posteriormente de darles forma en un montaje que respire la misma emoción que se vivió durante el día.',
    process: [
      '**Formato "Tráiler Documental":** Mis ediciones huyen del vídeo de boda convencional y monótono. Planteo la película principal como un "tráiler documental" de aproximadamente 20 minutos. El resultado es una pieza ágil, emocionante y cargada de dinamismo que se puede disfrutar una y otra vez sin perder el interés.',
      '**Curaduría Musical:** La música es el alma de mis vídeos. Realizo una selección musical escogida siempre al milímetro, asegurándome de que cada transición y cada acorde encajen a la perfección con el gusto de los novios y el ritmo de las imágenes. Esta precisión rítmica es lo que convierte el vídeo de boda en una experiencia cinematográfica única y totalmente personalizada.'
    ],
    challenges: '',
    results: '',
    images: [
      'https://i.ibb.co/bMm8rbcx/SELECCI-N-BODA-ESTHER-Y-GUSTAVO-00-01-16-05-Imagen-fija001.jpg',
      'https://i.ibb.co/nN49j7vf/SELECCI-N-BODA-ESTHER-Y-GUSTAVO-00-15-04-22-Imagen-fija013.jpg',
      'https://i.ibb.co/GQ6HbvzY/SELECCI-N-BODA-ESTHER-Y-GUSTAVO-00-18-50-21-Imagen-fija015.jpg',
      'https://i.ibb.co/tMh0FXff/SELECCI-N-BODA-ESTHER-Y-GUSTAVO-00-20-15-09-Imagen-fija018.jpg',
      'https://i.ibb.co/kkN1z88/SELECCI-N-BODA-ESTHER-Y-GUSTAVO-00-10-43-10-Imagen-fija011.jpg',
      'https://i.ibb.co/x8swTG98/SELECCI-N-BODA-ESTHER-Y-GUSTAVO-00-44-56-14-Imagen-fija023.jpg'
    ],
  },
  {
    id: 'eventos-deportivos',
    title: 'Eventos deportivos',
    category: ['Eventos y Publicidad', 'Postproducción'],
    thumbnailUrl: 'https://i.ibb.co/YBc4tqZw/Captura-de-pantalla-2026-05-13-141447.png',
    youtubeVideoId: 'm7rbFqf9dzE',
    context: 'Los eventos deportivos de élite exigen una cobertura audiovisual que esté a la altura del rendimiento físico de sus atletas. Un claro referente de este trabajo es mi participación en competiciones de primer nivel como la Shimano Super Cup Massi de La Nucía. En este tipo de pruebas de ciclismo, la adrenalina, la velocidad y el esfuerzo extremo son los verdaderos protagonistas, y el reto consiste en capturar toda esa energía sin interferir en el desarrollo de la carrera.',
    role: 'Como filmmaker y editor en estas competiciones, asumo el desafío de realizar una cobertura integral caracterizada por una altísima intensidad, tanto a pie de pista durante la grabación como posteriormente en la sala de montaje. Mi objetivo es traducir el esfuerzo, la técnica y la tensión del deporte en piezas audiovisuales que mantengan al espectador al borde del asiento.',
    process: [
      '**Grabación de Alta Intensidad:** El rodaje de estos eventos requiere una gran agilidad técnica y física. Me posiciono estratégicamente en los puntos más críticos y espectaculares del circuito para captar la acción pura. Utilizo movimientos de cámara rápidos, seguimiento preciso y encuadres cerrados para transmitir la sensación real de velocidad y riesgo que viven los deportistas.',
      '**Paquetes de Contenido Estratégico (TV y RRSS):** Entiendo que la visibilidad de una competición es clave hoy en día. Por ello, estructuro la postproducción para entregar un pack de contenidos multiformato. Edito desde reels y clips frenéticos diseñados específicamente para el consumo rápido y la promoción en redes sociales, hasta piezas más largas y detalladas con calidad broadcast destinadas a la emisión en televisión.',
      '**Montaje Adrenalínico:** La edición de estos eventos sigue un ritmo trepidante. Sincronizo los cortes más espectaculares con una base musical contundente y potencio el sonido ambiente (el derrape de las ruedas, el esfuerzo de los corredores o el rugido del público) para construir una experiencia inmersiva que contagie la verdadera emoción del deporte.'
    ],
    images: [
      'https://i.ibb.co/YBc4tqZw/Captura-de-pantalla-2026-05-13-141447.png',
      'https://i.ibb.co/zVJMr1nJ/Captura-de-pantalla-2026-05-13-141759.png',
      'https://i.ibb.co/PsV1DzfW/Captura-de-pantalla-2026-05-13-141748.png',
      'https://i.ibb.co/bgbn1nNj/Captura-de-pantalla-2026-05-13-142016.png',
      'https://i.ibb.co/TM2cqWk3/Captura-de-pantalla-2026-05-13-141842.png'
    ]
  },
  {
    id: 'reels-rrss',
    title: 'Reels para RRSS',
    category: ['Eventos y Publicidad', 'Postproducción'],
    thumbnailUrl: 'https://rbgescuela.com/wp-content/uploads/claves-reels-atractivos-instagram.jpg',
    multipleVideos: [
      { 
        title: 'Reels para el Consell Valencià de la Joventut', 
        type: 'instagram',
        customHtml: `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DO6PXxAiivs/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/reel/DO6PXxAiivs/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">Ver esta publicación en Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/reel/DO6PXxAiivs/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">Una publicación compartida de Consell Valencià Joventut (@conselljove)</a></p></div></blockquote> <script async src="//www.instagram.com/embed.js"></script>`
      },
      { id: 's8m1qUtDeNE', title: 'Publicidad para Disney', type: 'youtube-short' },
      { id: '8mUizSJ357s', title: 'Reels para Youtubers', type: 'youtube-short' },
      { id: 'rUv-Ql7NxCQ', title: 'Reels cinematográficos', type: 'youtube-short' }
    ],
    videosBelowText: true,
    context: 'El ecosistema de las redes sociales exige un lenguaje audiovisual muy específico: rápido, magnético y en constante evolución. Con más de 9 años de experiencia en la creación de contenido digital, he producido y editado miles de vídeos diseñados para maximizar el impacto, logrando sumar cientos de miles de visualizaciones entre las diferentes piezas. Comprendo perfectamente las dinámicas de retención de audiencia y la necesidad absoluta de impactar desde el primer segundo para detener el scroll.',
    role: 'Como responsable de la Grabación y Edición de contenido vertical, me encargo de diseñar piezas optimizadas exclusivamente para el consumo móvil. Mi trayectoria me ha permitido desarrollar una gran versatilidad, adaptando mi ritmo y enfoque a perfiles radicalmente distintos: desde creadores de contenido y YouTubers, pasando por los altísimos estándares de multinacionales como Disney, hasta la comunicación más institucional y social de entidades como el Consell Valencià de la Joventut.',
    process: [
      '**El Gancho (Hook) Visual y Narrativo:** En la edición de reels o shorts, los tres primeros segundos deciden el éxito del vídeo. Estructuro el montaje para lanzar el concepto más potente o la imagen más llamativa justo al inicio, asegurando la atención inmediata del usuario y potenciando el alcance orgánico.',
      '**Dinamismo y Retención Continua:** Aplico técnicas de montaje ágil, utilizando cortes al ritmo de la música, zooms digitales invisibles y un diseño sonoro atractivo (efectos de transición, wooshes, etc.) para mantener los ojos del espectador pegados a la pantalla, eliminando cualquier punto muerto en la narrativa.',
      '**Adaptabilidad de Marca:** El proceso de grabación y edición cambia por completo según el cliente. Adapto la iluminación, el etalonaje (color), la tipografía de los subtítulos y el tono del montaje para que respiren la identidad exacta que se necesita: la frescura de un creador, la magia de una marca de entretenimiento o la claridad de un mensaje institucional.'
    ]
  },
  // Recreaciones de Películas
  {
    id: 'nosferatu-recreacion',
    title: "Recreación de un plano de 'Nosferatu' con 100€",
    category: ['Recreaciones de Películas', 'Dirección de Fotografía', 'Postproducción'],
    thumbnailUrl: 'https://i.ytimg.com/vi/3UuwHJLk60A/hq720.jpg',
    youtubeVideoId: '3UuwHJLk60A',
    context: 'Mi pasión por el cine me ha llevado a un proyecto personal muy gratificante: **recrear planos icónicos** de películas clásicas. Mi objetivo principal es demostrar que no se necesitan presupuestos de Hollywood para lograr resultados espectaculares. La verdadera magia del cine reside en el **ingenio**, la **creatividad** y, sobre todo, la **colaboración**. Con esta premisa, me embarqué en uno de mis mayores desafíos hasta la fecha: replicar una de las escenas más memorables de la película muda **Nosferatu**.',
    role: 'Como **creador del canal**, mi función principal es ser el motor de estos proyectos. Sin embargo, en esta recreación, mi rol se amplió para ser el **director y coordinador general**. Estuve a cargo de la **dirección creativa**, la **planificación** de cada toma y la **coordinación del equipo** durante la producción.\n\nEsta recreación no habría sido posible sin la colaboración de Comboi Films. Su talento, energía y visión complementaron perfectamente la mía, convirtiendo lo que podría haber sido un reto insuperable en una experiencia de aprendizaje y logro colectivo. Este proyecto es una prueba de que un equipo pequeño, motivado y bien coordinado puede alcanzar resultados de gran escala.',
    process: ['Nuestro proceso se centró en la meticulosa reproducción de cada detalle visual.\n\n**Dirección de arte y escenografía**: Buscamos elementos en el lugar de filmación que nos permitieran imitar la atmósfera de la película. Encontramos una serie de cuadros que se asemejaban a los de la escena original y los colocamos estratégicamente. Para la silueta de Nosferatu y su mano, que son la pieza central, las creamos nosotros mismos con **cartón y cinta adhesiva**. Lo más importante fue escalar su tamaño para que, al proyectarla, encajara perfectamente en la ventana de la habitación.\n\nLa "levitación" de la actriz: El plano original muestra a la protagonista en un estado de trance, levitando. Para recrear este efecto sin usar complejos efectos visuales, nuestra solución fue sorprendentemente simple: una **rampa de madera** colocada bajo el cuerpo de la actriz. Ella tuvo que **mantener su cuerpo en tensión** y **controlar su movimiento** para que la toma pareciera que estaba flotando. La clave fue el ángulo de la cámara y la iluminación para ocultar el mecanismo.\n\n**Iluminación y proyección de sombras**: Para la iluminación general de la escena, usamos un **Aputure 300D con un softbox**, que nos dio una luz suave y difusa. El verdadero truco estuvo en la sombra. Para proyectar la silueta de Nosferatu, colocamos un **spotlight** a una distancia y ángulo precisos para que la sombra se proyectara de forma nítida y definida sobre la cortina.'],
    challenges: 'El desafío más grande y el que nos llevó a la desesperación fue la cortina. En el plano de Nosferatu, la cortina se mueve de forma inquietante por el viento, lo que aumenta la tensión de la escena. La noche del rodaje, el clima no cooperó y no había ni una ráfaga de aire.\n\n**Intentos fallidos**: Probamos todo lo que se nos ocurrió: intentamos mover la cortina con hilos, e incluso con cartones, pero el movimiento nunca se veía natural ni lo suficientemente cinematográfico. La frustración crecía, ya que la toma dependía de ese detalle crucial.\n\n**La solución inesperada**: En un momento de **creatividad forzada por la desesperación**, a alguien del equipo se le ocurrió la idea de usar un **soplador de hojas**. Lo probamos y funcionó a la perfección. El soplador nos dio un **control total sobre la intensidad del "viento"** y el movimiento de la cortina. Al mismo tiempo, usamos **hilos finos** para manipular la silueta de Nosferatu y hacer que su sombra apareciera y desapareciera, **sincronizando el movimiento** de la sombra con el de la cortina.',
    results: 'Este proyecto es un testimonio de nuestra filosofía. Demostramos que con pasión, creatividad y trabajo en equipo, se pueden conseguir **resultados de gran impacto** sin grandes presupuestos. El plano final, que se ve increíblemente similar al original, no es solo una recreación, sino una **celebración del ingenio y la magia** que se puede crear detrás de una cámara.',
    images: ['https://i.imgur.com/msq9rCX.jpeg', 'https://i.imgur.com/LFhvLFT.jpeg', 'https://i.imgur.com/tEpQCep.jpeg', 'https://i.imgur.com/83XPnOI.jpeg', 'https://i.imgur.com/fluSpdh.jpeg'],
    sectionTitles: {
      context: 'Contexto',
      role: 'Mi rol',
      process: 'El proceso creativo',
      challenges: 'Superando el mayor reto: El movimiento de la cortina',
      results: 'Impacto y resultados',
    }
  },
  {
    id: 'star-wars-vader-recreacion',
    title: "Recreación del mejor plano de 'Star Wars: El Imperio Contraataca'",
    category: ['Recreaciones de Películas', 'Dirección de Fotografía', 'Postproducción'],
    thumbnailUrl: 'https://i.imgur.com/wij6Im5.jpeg',
    youtubeVideoId: 'oSHFSsmXdMw',
    context: 'Este proyecto consistió en rendir un homenaje a una escena que me ha marcado profundamente. Con motivo del 45º aniversario de Star Wars: Episodio V - El Imperio Contraataca, sentí el deseo de recrear la confrontación final entre Luke Skywalker y Darth Vader en la Ciudad Nube.\n\nSiempre he creído que el cine se trata de ingenio y creatividad, más que de grandes presupuestos. Mi objetivo con este y otros proyectos fue mostrar que, con los recursos adecuados y una buena dosis de pasión, se pueden lograr resultados asombrosos. Este proyecto fue una oportunidad perfecta para poner a prueba esa idea.',
    role: 'Mi labor en este proyecto fue un poco de todo: la concepción de la idea, la dirección y la ejecución. Desde el principio hasta el final, estuve a cargo de tomar las decisiones técnicas y creativas, adaptándome a lo que tenía disponible para lograr la visión final.',
    process: [
      '**El Set en Miniatura**: El primer gran reto fue el escenario. En lugar de intentar construir algo a tamaño real, decidí volver a la técnica clásica de las películas originales: una **maqueta en miniatura**. Me pareció la forma más auténtica de recrear el ambiente de la Ciudad Nube.',
      '**Iluminación y Enfoque**: Con la maqueta lista, me di cuenta de lo difícil que era iluminarla y enfocarla correctamente. Fue un proceso de prueba y error, ajustando el **diafragma y el ISO** de la cámara hasta que todos los elementos se veían bien. Fue un recordatorio de que, a veces, los detalles más pequeños son los que más trabajo daban.',
      '**Captura de Siluetas**: Para los personajes, opté por la técnica de la silueta. Los primeros intentos no funcionaron bien, así que tuve que improvisar. Me **moví al aire libre y usé una pared blanca** como fondo, y eso hizo toda la diferencia.',
      '**La Magia de la Post-Producción**: La fase de edición fue donde todo se unió. Con un trabajo meticuloso, **fotograma a fotograma**, añadí los sables de luz para recrear la batalla. Superponer a los personajes sobre el fondo de la maqueta fue el paso final, y fue muy gratificante ver cómo todo encajaba.'
    ],
    challenges: '',
    results: 'Este proyecto no estuvo exento de retos, como los problemas de espacio y luz, pero cada obstáculo se convirtió en una oportunidad para aprender y encontrar una solución creativa.\n\nEl resultado final fue mucho más que una simple recreación. Fue una demostración de que, con ingenio y dedicación, se pueden alcanzar grandes metas. Espero que este proyecto inspire a otros a explorar su creatividad y a darse cuenta de que **la verdadera magia del cine reside en la creatividad humana y el esfuerzo**, sin importar los recursos.',
    images: [
      'https://i.imgur.com/wij6Im5.jpeg',
      'https://i.imgur.com/RGyhSYF.jpeg',
      'https://i.imgur.com/ERa4jQL.jpeg',
      'https://i.imgur.com/r9xe36z.jpeg',
      'https://i.imgur.com/v6fA4Co.jpeg',
      'https://i.imgur.com/M3jSLQp.jpeg',
      'https://i.imgur.com/YhxMZTd.jpeg',
      'https://i.imgur.com/l4qpIaT.jpeg'
    ],
    sectionTitles: {
      context: 'Contexto del Proyecto',
      role: 'Mi Rol y los Desafíos del Proceso',
      process: 'El Proceso Creativo: Paso a Paso',
      results: 'Los Resultados y lo que Aprendí',
    }
  },
  {
    id: 'godfather-recreation',
    title: "Recreación de 'El Padrino'",
    category: ['Recreaciones de Películas', 'Dirección de Fotografía', 'Postproducción'],
    thumbnailUrl: 'https://i9.ytimg.com/vi/WnSCN4aXDKA/maxresdefault.jpg?v=679bcbdd&sqp=CIT8kdAG&rs=AOn4CLCyKnwCfs3IcWmzYzI1ecB1Be9rOg',
    youtubeVideoId: 'WnSCN4aXDKA',
    context: 'El Padrino es una de las mayores obras maestras de la historia del cine y un referente absoluto en el uso de la luz. Con el objetivo de estudiar la técnica de los grandes clásicos, decidí recrear el plano más icónico de Vito Corleone en su despacho. Este proyecto nace como un ejercicio de precisión técnica, demostrando cómo la creatividad y el control de la iluminación pueden transformar un espacio cotidiano en un set cinematográfico de alto nivel, manteniéndose fiel a la atmósfera solemne de la obra original.',
    role: 'En esta pieza asumí la Dirección y Dirección de Fotografía. Mi labor consistió en realizar un desglose exhaustivo del plano original de Gordon Willis para replicar su estética. Me encargué del diseño y construcción del set desde cero en el "sótano de las maravillas", la configuración de los esquemas de iluminación y la postproducción final, buscando la máxima fidelidad en cada textura y sombra.',
    process: [
      '**Ingeniería de Set y la Ventana:** El mayor desafío fue recrear la ventana del despacho. Ante la falta de una estructura real, utilicé la rejilla de una antigua estufa de butano. Mediante el uso de cinta negra para ensanchar las rejillas y papel de horno como difusor, logré simular el patrón de luz y el desenfoque característico del fondo original al iluminarlo con paneles LED.',
      '**Dramaturgia de la Luz:** Para conseguir la mirada en sombras de Vito Corleone, utilicé una luz Aputure 300d II con un softbox en una posición cenital muy picada. Para asegurar que las sombras fueran puras y no hubiera rebotes de luz, instalé un negativo en el suelo. Debido a que la fuente era de luz fría, ajusté la temperatura de color en cámara hacia tonos muy cálidos y compensé el fondo con geles fríos para equilibrar la atmósfera.',
      '**Composición y Atrezzo:** La escena se completó con el uso de traje, rosa y un sillón específico. Un detalle clave fue la iluminación independiente de la planta de fondo, posicionada estratégicamente para que resaltara sobre la oscuridad y aportara profundidad al encuadre, evitando que el personaje quedara empastado con el fondo negro.',
      '**Etalonaje y Reto Personal:** Dada mi condición de daltónico, la corrección de color fue un proceso de análisis comparativo riguroso. Utilicé referencias directas del fotograma original en DaVinci Resolve para igualar los tonos de piel y la densidad de las sombras, realizando ajustes precisos en postproducción (como el viraje de color de la pajarita) para garantizar una réplica visual exacta.'
    ],
    images: [
      'https://i.ibb.co/jP2769Q5/Captura-de-pantalla-2026-05-13-154204.png',
      'https://i.ibb.co/0RRp3Vbv/Captura-de-pantalla-2026-05-13-154114.png',
      'https://i.ibb.co/3ydQ8Qz8/Captura-de-pantalla-2026-05-13-154132.png'
    ],
    challenges: '',
    results: ''
  },
  {
    id: 'star-wars-hoth-recreation',
    title: "Recreación de 'Star Wars: El Imperio Contraataca' sin CGI",
    category: ['Recreaciones de Películas', 'Dirección de Fotografía', 'Postproducción'],
    thumbnailUrl: 'https://i.ytimg.com/vi/-T8Y-ESHRTs/maxresdefault.jpg',
    youtubeVideoId: '-T8Y-ESHRTs',
    context: 'Como apasionado de la saga y creador de contenido de Star Wars desde hace una década, este proyecto supuso uno de mis mayores retos creativos: recrear el plano más icónico de Luke Skywalker en la Ciudad de las Nubes sin utilizar ni un solo fotograma de CGI. La premisa fue demostrar que, con ingenio y control técnico, es posible alcanzar una estética cinematográfica de culto utilizando recursos puramente físicos y soluciones de "vieja escuela".',
    role: 'En esta pieza asumí la Dirección y Dirección de Fotografía. Mi trabajo consistió en desglosar las capas del plano original de 1980 para replicar su composición, iluminación y texturas en un entorno doméstico. Desde la construcción del atrezo hasta la postproducción final, coordiné cada detalle técnico para asegurar que las proporciones y la atmósfera lumínica fueran lo más fieles posible a la visión original de Irvin Kershner.',
    process: [
      '**Atrezo y Escenografía "Low-Cost":** Construimos los pilares de la Ciudad de las Nubes utilizando una alfombra enrollada forrada con goma Eva para obtener la textura y el color correctos. Para el complejo entramado de tuberías, recurrimos a tubos de fontanería y materiales de ferretería, utilizando estanterías domésticas para simular las estructuras superiores del set.',
      '**El Fondo: Bokeh vs Stagecraft:** Sin acceso a pantallas LED o croma, creamos el icónico fondo de luces de Bespin de forma analógica. Utilizamos un papel gris perforado manualmente con un fondo blanco iluminado detrás. El desenfoque de la lente (bokeh) transformó esos puntos de luz en los característicos halos que se ven en la película, logrando un efecto orgánico imposible de replicar digitalmente con la misma calidez.',
      '**Dramaturgia de la Luz:** La iluminación fue clave para separar al personaje del fondo. Utilizamos una pequeña luz LED magnética para crear el "contraluz" en las tuberías y resaltar las texturas. Para Luke, tras probar con luz suave, opté por un modificador más concentrado para generar las sombras duras y dramáticas que definen la escena, empleando además un "negativo" en el suelo para evitar rebotes indeseados y mantener la profundidad de los negros.',
      '**Precisión Óptica:** El proyecto exigió una repetición completa del rodaje al detectar que el uso de una lente de 85mm no respetaba las proporciones originales. Tras analizar la escena, ajustamos el equipo a un 55mm, lo que obligó a redimensionar y reencuadrar todo el set para conseguir la perspectiva exacta del Imperio Contraataca.'
    ],
    images: [
      'https://i.ibb.co/KxmsqgfX/Captura-de-pantalla-2026-05-13-154839.png',
      'https://i.ibb.co/RGtfBnFM/Captura-de-pantalla-2026-05-13-154739.png',
      'https://i.ibb.co/bgZQxQ4H/Captura-de-pantalla-2026-05-13-154720.png'
    ],
    challenges: '',
    results: ''
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'ia-artesano-audiovisual',
    title: 'El Artesano y la Inteligencia Artificial en el Cine',
    date: '13 de Mayo de 2025',
    excerpt: '¿Cómo afecta la IA a la producción audiovisual? Reflexiones sobre el futuro del cine y el trabajo artesano del videógrafo.',
    content: 'El mundo audiovisual ha sido, hasta ahora, un trabajo artesano. Pero, ¿dónde queda nuestra huella cuando una IA puede imitar en segundos un estilo que tardamos años en construir? 🖐️🤔\n\nEsa es la gran duda. En nuestro oficio, la mano, el gusto y la experiencia van puliendo una voz propia. Y aunque una Inteligencia Artificial pueda replicar una estética, difícilmente tendrá esa "alma" o esa riqueza de matices que surgen de la vivencia humana.\n\nEsta semana he estado reflexionando mucho sobre esto y creo que merece la pena pararse a pensarlo.\n\nA muchos compañeros, e incluso a mí mismo, nos genera cierto rechazo ver obras generadas al 100% por IA. A menudo se sienten vacías y de alguna manera, invasoras. Sin embargo, creo que ese rechazo viene porque estamos mirando desde el ángulo equivocado y dejando de lado su verdadero potencial.\n\nLa clave está en que no debemos ver a la IA como la "creadora". Debemos verla como el mejor asistente posible.\n\nSe trata de una herramienta poderosísima para ejecutar ideas que antes eran imposibles sin presupuestos desorbitados. La clave está en integrar la IA en el flujo de trabajo para potenciarnos a nosotros, no para sustituirnos.\n\nEstamos viendo pasos gigantes en el camino adecuado:\nMe gusta mucho el enfoque de Runway: Herramientas que buscan darnos control total sobre lo que hacemos, en lugar de dejarlo todo al azar. El potencial realmente lo veo en su capacidad de modificar el propio material que nosotros hemos grabado para incluir público en un estadio, añadir efectos visuales muy costosos o matizar la iluminación si hay algo que en rodaje no ha quedado como esperábamos. Lo mismo con lo que se pudo ver la semana pasada en Adobe Max: La integración de la IA generativa directamente en nuestros timelines.\n\nEn conclusión, creo que la tecnología cambia y avanza, pero somos nosotros los que tenemos que construir el camino haciendo un uso responsable e inteligente de ella. La Inteligencia Artificial no va a reemplazar al artesano, pero el artesano que sepa usar estas nuevas herramientas tendrá un taller mucho más potente para materializar su visión.',
  },
  {
    id: 'el-arte-de-contar-historias-con-luz',
    title: 'Dirección de Fotografía: El Arte de Contar Historias con Luz',
    date: '15 de Julio, 2024',
    excerpt: 'La iluminación cinematográfica es el pincel del DOP. Explora cómo los esquemas de luz transforman la narrativa audiovisual.',
    content: 'La iluminación es uno de los elementos más poderosos y a menudo subestimados en el cine. No se trata simplemente de hacer visible una escena; se trata de esculpir el espacio, guiar la mirada del espectador y, lo más importante, evocar emociones. Un simple cambio en la dirección o la calidad de la luz puede transformar a un personaje de héroe a villano, o un espacio de acogedor a amenazante.\n\nEn mi trabajo, me obsesiono con la luz natural y cómo replicarla o mejorarla. Estudiar cómo cae la luz en el mundo real a diferentes horas del día es una lección constante. La "hora mágica", ese breve período después del amanecer o antes del atardecer, ofrece una luz suave y difusa que es increíblemente favorecedora y poética. Sin embargo, no siempre podemos depender de ella. El verdadero desafío y arte reside en recrear esa magia con luz artificial, utilizando herramientas como difusores, reflectores y un posicionamiento cuidadoso para dar forma a cada rayo de luz. Cada proyecto es un nuevo lienzo, y la luz es siempre mi herramienta principal para contar la historia.',
  },
  {
    id: 'dslr-vs-cine-la-camara-no-hace-al-cineasta',
    title: 'DSLR vs. Cine: ¿Qué cámara elegir para videografía profesional?',
    date: '28 de Junio, 2024',
    excerpt: 'Analizamos las mejores cámaras para cineastas y videógrafos. Por qué la visión del realizador importa más que el equipo.',
    content: 'La eterna discusión en los foros de cine: ¿ARRI o RED? ¿Sony o Canon? Si bien las cámaras de cine de alta gama ofrecen una calidad de imagen y una flexibilidad increíbles en postproducción, el auge de las cámaras DSLR y mirrorless ha democratizado la creación de contenido de alta calidad. Hoy en día, es posible lograr un look cinematográfico con equipos mucho más asequibles.\n\nLo que he aprendido a lo largo de los años es que la cámara es solo una parte de la ecuación. La óptica (los lentes), la iluminación, la composición y, sobre todo, la historia, son mucho más importantes. Una historia mediocre rodada con una ARRI Alexa seguirá siendo mediocre. Una historia poderosa rodada con una DSLR bien iluminada y con una composición cuidada puede ser una obra maestra. La clave está en entender las limitaciones y fortalezas de tu equipo y usarlo de manera creativa para servir a la narrativa. Antes de obsesionarte con el último modelo de cámara, invierte tiempo en aprender los fundamentos de la cinematografía y, lo más importante, en encontrar historias que valga la pena contar.',
  },
];
