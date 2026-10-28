// Prototipo D · Cristal. Los datos tienen la misma forma que las tablas de la base de datos (fase 4):
// ajustes, servicios, proyectos, articulos, opiniones y, sobre todo, `bloques`: la portada (y cualquier
// página) es una lista ordenada de bloques que Josep puede reordenar, ocultar, editar o crear desde el panel.
// Textos de plan/contenido/ (servicio-*.md, inicio.md, mapa-de-contenido.md).

export type ServicioD = {
  slug: string;
  nombre: string;
  frase: string;
  resumen: string;
  mirada: string[];
  aporto: string[];
  paraQuien: string[];
  conQuien: string;
  pasos: { titulo: string; texto: string }[];
  preguntas: { p: string; r: string }[];
  llamada: string;
};

export type ProyectoD = {
  slug: string;
  titulo: string;
  tipo: string;
  servicios: string[];
  anio?: number;
  direccion: string;
  productora: string;
  papel: string;
  camara?: string;
  /** Vídeo completo; algunos proyectos (Bodas, Sin Piedad) aún no tienen */
  youtubeId?: string;
  inicioClip?: number;
  poster: string;
  fotogramas: string[];
  frase: string;
  laurel?: { premio: string; festival: string };
};

/** `imagen`: portada del artículo (fotograma propio de Josep siempre que encaje con el tema) */
export type ArticuloD = { slug: string; titulo: string; fecha: string; resumen: string; categoria: string; imagen: string };

export const AJUSTES = {
  nombre: "Josep Mira Lozano",
  whatsapp: "34618867115",
  correo: "josep.mira@gmail.com",
  reel: { youtubeId: "dHp3YUb1x2I", inicio: 12, poster: "https://i.imgur.com/ESU7wLA.jpeg" },
};

export const SERVICIOS: ServicioD[] = [
  {
    slug: "direccion-de-fotografia",
    nombre: "Dirección de fotografía",
    frase: "La luz cuenta la mitad de la historia.",
    resumen: "Decido qué siente quien mira: la luz, el encuadre y el color al servicio de tu historia.",
    mirada: [
      "Para mí la fotografía no es hacer planos bonitos. Es decidir qué siente quien mira. Una sombra que no deja ver del todo un rostro, un contraluz que protege a alguien, un color que incomoda sin que sepas por qué: ahí está el oficio.",
      "Antes de encender un foco me siento con la dirección a entender la historia. En El Cirujano llevamos el rojo hasta el infierno para meternos en la cabeza del asesino. En No se está tan mal fue justo lo contrario: una luz suave, casi una burbuja, para que el artista pudiera abrirse. Cada historia me pide un lenguaje distinto, y encontrarlo es lo que más disfruto.",
    ],
    aporto: [
      "Una propuesta visual propia, con referencias, paleta y tratamiento de la luz",
      "El desglose de cámara y luz secuencia a secuencia",
      "La elección de cámara, ópticas y material según lo que la historia necesita",
      "La dirección del equipo de cámara y eléctricos en rodaje",
      "El acompañamiento del color hasta el final, para que el look llegue intacto",
    ],
    paraQuien: ["Cortometrajes", "Videoclips", "Spots"],
    conQuien: "Directoras y directores de cortos, artistas que preparan un videoclip y marcas que quieren que su spot se sienta cine.",
    pasos: [
      { titulo: "Escucho", texto: "Me cuentas la historia, el tono y lo que quieres que sienta el espectador." },
      { titulo: "Imagino", texto: "Te propongo una mirada: referencias, luz, encuadres." },
      { titulo: "Ruedo", texto: "Me encargo de la imagen para que tú puedas centrarte en dirigir." },
      { titulo: "Cuido el final", texto: "Acompaño el color para que el resultado sea el que soñamos." },
    ],
    preguntas: [
      { p: "¿Cómo sabes qué luz necesita una historia?", r: "Leyendo el guion muchas veces y hablando mucho con quien dirige. La técnica viene después; primero tiene que haber una idea de qué queremos contar con cada plano." },
      { p: "¿Con qué equipo trabajas?", r: "Tengo equipo propio de cámara e iluminación. Pero el equipo lo decide la historia: si un proyecto pide algo que no tengo, se alquila y se incluye en el presupuesto." },
      { p: "¿Se puede hacer cine con pocos medios?", r: "Es lo que llevo años demostrando con mis recreaciones: una rejilla de estufa y papel de horno pueden ser la ventana de Vito Corleone. El ingenio también se ve en pantalla." },
      { p: "¿Haces también el etalonaje?", r: "Puedo hacerlo yo o acompañar a quien lo haga, para que la imagen final sea la que diseñamos en rodaje." },
      { p: "¿Dónde trabajas?", r: "Trabajo desde Alicante en toda la Comunidad Valenciana, y donde me lleve la historia." },
    ],
    llamada: "¿Tienes una historia que necesita luz?",
  },
  {
    slug: "filmmaker",
    nombre: "Filmmaker",
    frase: "Me sumo a tu historia, o te ayudo a encontrarla.",
    resumen: "Me sumo a tu equipo o llevo el proyecto de principio a fin: idea, rodaje y montaje, siempre con mirada de cine.",
    mirada: [
      "Como filmmaker puedo acompañar todo el viaje: la idea, el rodaje y el montaje. Me gusta porque el concepto va creciendo de principio a fin sin perderse por el camino. Y si ya tienes una idea entre manos, me sumo con las mismas ganas: el cine se hace entre muchos, y cada mirada suma.",
      "Vídeo corporativo, un videoclip, una orquesta en fiestas, una carrera de ciclismo o una boda: en todos busco la historia que hay dentro. Vengo de la música, así que ruedo pensando ya en el montaje. Y cuando toca grabar momentos reales, intento que la gente se olvide de la cámara, porque lo auténtico es lo que luego emociona.",
    ],
    aporto: [
      "Me integro en tu equipo y en tu forma de trabajar desde el primer día de rodaje",
      "La idea y el guion, si aún no existen",
      "Un rodaje discreto cuando hace falta y ambicioso cuando se puede",
      "Montaje, color y sonido con el mismo cuidado, o el material ordenado para tu montador",
      "Versiones para redes sacadas del mismo material",
    ],
    paraQuien: ["Productoras", "Empresas y marcas", "Particulares", "Compañeros de profesión", "Artistas", "Eventos"],
    conQuien: "Sobre todo con productoras y compañeros de profesión que necesitan a alguien de confianza en su rodaje. También con empresas y marcas, artistas y grupos, organizadores de eventos y competiciones, y particulares: parejas que quieren una película de su boda o cualquiera con algo que celebrar o contar.",
    pasos: [
      { titulo: "Escucho", texto: "Qué quieres contar, a quién y dónde se va a ver." },
      { titulo: "Propongo", texto: "Si el proyecto ya tiene rumbo, me adapto a él; si no, te propongo una idea y cómo rodarla." },
      { titulo: "Ruedo", texto: "Con la mirada puesta ya en el montaje." },
      { titulo: "Entrego", texto: "Monto y afino contigo hasta que te emocione, o te dejo el material listo para tu montaje." },
    ],
    preguntas: [
      { p: "¿Te sumas a proyectos de otros?", r: "Sí, y es buena parte de mi trabajo. Productoras y compañeros me llaman como filmmaker o como operador de cámara, y me adapto a la dirección, al equipo y a los tiempos del rodaje." },
      { p: "¿Necesito tener la idea clara?", r: "No. Muchas veces la mejor idea sale de la primera conversación. Tú me cuentas qué quieres provocar y yo te propongo cómo contarlo." },
      { p: "¿Qué tipo de proyectos haces?", r: "Vídeo corporativo y spots, videoclips, conciertos, eventos, deporte, bodas, contenido para redes y encargos de particulares. Si se puede contar con una cámara, hablemos." },
      { p: "¿Qué tiene de distinto un vídeo tuyo de boda?", r: "Lo planteo como un tráiler documental de unos 20 minutos, con la música elegida al milímetro. Una película que apetezca volver a ver, no un resumen del día." },
      { p: "¿Y en conciertos y eventos?", r: "Antes de tocar la imagen construyo la música. Así la edición respira con el directo y te sientes en primera fila." },
      { p: "¿Dónde trabajas?", r: "Trabajo desde Alicante en toda la Comunidad Valenciana, y donde me lleve la historia." },
    ],
    llamada: "¿Tienes algo que contar, o un rodaje en marcha?",
  },
  {
    slug: "edicion",
    nombre: "Edición",
    frase: "El ritmo es lo que hace que no puedas dejar de mirar.",
    resumen: "Percusionista desde los 3 años: monto con el ritmo por dentro, como una partitura.",
    mirada: [
      "El montaje es donde la historia se escribe por última vez. Puedes tener los mejores planos del mundo y que no emocionen, o unas pocas imágenes que te atrapen. La diferencia está en el ritmo.",
      "Toco la percusión desde los 3 años, y eso se nota cuando monto. No encadeno planos bonitos: construyo una partitura. En Kiboko tuve que tejer horas de entrevistas reales con escenas de ficción sin que se notaran las costuras. En los aftermovies de conciertos, lo que busco es que la imagen baile al compás del directo.",
    ],
    aporto: [
      "Una lectura del material para encontrar la historia que hay dentro",
      "Un montaje con estructura y ritmo pensados para dónde se va a ver",
      "El color, para que la imagen tenga una identidad",
      "El sonido y la música, que son la mitad de lo que sentimos",
      "Versiones para redes cuando hacen falta",
    ],
    paraQuien: ["Documentales", "Aftermovies", "Redes"],
    conQuien: "Productoras y directores con un documental, corto o videoclip ya rodado, artistas y eventos que quieren un aftermovie, y creadores y marcas que necesitan contenido con alma.",
    pasos: [
      { titulo: "Escucho", texto: "Me pasas el material y me cuentas qué quieres provocar." },
      { titulo: "Busco la historia", texto: "Reviso todo y te enseño una primera estructura." },
      { titulo: "Afinamos", texto: "Ritmo, música y color, con tus comentarios." },
      { titulo: "Entrego", texto: "En los formatos que necesites." },
    ],
    preguntas: [
      { p: "¿Qué hace que un montaje funcione?", r: "Que no se note. Que el espectador sienta lo que tiene que sentir sin darse cuenta de por qué. Eso se consigue con ritmo, y el ritmo se entrena." },
      { p: "¿Puedo encargarte solo el color o solo el sonido?", r: "Sí, puedo encargarme solo de una parte de la postproducción." },
      { p: "¿Editas contenido para redes con regularidad?", r: "Sí. He editado para creadores, YouTubers, Disney y el Consell Valencià de la Joventut." },
      { p: "¿Cómo te paso el material?", r: "Por un enlace de descarga o en disco si es mucho." },
    ],
    llamada: "¿Tienes material esperando su historia?",
  },
];

export const PROYECTOS: ProyectoD[] = [
  {
    slug: "y-el-ano-que-viene-que",
    titulo: "Y el año que viene, ¿qué?",
    tipo: "Cortometraje",
    servicios: ["direccion-de-fotografia", "filmmaker", "edicion"],
    anio: 2024,
    direccion: "Josep Mira Lozano",
    productora: "Proyecto propio · ESCAC Dreammakers, Cupra",
    papel: "Guion, dirección, fotografía y montaje",
    camara: "Sony FX3 · Tamron",
    youtubeId: "dHp3YUb1x2I",
    inicioClip: 30,
    poster: "https://i.imgur.com/ESU7wLA.jpeg",
    fotogramas: ["https://i.imgur.com/ESU7wLA.jpeg", "https://i.imgur.com/qtM2MCm.jpg", "https://i.imgur.com/FdyOIDU.jpg"],
    frase: "Un concurso me pidió tres palabras. Le respondí con *mi historia*.",
    laurel: { premio: "Podio", festival: "ESCAC Dreammakers 2024" },
  },
  {
    slug: "100-baladas-arkano",
    titulo: "100 Baladas, Arkano",
    tipo: "Videoclip",
    servicios: ["filmmaker", "direccion-de-fotografia", "edicion"],
    direccion: "Josep Mira Lozano (idea de Álex Gómez)",
    productora: "JUNO Media",
    papel: "Dirección, cámara y montaje",
    camara: "Sony FX3 · Tamron",
    youtubeId: "AWHJJA92MXM",
    inicioClip: 25,
    poster: "https://i.ytimg.com/vi/AWHJJA92MXM/maxresdefault.jpg",
    fotogramas: [
      "https://i.ytimg.com/vi/AWHJJA92MXM/maxresdefault.jpg",
      "https://i.imgur.com/7Cs37zX.png",
      "https://i.imgur.com/fkGQTMm.png",
      "https://i.imgur.com/NWdrT3L.png",
      "https://i.imgur.com/6u1rfiM.png",
      "https://i.imgur.com/r00RLoG.png",
    ],
    frase: "Todo el videoclip cabe en un solo gesto: *acercarse*.",
  },
  {
    slug: "el-cirujano",
    titulo: "El Cirujano",
    tipo: "Cortometraje",
    servicios: ["direccion-de-fotografia"],
    direccion: "Kevin Ramos y Emilio Graña",
    productora: "Impulsos Creativos",
    papel: "Dirección de fotografía",
    camara: "Sony FX3 · Tamron",
    youtubeId: "9uyjeDnqixo",
    inicioClip: 40,
    poster: "https://www.platinocrowdfunding.com/storage/project/5454/img/eO2uv54rRAQy1AgsNjm0ybjXLN92jg4mkW9zFxZR.png",
    fotogramas: [
      "https://www.platinocrowdfunding.com/storage/project/5454/img/eO2uv54rRAQy1AgsNjm0ybjXLN92jg4mkW9zFxZR.png",
      "https://www.platinocrowdfunding.com/storage/project/5454/img/bj9n3eW3a65uyo5krgOrW1dhpgJAtqk8bvY5x687.png",
      // El tercer fotograma (iili.io/BmoHrCl.png) ya no existe en su servidor: pendiente de que Josep pase otro
    ],
    frase: "Iluminé los crímenes como los vería *el asesino*.",
    laurel: { premio: "Mejor fotografía", festival: "On Duty International Film Festival" },
  },
  {
    slug: "no-se-esta-tan-mal-lovva",
    titulo: "No se está tan mal, Lovva",
    tipo: "Videoclip",
    servicios: ["direccion-de-fotografia", "edicion"],
    direccion: "Ángela Manzano",
    productora: "Proyecto propio",
    papel: "Fotografía y montaje",
    camara: "Sony FX3 · Tamron",
    youtubeId: "8E1R23u8jjc",
    inicioClip: 44,
    poster: "https://i.ibb.co/nN1R7bkV/No-Se-Esta-Tan-Mal-LOVVA-V4-4k-mp4-snapshot-00-12-047.jpg",
    fotogramas: [
      "https://i.ibb.co/6RLX7RwQ/No-Se-Esta-Tan-Mal-LOVVA-V4-4k-mp4-snapshot-00-05-391.jpg",
      "https://i.ibb.co/hJ70TfQW/No-Se-Esta-Tan-Mal-LOVVA-V4-4k-mp4-snapshot-02-20-863.jpg",
      "https://i.ibb.co/tPwcqPyC/No-Se-Esta-Tan-Mal-LOVVA-V4-4k-mp4-snapshot-00-44-400.jpg",
      "https://i.ibb.co/Wp7ZCfxz/No-Se-Esta-Tan-Mal-LOVVA-V4-4k-mp4-snapshot-01-25-345.jpg",
      "https://i.ibb.co/TDs4pBhq/No-Se-Esta-Tan-Mal-LOVVA-V4-4k-mp4-snapshot-02-41-047.jpg",
    ],
    frase: "Una canción vulnerable necesitaba una luz *que la protegiera*.",
  },
  {
    slug: "ep-oscuridad-adrian-munoz",
    titulo: "EP Oscuridad, Adrián Muñoz",
    tipo: "Videoclip",
    servicios: ["direccion-de-fotografia"],
    direccion: "JUNO Media",
    productora: "JUNO Media",
    papel: "Dirección de fotografía",
    camara: "Sony FX3 · Tamron y Sony",
    youtubeId: "At7qqcIhdHw",
    inicioClip: 30,
    poster: "https://i.imgur.com/MgsvdAf.png",
    fotogramas: [
      "https://i.imgur.com/MgsvdAf.png",
      "https://i.ibb.co/Q7ZBv1XG/Captura-de-pantalla-2026-05-12-190438.png",
      "https://i.ibb.co/RdNPNMz/Captura-de-pantalla-2026-05-12-190601.png",
      "https://i.ibb.co/fd9B05gY/Captura-de-pantalla-2026-05-12-190728.png",
      "https://i.ibb.co/KccQH5Pd/Captura-de-pantalla-2026-05-12-190900.png",
      "https://i.ibb.co/rG5phXmZ/Captura-de-pantalla-2026-05-12-191105.png",
      "https://i.ibb.co/xKVznYVn/Captura-de-pantalla-2026-05-12-191155.png",
    ],
    frase: "Siete canciones y un color que se apaga hasta el *blanco y negro*.",
    laurel: { premio: "1,39 M visualizaciones", festival: "YouTube y plataformas" },
  },
  {
    slug: "kiboko",
    titulo: "Kiboko",
    tipo: "Documental",
    servicios: ["edicion"],
    anio: 2026,
    direccion: "Noelia Fluxá y Julie-Estel Soard",
    productora: "JUNO Media y Arca Films",
    papel: "Montaje",
    camara: "Solo montaje (rodado en ARRI)",
    youtubeId: "O-TDpUpxIGw",
    inicioClip: 30,
    poster: "https://i.ibb.co/vx4gxGQh/Captura-de-pantalla-2026-05-12-201300.png",
    fotogramas: [
      "https://i.ibb.co/vx4gxGQh/Captura-de-pantalla-2026-05-12-201300.png",
      "https://i.ibb.co/pB88YNSL/INICIOKIBOKO-V6-mp4-snapshot-00-12-000.jpg",
      "https://i.ibb.co/fGHZtRV6/INICIOKIBOKO-V6-mp4-snapshot-01-50-777.jpg",
      "https://i.ibb.co/yn3Y5k4T/INICIOKIBOKO-V6-mp4-snapshot-03-00-000.jpg",
    ],
    frase: "Memoria real y ficción, montadas para que no se vean *las costuras*.",
    laurel: { premio: "Nominación a mejor montaje", festival: "Festival pendiente" },
  },
  {
    slug: "expandete-spot-juno-media",
    titulo: "EXPÁNDE(TE)",
    tipo: "Publicidad",
    servicios: ["filmmaker", "edicion"],
    direccion: "Josep Mira Lozano",
    productora: "JUNO Media",
    papel: "Guion, dirección y montaje",
    camara: "Blackmagic Pocket 6K Pro",
    youtubeId: "Pa6URCIllhE",
    poster: "https://i.imgur.com/Km09TG5.png",
    fotogramas: [
      "https://i.imgur.com/Km09TG5.png",
      "https://i.ibb.co/Kj0zPfnz/Captura-de-pantalla-2026-05-12-183748.png",
      "https://i.ibb.co/BKjhBXkX/Captura-de-pantalla-2026-05-12-183832.png",
      "https://i.ibb.co/cjmJvQW/Captura-de-pantalla-2026-05-12-183854.png",
      "https://i.ibb.co/HLMYh8Qq/Captura-de-pantalla-2026-05-12-183915.png",
      "https://i.ibb.co/3yfgBhP9/Captura-de-pantalla-2026-05-12-183945.png",
      "https://i.ibb.co/4wMbsJyt/Captura-de-pantalla-2026-05-12-184024.png",
    ],
    frase: "Un anuncio que se gana la atención *antes de pedirla*.",
  },
  {
    slug: "sin-tiempo-peiko",
    titulo: "Sin Tiempo, Peiko",
    tipo: "Videoclip",
    servicios: ["filmmaker", "direccion-de-fotografia", "edicion"],
    direccion: "Josep Mira Lozano",
    productora: "Proyecto de estudios",
    papel: "Dirección y fotografía",
    camara: "Canon C200 · 50 mm",
    youtubeId: "wCnVb2o-k7Y",
    poster: "https://i.imgur.com/uUiXiQT.png",
    fotogramas: [
      "https://i.imgur.com/uUiXiQT.png",
      "https://i.ibb.co/MDqyCBQ1/Captura-de-pantalla-2026-05-12-193744.png",
      "https://i.ibb.co/Df7JzTry/Captura-de-pantalla-2026-05-12-193832.png",
      "https://i.ibb.co/q30FzfyN/Captura-de-pantalla-2026-05-12-193908.png",
      "https://i.ibb.co/7JDnD0s9/Captura-de-pantalla-2026-05-12-194115.png",
    ],
    frase: "Del lujo a *los barrotes*, al ritmo de una canción.",
  },
  {
    slug: "el-viajero",
    titulo: "El Viajero",
    tipo: "Cortometraje",
    servicios: ["filmmaker", "direccion-de-fotografia", "edicion"],
    direccion: "Josep Mira Lozano",
    productora: "Proyecto de fin de ciclo, IES Veles e Vents",
    papel: "Guion, dirección y fotografía",
    camara: "Canon C200 · 50 mm",
    youtubeId: "-TZXzZCVf8Y",
    poster: "https://i.ytimg.com/vi/-TZXzZCVf8Y/maxresdefault.jpg",
    fotogramas: [
      "https://i.ytimg.com/vi/-TZXzZCVf8Y/maxresdefault.jpg",
      "https://i.imgur.com/YFpoep5.png",
      "https://i.imgur.com/COiqMyC.png",
      "https://i.imgur.com/JFVS8SY.png",
      "https://i.imgur.com/HjsEDrF.png",
      "https://i.imgur.com/VOWw0tD.png",
      "https://i.imgur.com/l0KwxAB.png",
    ],
    frase: "Sin dinero para efectos, construimos una máquina del tiempo *de verdad*.",
  },
  {
    slug: "sin-piedad",
    titulo: "Sin Piedad",
    tipo: "Cortometraje",
    servicios: ["direccion-de-fotografia"],
    direccion: "Ángela Manzano",
    productora: "Proyecto personal de Ángela Manzano",
    papel: "Dirección de fotografía",
    poster: "https://i.imgur.com/j3loxUV.png",
    fotogramas: [
      "https://i.imgur.com/j3loxUV.png",
      "https://i.ibb.co/Z6sq4zns/3a45388c-c86c-4c6c-a65e-08ecc09924d4.jpg",
      "https://i.ibb.co/8LbdJj5g/adfb7bc1-79ad-49fb-9085-05ed6ad25614.jpg",
      "https://i.ibb.co/LX70LVX2/7858818b-410d-4e0e-b79d-2f325f66c072.jpg",
    ],
    frase: "Una cárcel hecha *solo de luz*.",
  },
  {
    slug: "conciertos",
    titulo: "Conciertos",
    tipo: "Eventos",
    servicios: ["filmmaker", "edicion"],
    direccion: "Josep Mira Lozano",
    productora: "Varios clientes",
    papel: "Grabación y montaje",
    camara: "Sony FX3 · Tamron y Sony",
    poster: "https://i.ibb.co/HDqT2xzW/Captura-de-pantalla-2026-05-12-210438.png",
    fotogramas: [
      "https://i.ibb.co/HDqT2xzW/Captura-de-pantalla-2026-05-12-210438.png",
      "https://i.ibb.co/JWs3rX1g/Captura-de-pantalla-2026-05-12-210536.png",
      "https://i.ibb.co/xKnqM1dq/Captura-de-pantalla-2026-05-12-210716.png",
      "https://i.ibb.co/LdwnXNrm/Captura-de-pantalla-2026-05-12-210211.png",
    ],
    frase: "Un aftermovie se monta *de oído*.",
  },
  {
    slug: "eventos-deportivos",
    titulo: "Eventos deportivos",
    tipo: "Eventos",
    servicios: ["filmmaker", "edicion"],
    direccion: "Josep Mira Lozano",
    productora: "Ocisport",
    papel: "Grabación y montaje",
    camara: "Sony FX3 · Tamron y Sony",
    youtubeId: "m7rbFqf9dzE",
    poster: "https://i.ibb.co/YBc4tqZw/Captura-de-pantalla-2026-05-13-141447.png",
    fotogramas: [
      "https://i.ibb.co/YBc4tqZw/Captura-de-pantalla-2026-05-13-141447.png",
      "https://i.ibb.co/zVJMr1nJ/Captura-de-pantalla-2026-05-13-141759.png",
      "https://i.ibb.co/PsV1DzfW/Captura-de-pantalla-2026-05-13-141748.png",
      "https://i.ibb.co/bgbn1nNj/Captura-de-pantalla-2026-05-13-142016.png",
      "https://i.ibb.co/TM2cqWk3/Captura-de-pantalla-2026-05-13-141842.png",
    ],
    frase: "En una carrera, cada plano pasa *una sola vez*.",
  },
  {
    slug: "reels-redes-sociales",
    titulo: "Reels para redes",
    tipo: "Redes sociales",
    servicios: ["filmmaker", "edicion"],
    direccion: "Josep Mira Lozano",
    productora: "Consell Valencià de la Joventut y otros",
    papel: "Grabación y montaje",
    camara: "Sony FX3 · Tamron y Sony",
    poster: "https://rbgescuela.com/wp-content/uploads/claves-reels-atractivos-instagram.jpg",
    fotogramas: ["https://rbgescuela.com/wp-content/uploads/claves-reels-atractivos-instagram.jpg"],
    frase: "Tres segundos para ganarse a alguien, y el resto *para que se quede*.",
  },
  {
    slug: "bodas",
    titulo: "Bodas",
    tipo: "Eventos",
    servicios: ["filmmaker", "edicion"],
    direccion: "Josep Mira Lozano",
    productora: "Parejas",
    papel: "Grabación y montaje",
    camara: "Sony FX3 · Tamron y Sony",
    poster: "https://i.imgur.com/uk36C7v.png",
    fotogramas: [
      "https://i.imgur.com/uk36C7v.png",
      "https://i.ibb.co/bMm8rbcx/SELECCI-N-BODA-ESTHER-Y-GUSTAVO-00-01-16-05-Imagen-fija001.jpg",
      "https://i.ibb.co/kkN1z88/SELECCI-N-BODA-ESTHER-Y-GUSTAVO-00-10-43-10-Imagen-fija011.jpg",
      "https://i.ibb.co/nN49j7vf/SELECCI-N-BODA-ESTHER-Y-GUSTAVO-00-15-04-22-Imagen-fija013.jpg",
      "https://i.ibb.co/GQ6HbvzY/SELECCI-N-BODA-ESTHER-Y-GUSTAVO-00-18-50-21-Imagen-fija015.jpg",
      "https://i.ibb.co/tMh0FXff/SELECCI-N-BODA-ESTHER-Y-GUSTAVO-00-20-15-09-Imagen-fija018.jpg",
      "https://i.ibb.co/x8swTG98/SELECCI-N-BODA-ESTHER-Y-GUSTAVO-00-44-56-14-Imagen-fija023.jpg",
    ],
    frase: "El día más importante de una pareja, con *ojos de cine*.",
  },
];

/** Selección y orden de cada filtro de Trabajos (de "Destacados por servicio" en mapa-de-contenido.md) */
export const SELECCION: Record<string, string[]> = {
  todos: ["y-el-ano-que-viene-que", "100-baladas-arkano", "el-cirujano", "no-se-esta-tan-mal-lovva", "ep-oscuridad-adrian-munoz", "kiboko", "expandete-spot-juno-media", "sin-tiempo-peiko"],
  "direccion-de-fotografia": ["el-cirujano", "no-se-esta-tan-mal-lovva", "ep-oscuridad-adrian-munoz", "y-el-ano-que-viene-que", "sin-piedad", "sin-tiempo-peiko", "el-viajero"],
  filmmaker: ["expandete-spot-juno-media", "100-baladas-arkano", "conciertos", "eventos-deportivos", "y-el-ano-que-viene-que", "bodas"],
  edicion: ["kiboko", "conciertos", "reels-redes-sociales", "y-el-ano-que-viene-que", "no-se-esta-tan-mal-lovva", "100-baladas-arkano"],
};

export function proyectosDe(filtro: string): ProyectoD[] {
  const orden = SELECCION[filtro] ?? [];
  const elegidos = orden.map((s) => PROYECTOS.find((p) => p.slug === s)).filter((p): p is ProyectoD => !!p);
  if (filtro === "todos") return elegidos;
  // En la página de un servicio salen también el resto de sus proyectos, detrás de los destacados
  return [...elegidos, ...PROYECTOS.filter((p) => p.servicios.includes(filtro) && !orden.includes(p.slug))];
}

export const ARTICULOS: ArticuloD[] = [
  {
    slug: "ia-artesano-audiovisual",
    titulo: "El artesano y la inteligencia artificial en el cine",
    fecha: "13 may 2025",
    categoria: "Oficio",
    resumen: "Qué cambia la IA en la producción audiovisual y por qué el trabajo artesano sigue importando.",
    // Fotograma de la recreación de Star Wars sin CGI: oficio artesano frente a lo digital
    imagen: "https://i.ibb.co/KxmsqgfX/Captura-de-pantalla-2026-05-13-154839.png",
  },
  {
    slug: "el-arte-de-contar-historias-con-luz",
    titulo: "Dirección de fotografía: el arte de contar historias con luz",
    fecha: "15 jul 2024",
    categoria: "Dirección de fotografía",
    resumen: "La luz es el pincel del director de fotografía. Cómo un esquema de luz cambia lo que sentimos.",
    // Fotograma de El Cirujano (premio a mejor fotografía), que el artículo usa de ejemplo
    imagen: "https://www.platinocrowdfunding.com/storage/project/5454/img/eO2uv54rRAQy1AgsNjm0ybjXLN92jg4mkW9zFxZR.png",
  },
];

export const OPINIONES = [
  { texto: "La verdad que es increíble, nos ha encantado. Ha quedado realmente precioso, es espectacular.", quien: "Novios", tipo: "Vídeo de boda" },
  { texto: "Jo, me he emocionado. Me encanta. Es simplemente... PERFECTO. Mil gracias.", quien: "Cliente", tipo: "Proyecto audiovisual" },
  { texto: "GUUUAAAUUUUU, brutaaaaaal.", quien: "Organización", tipo: "Vídeo resumen de evento" },
  { texto: "He visto el vídeo resumen y muy chulo. Muy guapos los cambios.", quien: "Organización", tipo: "Vídeo resumen de evento" },
  { texto: "Está superguay, Josep. Muy chulo, muy chulo, muy chulo.", quien: "Artista", tipo: "Aftermovie" },
];

/**
 * Clientes, en una sola fila. `logo` es el logo oficial cuando hay uno fiable (los mismos de la web
 * antigua); se pinta monocromo según el tema. Sin logo, el nombre compuesto como marca; `estilo: "firma"`
 * para artistas (su nombre en la cursiva de acento). En la fase 4, tabla `clientes` con el logo subido
 * al almacenamiento.
 */
export type ClienteD = { nombre: string; logo?: string; alto?: number; estilo?: "firma" };

export const CLIENTES: ClienteD[] = [
  { nombre: "Disney", logo: "https://www.edigitalagency.com.au/wp-content/uploads/new-Disney-logo-white-png-large-size.png", alto: 44 },
  { nombre: "Star Wars", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Star_wars2.svg", alto: 46 },
  // El logo de la web antigua (jobs.kinepolis.com) ya no carga: nombre hasta tener el oficial
  { nombre: "Kinepolis" },
  { nombre: "Consell Valencià de la Joventut" },
  { nombre: "Ayuntamiento de l'Alfàs del Pi" },
  { nombre: "Ocisport" },
  { nombre: "Mediterra Cinema" },
  { nombre: "Cero Coma" },
  { nombre: "Dreamore" },
  { nombre: "Kymera Producciones" },
];

/** Trabajo en sinergia con JUNO Media (sin decir que Josep es parte de JUNO): marcas de proyectos juntos */
export const JUNO = {
  nombre: "JUNO Media",
  texto: "Trabajo codo con codo con JUNO Media en producciones para marcas como estas.",
  clientes: [
    { nombre: "ForecourtTech" },
    { nombre: "Arkano", estilo: "firma" },
    { nombre: "SOM Events" },
    { nombre: "Albir Confort" },
    { nombre: "Mapache Events" },
  ] as ClienteD[],
};

/** Canales de YouTube: de ahí viene buena parte de la experiencia. Las cifras de suscriptores las pone Josep. */
export const CANALES = [
  {
    nombre: "Del Fan, Para el Fan",
    texto: "Donde empecé a compartir mi pasión por el cine, mucho antes de dedicarme a rodar.",
    url: undefined as string | undefined,
  },
  {
    nombre: "Josep Mira",
    texto: "Recreo planos míticos del cine con pocos medios y cuento cómo se hicieron.",
    url: "https://www.youtube.com/channel/UCtyNSF1X0pNPxp5fhwu1NUA",
  },
];

export const PASOS = [
  { titulo: "Escucho", texto: "Me cuentas la historia, el tono y lo que quieres que sienta quien la vea. Sin prisas y sin formularios eternos." },
  { titulo: "Imagino", texto: "Te propongo una mirada: referencias, luz, encuadres, ritmo. Lo vemos juntos antes de grabar nada." },
  { titulo: "Ruedo", texto: "Me encargo de la imagen para que tú puedas centrarte en lo tuyo. Discreto cuando toca, ambicioso cuando se puede." },
  { titulo: "Cuido el final", texto: "Montaje, color y sonido con el mismo mimo que el rodaje, hasta que el resultado sea el que soñamos." },
];

/**
 * Lo que grabo como filmmaker: retoma la rejilla de servicios de la web antigua (vídeo corporativo,
 * eventos, edición para redes...) con los trabajos reales de cada tipo. Sin precios. Cada pieza lleva al
 * proyecto que la representa. En la fase 4, tabla `servicios_filmmaker` (o tipos de proyecto con texto).
 */
export const FILMMAKER = [
  { nombre: "Spots y vídeo corporativo", texto: "Para marcas y empresas que quieren contar algo con alma, no solo enseñar un producto.", proyecto: "expandete-spot-juno-media" },
  { nombre: "Videoclips", texto: "La canción manda: una imagen que respira al ritmo de la música.", proyecto: "100-baladas-arkano" },
  { nombre: "Conciertos y aftermovies", texto: "Monto como músico, para que la imagen baile al compás del directo.", proyecto: "conciertos" },
  { nombre: "Bodas", texto: "Una película que apetezca volver a ver, no un resumen del día.", proyecto: "bodas" },
  { nombre: "Eventos deportivos", texto: "El esfuerzo, la técnica y la tensión, con el espectador al borde del asiento.", proyecto: "eventos-deportivos" },
  { nombre: "Contenido para redes", texto: "Piezas verticales pensadas para el móvil, con el ritmo de cada perfil.", proyecto: "reels-redes-sociales" },
];

// ---------------------------------------------------------------------------
// Bloques: así se guardará cada sección en la tabla `bloques` (pagina, orden, tipo, visible, datos jsonb)

export type TipoBloque =
  | "portada"
  | "servicios"
  | "filmmaker"
  | "trabajos"
  | "cifras"
  | "proceso"
  | "sobre-mi"
  | "opiniones"
  | "clientes"
  | "blog"
  | "texto"
  | "llamada";

export type Bloque = {
  id: string;
  tipo: TipoBloque;
  visible: boolean;
  datos: { antetitulo?: string; titulo: string; texto?: string; imagen?: string };
};

/** Catálogo de tipos de bloque: lo que el panel ofrece al pulsar "Añadir sección" */
export const CATALOGO: Record<TipoBloque, { nombre: string; descripcion: string; datos: Bloque["datos"] }> = {
  portada: { nombre: "Portada con reel", descripcion: "Vídeo a pantalla completa y frase principal", datos: { antetitulo: "Director de fotografía · Filmmaker · Editor", titulo: "Historias hechas de luz.", texto: "Me llamo Josep y llevo más de nueve años contando historias con luz, encuadre y ritmo. Cada plano que firmo lleva algo de mí." } },
  servicios: { nombre: "Servicios", descripcion: "Lo que ofreces, con lo que aportas y para quién", datos: { antetitulo: "Lo que hago", titulo: "¿En qué te puedo ayudar?", texto: "Tres formas de trabajar juntos. Elige una y la vemos con calma." } },
  filmmaker: { nombre: "Lo que grabo", descripcion: "Tipos de vídeo que haces como filmmaker, con un trabajo de cada uno", datos: { antetitulo: "Filmmaker", titulo: "Lo que puedo grabar para ti", texto: "Para productoras, empresas o particulares: del vídeo corporativo a la boda, cada encargo con la misma mirada de cine." } },
  trabajos: { nombre: "Trabajos", descripcion: "Carrusel de proyectos con filtro por servicio", datos: { antetitulo: "Selección", titulo: "Trabajos de los que estoy orgulloso" } },
  cifras: { nombre: "Cifras y premios", descripcion: "Números, premios y canales de YouTube", datos: { antetitulo: "En números", titulo: "Más de nueve años detrás de la cámara" } },
  proceso: { nombre: "Cómo trabajo", descripcion: "Los cuatro pasos de un encargo, de un vistazo", datos: { antetitulo: "Cómo trabajamos", titulo: "De tu idea a la pantalla, paso a paso" } },
  "sobre-mi": { nombre: "Sobre mí", descripcion: "Retrato y presentación personal", datos: { antetitulo: "Quién soy", titulo: "Hola, soy Josep", texto: "Empecé con la música y la interpretación, y en el vídeo encontré la forma de juntarlo todo. Desde entonces he rodado cortos, videoclips, spots, conciertos y bodas, y llevo más de nueve años en YouTube recreando planos míticos del cine con cuatro duros. Me gusta trabajar en equipo, resolver problemas en el set y que la gente se olvide de que hay una cámara.", imagen: "https://i.postimg.cc/Qh3FMz10/Captura-de-pantalla-2026-05-13-161052.png" } },
  opiniones: { nombre: "Opiniones", descripcion: "Frases de clientes en movimiento", datos: { antetitulo: "Opiniones", titulo: "Lo que dicen quienes han confiado en mí" } },
  clientes: { nombre: "Clientes", descripcion: "Franja de marcas con las que has trabajado", datos: { titulo: "Han confiado en mí" } },
  blog: { nombre: "Blog", descripcion: "Los últimos artículos publicados", datos: { antetitulo: "Blog", titulo: "Lo que aprendo por el camino" } },
  texto: { nombre: "Sección libre", descripcion: "Título, texto e imagen opcional, para lo que quieras", datos: { antetitulo: "Nuevo", titulo: "Una sección nueva", texto: "Escribe aquí lo que quieras contar: una novedad, un proyecto en marcha, una oferta para festivales..." } },
  llamada: { nombre: "Llamada a la acción", descripcion: "Invitación a escribirte, con WhatsApp y correo", datos: { titulo: "¿Tienes una historia que contar?", texto: "Cuéntamela. Me encantará escucharla y pensar cómo llevarla a la pantalla." } },
};

const ORDEN_INICIAL: TipoBloque[] = ["portada", "servicios", "filmmaker", "trabajos", "sobre-mi", "cifras", "proceso", "opiniones", "clientes", "blog", "llamada"];

export const BLOQUES_INICIALES: Bloque[] = ORDEN_INICIAL.map((tipo) => ({
  id: tipo,
  tipo,
  visible: true,
  datos: { ...CATALOGO[tipo].datos },
}));

export const getProyectoD = (slug: string) => PROYECTOS.find((p) => p.slug === slug);
export const getServicioD = (slug: string) => SERVICIOS.find((s) => s.slug === slug);

/** Imágenes de un servicio: los fotogramas de sus proyectos destacados */
export function imagenesDe(servicio: string): string[] {
  return proyectosDe(servicio)
    .slice(0, 4)
    .map((p) => p.poster);
}

export function fichaTecnicaD(p: ProyectoD): [string, string][] {
  return [
    ["Año", p.anio ? String(p.anio) : "Pendiente"],
    ["Tipo", p.tipo],
    ["Dirección", p.direccion],
    ["Productora", p.productora],
    ["Mi papel", p.papel],
    ["Cámara", p.camara ?? "Pendiente"],
  ];
}
