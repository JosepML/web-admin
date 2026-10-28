// Textos de los proyectos para la ficha del prototipo. Generado con scripts/textos-prototipo.mjs a partir de
// plan/contenido/proyectos/*.md (no editar a mano). Cuando exista la base de datos, esto sale de la tabla `proyectos`.
export type TextosProyecto = {
  tarjeta: string;
  proyecto: string[];
  decisiones: { titulo: string; texto: string }[];
  reto: string;
  resultado: string[];
};

export const TEXTOS: Record<string, TextosProyecto> = {
  "100-baladas-arkano": {
    "tarjeta": "Una canción de amor de Arkano, escrita con su pareja y estrenada un 14 de febrero.",
    "proyecto": [
      "La idea de partida era de Álex Gómez: una pareja que se va acercando a lo largo del tema. Mi trabajo fue convertirla en un videoclip rodable y con ritmo, con la producción de Noelia Fluxà y Julie-Estel Soard."
    ],
    "decisiones": [
      {
        "titulo": "La distancia como hilo",
        "texto": "Plano a plano, Arkano y su pareja se acercan hasta el final del tema."
      },
      {
        "titulo": "Montaje a la canción",
        "texto": "Los cortes siguen los cambios del tema, no un ritmo fijo."
      }
    ],
    "reto": "Dirigir una idea ajena sin perder lo que la hacía especial. La ajusté a la duración y al pulso de un videoclip sin tocar su centro: el acercamiento.",
    "resultado": [
      "Más de 17.000 visualizaciones en YouTube."
    ]
  },
  "bodas": {
    "tarjeta": "Bodas contadas como un tráiler documental, no como una crónica del día.",
    "proyecto": [
      "He grabado muchas bodas, siempre con muy buenas valoraciones. La película principal dura unos 20 minutos, con música elegida con cada pareja. Por privacidad, aquí solo hay fotogramas."
    ],
    "decisiones": [
      {
        "titulo": "Discreción",
        "texto": "Los novios se olvidan de la cámara y los momentos salen solos."
      },
      {
        "titulo": "Tráiler documental",
        "texto": "Montaje ágil, pensado para volver a verse."
      },
      {
        "titulo": "Música a medida",
        "texto": "La elegimos juntos, y monto cada transición sobre ella."
      }
    ],
    "reto": "Estar en los momentos que no se repiten sin que se note.",
    "resultado": []
  },
  "conciertos": {
    "tarjeta": "Aftermovies que cuentan un directo en pocos minutos: el espectáculo, los artistas y el público.",
    "proyecto": [
      "Para Tamilah y Fluxà (Agüita de Coco y Flama), Mapache Events, Orquesta Azara y Miami Show. Aquí hay tres piezas y un vídeo del proceso."
    ],
    "decisiones": [
      {
        "titulo": "Primero el audio",
        "texto": "Un mix con los temas más potentes y cambios de tempo es el esqueleto del vídeo."
      },
      {
        "titulo": "Grabar para montar",
        "texto": "Hablo con los artistas, cubro muchos encuadres y tomo el playback para que labios e instrumentos cuadren."
      },
      {
        "titulo": "Estructura",
        "texto": "Lo más rompedor al principio y lo más espectacular al cierre, con el ambiente del público."
      }
    ],
    "reto": "Que tenga ritmo y cuente el concierto, en lugar de ser una lista de clips bonitos.",
    "resultado": []
  },
  "el-cirujano": {
    "tarjeta": "Una inspectora persigue a un asesino que convierte a sus víctimas en obras de arte, y las pistas apuntan a su compañero.",
    "proyecto": [
      "Un thriller psicológico. Propuse dejar el naturalismo a un lado y contar con la luz y el color lo que el guion no dice en voz alta: cómo piensa el asesino."
    ],
    "decisiones": [
      {
        "titulo": "Luz imposible",
        "texto": "En los escenarios del crimen la luz no tiene una fuente real: es la forma en que él ve el mundo."
      },
      {
        "titulo": "Rojo infierno",
        "texto": "Un rojo intenso en las escenas más oscuras, como aviso de peligro."
      },
      {
        "titulo": "Investigación fría",
        "texto": "Una luz analítica para la parte policial, que marca la doble vida de los personajes."
      }
    ],
    "reto": "Que lo casi sobrenatural de los crímenes y lo realista de la investigación convivieran sin bajar la tensión. Los separé por luz y color.",
    "resultado": [
      "Mejor fotografía en el On Duty International Film Festival."
    ]
  },
  "el-viajero": {
    "tarjeta": "Un relojero de los años 50 construye una máquina del tiempo, y su yo del futuro vuelve para advertirle.",
    "proyecto": [
      "Lo escribí y lo rodamos casi sin presupuesto, con un equipo mínimo: Alba Gisbert, Sebastian Alonso Pérez, Mar Garrido, Lara Ruiz Martín y Andreu Pastor. Música original de David Bellido y Jesús Jiménez."
    ],
    "decisiones": [
      {
        "titulo": "Los 50 sin presupuesto",
        "texto": "Un apartamento antiguo y atrezo de casas de familiares."
      },
      {
        "titulo": "Máquina hecha a mano",
        "texto": "Manivela, engranajes y tuberías que funcionan de verdad."
      },
      {
        "titulo": "La bombilla como luz principal",
        "texto": "Clave baja, con la luz de la propia máquina."
      },
      {
        "titulo": "Un clic de reloj",
        "texto": "La música, inspirada en Göransson, repite ese motivo todo el corto."
      }
    ],
    "reto": "Hacer creíble una ciencia ficción de época sin dinero ni efectos. Todo tenía que existir delante de la cámara.",
    "resultado": [
      "Más de 22.000 visualizaciones en YouTube."
    ]
  },
  "ep-oscuridad-adrian-munoz": {
    "tarjeta": "Un EP sobre una pareja que se rompe, contado en siete visualizers y un tráiler.",
    "proyecto": [
      "Adrián Muñoz recorre el enfado, la soledad, la ruptura, las cicatrices y la resignación. Mi trabajo fue pensar la imagen de la serie entera, no de cada vídeo por separado."
    ],
    "decisiones": [
      {
        "titulo": "Pantalla partida",
        "texto": "El artista a un lado y la pareja al otro, encuadrados e iluminados para leerse juntos."
      },
      {
        "titulo": "De color a blanco y negro",
        "texto": "Cada tema pierde saturación hasta el séptimo."
      },
      {
        "titulo": "Una luz por emoción",
        "texto": "Un esquema distinto para cada bucle, siempre con contraste cuidado."
      }
    ],
    "reto": "Siete piezas que se ven sueltas en redes. El paso del color al blanco y negro le da a cada una su identidad y, a la vez, las ordena.",
    "resultado": [
      "1.392.400 visualizaciones entre YouTube, Instagram y Spotify."
    ]
  },
  "eventos-deportivos": {
    "tarjeta": "Ciclismo de élite, como la Shimano Super Cup Massi en La Nucía, grabado a pie de pista.",
    "proyecto": [
      "Para Ocisport. La carrera no se repite, así que casi todo depende de dónde me coloque. De ahí salen piezas para redes y para televisión."
    ],
    "decisiones": [
      {
        "titulo": "Elegir sitio",
        "texto": "Me coloco en los puntos más espectaculares del circuito."
      },
      {
        "titulo": "Cámara rápida y cerrada",
        "texto": "Seguimiento preciso para que se note la velocidad."
      },
      {
        "titulo": "Un pack por canal",
        "texto": "Reels para redes y piezas largas con calidad de emisión."
      },
      {
        "titulo": "Sonido realzado",
        "texto": "Ruedas, esfuerzo y público sobre una base musical fuerte."
      }
    ],
    "reto": "Estar en el sitio justo en el momento justo y, luego, condensar la carrera sin perder tensión.",
    "resultado": []
  },
  "expandete-spot-juno-media": {
    "tarjeta": "Un spot que no parece un anuncio hasta el último plano.",
    "proyecto": [
      "JUNO Media quería contar su lema, «cine para sanar». Escribí una fábula: una niña con ideas infinitas ayuda a su vecino, bloqueado, a liberar las suyas. También hice el casting y busqué las localizaciones; la fotografía fue de Juanfran Jiménez. Es una pieza de muestra que no llegó a comercializarse."
    ],
    "decisiones": [
      {
        "titulo": "Giro final",
        "texto": "Tres actos, y la marca solo aparece al final, con sus fundadoras haciendo de sí mismas."
      },
      {
        "titulo": "Dos casas enfrentadas",
        "texto": "La niña y el adulto se miran a través de la ventana: esa mirada sostiene la historia."
      },
      {
        "titulo": "Casting con oficio",
        "texto": "Amaia Miranda, actriz infantil con experiencia, para rodar rápido y natural."
      }
    ],
    "reto": "Encontrar dos viviendas enfrentadas con las ventanas a la vista. Sin esa geografía, la historia no existía.",
    "resultado": []
  },
  "kiboko": {
    "tarjeta": "El bar Kiboko fue un refugio de libertad y música en La Vila Joiosa de los 80. Esta docuficción lo recupera.",
    "proyecto": [
      "Lo cuenta Ana, una cronista ficticia que hoy investiga el local. Mi trabajo fue unir tres materiales en un solo relato: entrevistas reales, escenas de ficción y su voz en off."
    ],
    "decisiones": [
      {
        "titulo": "Ordenar primero",
        "texto": "Sincronizar, cribar y estructurar horas de entrevistas antes de buscar el ritmo."
      },
      {
        "titulo": "Testimonio y ficción en diálogo",
        "texto": "Las entrevistas responden a lo que Ana investiga."
      },
      {
        "titulo": "Dos ritmos",
        "texto": "Vibrante en el bar de 1986, apoyado en la música; pausado en las entrevistas."
      }
    ],
    "reto": "El volumen: horas de material en tres formatos distintos, y una historia que no podía perder el foco ni la emoción.",
    "resultado": [
      "Estreno con aforo completo en el Teatre Auditori de La Vila Joiosa, el 6 de junio de 2026.",
      "Selección en festivales y nominación a mejor montaje."
    ]
  },
  "no-se-esta-tan-mal-lovva": {
    "tarjeta": "Una canción sobre aceptarse a uno mismo, y una imagen pensada como refugio.",
    "proyecto": [
      "Ángela Manzano pedía una burbuja visual donde Lovva pudiera mostrarse vulnerable sin perder fuerza. Para rodarla construimos siete sets."
    ],
    "decisiones": [
      {
        "titulo": "Luz puntual, no plana",
        "texto": "Contraluces, destellos suaves y puntos de luz que envuelven al artista."
      },
      {
        "titulo": "Cristal y agua",
        "texto": "Reflejos y refracciones que dan textura a cada plano."
      },
      {
        "titulo": "Un esquema por set",
        "texto": "Cada uno de los siete sets tiene su propia luz."
      }
    ],
    "reto": "Que siete espacios distintos se sintieran como un mismo lugar. En montaje los enlacé sin romper la atmósfera ni el ritmo.",
    "resultado": []
  },
  "recreacion-el-padrino": {
    "tarjeta": "El despacho de Vito Corleone, con la rejilla de una estufa como ventana.",
    "proyecto": [
      "Quise estudiar cómo ilumina Gordon Willis recreando su plano más conocido. Construí el set desde cero en un sótano."
    ],
    "decisiones": [
      {
        "titulo": "La ventana",
        "texto": "Rejilla de estufa de butano, cinta negra, papel de horno como difusor y LED detrás."
      },
      {
        "titulo": "Ojos en sombra",
        "texto": "Aputure 300d II con softbox cenital y un negativo en el suelo."
      },
      {
        "titulo": "Temperatura",
        "texto": "Cámara hacia cálido y fondo compensado con geles fríos."
      },
      {
        "titulo": "Color sin verlo",
        "texto": "Soy daltónico: igualé pieles y sombras en DaVinci Resolve con el fotograma original."
      }
    ],
    "reto": "Recrear la luz de una ventana que no existía, y un color que no veo como los demás.",
    "resultado": []
  },
  "recreacion-nosferatu": {
    "tarjeta": "Una escena de *Nosferatu* recreada con cartón, una rampa de madera y un soplador de hojas.",
    "proyecto": [
      "En mi canal recreo planos de cine con muy pocos medios. Esta la hicimos con Comboi Films: la sombra del vampiro en la ventana y la protagonista que levita."
    ],
    "decisiones": [
      {
        "titulo": "La sombra",
        "texto": "Silueta de cartón y cinta, escalada a la ventana y proyectada con un spotlight."
      },
      {
        "titulo": "La levitación",
        "texto": "Una rampa de madera, escondida por el ángulo y la luz."
      },
      {
        "titulo": "Luz general",
        "texto": "Aputure 300D con softbox."
      }
    ],
    "reto": "La cortina debía moverse con el viento y esa noche no soplaba. Hilos y cartones no funcionaron; un soplador de hojas dio un viento dosificable, e hilos finos movían la silueta al compás.",
    "resultado": [
      "Un plano casi idéntico al original con unos 100 € de material."
    ]
  },
  "recreacion-star-wars-luke-vader": {
    "tarjeta": "El duelo de Luke y Vader con una maqueta, siluetas y sables añadidos fotograma a fotograma.",
    "proyecto": [
      "Para el 45.º aniversario de *El Imperio Contraataca* recreé el duelo final en la Ciudad Nube, con medios caseros."
    ],
    "decisiones": [
      {
        "titulo": "Maqueta",
        "texto": "Un set en miniatura, como en las películas originales."
      },
      {
        "titulo": "Exposición",
        "texto": "Muchas pruebas de diafragma e ISO para enfocar algo tan pequeño."
      },
      {
        "titulo": "Siluetas",
        "texto": "Rodadas al aire libre contra una pared blanca, tras fallar en interior."
      },
      {
        "titulo": "Postproducción",
        "texto": "Sables y personajes añadidos fotograma a fotograma."
      }
    ],
    "reto": "Espacio y luz: dar a una maqueta pequeña la profundidad de un set real.",
    "resultado": []
  },
  "recreacion-star-wars-sin-cgi": {
    "tarjeta": "Luke en la Ciudad de las Nubes sin CGI: pilares de alfombra, tuberías de ferretería y fondo de papel perforado.",
    "proyecto": [
      "Llevo una década haciendo contenido de Star Wars. Aquí recreé el plano más icónico de Luke solo con recursos físicos."
    ],
    "decisiones": [
      {
        "titulo": "Decorado de ferretería",
        "texto": "Pilares de alfombra forrada de goma EVA y tuberías de fontanería."
      },
      {
        "titulo": "Luces de fondo",
        "texto": "Papel gris perforado; el desenfoque convierte los agujeros en halos."
      },
      {
        "titulo": "Luz dura",
        "texto": "LED magnético de contraluz, modificador concentrado y negativo en el suelo."
      }
    ],
    "reto": "La perspectiva. Con un 85 mm las proporciones no eran las del original, así que rehíce el rodaje entero con un 55 mm.",
    "resultado": []
  },
  "reels-redes-sociales": {
    "tarjeta": "Vídeo vertical para Disney, el Consell Valencià de la Joventut y creadores de YouTube.",
    "proyecto": [
      "Llevo más de nueve años haciendo contenido para redes, y cada cliente necesita sonar distinto: un creador, una marca de entretenimiento o una entidad pública."
    ],
    "decisiones": [
      {
        "titulo": "Gancho",
        "texto": "Lo más potente, en los tres primeros segundos."
      },
      {
        "titulo": "Sin tiempos muertos",
        "texto": "Cortes a la música, zooms digitales y diseño sonoro."
      },
      {
        "titulo": "Cada cliente, su tono",
        "texto": "Cambian la luz, el color, los subtítulos y el ritmo."
      }
    ],
    "reto": "Cambiar de registro de un cliente a otro sin perder el ritmo de cada plataforma.",
    "resultado": [
      "Cientos de miles de visualizaciones entre todas las piezas."
    ]
  },
  "sin-piedad": {
    "tarjeta": "Un hombre machacado por su trabajo decide secuestrar a su jefa.",
    "proyecto": [
      "Ángela Manzano lo cuenta desde dentro de su cabeza, con tono onírico. Mi trabajo fue traducir ese estado mental a luz y composición. Aún no es público: se prepara para festivales, por eso aquí solo hay fotogramas."
    ],
    "decisiones": [
      {
        "titulo": "Oficina como limbo",
        "texto": "Luz uniforme y fría sobre el blanco."
      },
      {
        "titulo": "Confrontación",
        "texto": "Prácticas cálidas que fingen normalidad, con sombras profundas sobre él."
      },
      {
        "titulo": "Prisión mental",
        "texto": "Sombras de persiana y tonos azulados, sin paredes."
      },
      {
        "titulo": "Secuestro",
        "texto": "Contraluz intenso, como un halo teatral."
      }
    ],
    "reto": "Rodamos casi todo sobre un ciclorama blanco. Había que convertir un solo espacio neutro en varios lugares, cada uno con su carga emocional.",
    "resultado": []
  },
  "sin-tiempo-peiko": {
    "tarjeta": "Una canción sobre el paso del tiempo y la distancia entre el éxito y el fracaso, contada como un drama.",
    "proyecto": [
      "Peiko canta y, a la vez, vive la caída de su personaje. Pasé la canción a un plan de rodaje: cada movimiento de cámara y cada óptica acompañan ese arco."
    ],
    "decisiones": [
      {
        "titulo": "Dos casas opuestas",
        "texto": "Una moderna y lujosa, otra podrida: dos atmósferas para la fractura del personaje."
      },
      {
        "titulo": "Final en una celda",
        "texto": "La luz se enfría y Peiko termina cantando agarrado a los barrotes."
      }
    ],
    "reto": "Que la caída se viera en la imagen y no solo en la letra.",
    "resultado": []
  },
  "y-el-ano-que-viene-que": {
    "tarjeta": "El ESCAC Dreammakers Contest de Cupra pedía un corto con tres palabras obligatorias: *Ojo*, *Cine* y *Barcelona*.",
    "proyecto": [
      "Las uní de la única forma que me parecía honesta, contando mi propia relación con el cine. Es un relato autobiográfico en voz en off, y también me puse delante de la cámara. Me ayudaron Adrià Mira Lozano y Lara Ruiz Martín."
    ],
    "decisiones": [
      {
        "titulo": "La voz primero",
        "texto": "Escribí la narración antes que nada, con *Amélie* como referencia: cálida y cercana."
      },
      {
        "titulo": "Contraste de ritmos",
        "texto": "Un montaje acelerado contra una voz tranquila. De ahí sale la energía."
      }
    ],
    "reto": "El plazo real fue de unos 15 días para idear, rodar, montar y entregar. Lo resolví quedándome solo con lo que contaba la historia.",
    "resultado": [
      "Podio del ESCAC Dreammakers Contest 2024.",
      "Acceso a becas de la ESCAC."
    ]
  }
};
