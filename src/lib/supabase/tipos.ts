// Generado con Supabase (proyecto oadmqwtnxpbotxcgzaoo) tras la migración esquema_solido_3_seguridad.
// Para regenerarlo tras cada migración: generate_typescript_types (MCP de Supabase).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      administradores: {
        Row: {
          creado_en: string
          user_id: string
        }
        Insert: {
          creado_en?: string
          user_id: string
        }
        Update: {
          creado_en?: string
          user_id?: string
        }
        Relationships: []
      }
      ajustes: {
        Row: {
          actualizado_en: string
          clave: string
          valor: Json
        }
        Insert: {
          actualizado_en?: string
          clave: string
          valor: Json
        }
        Update: {
          actualizado_en?: string
          clave?: string
          valor?: Json
        }
        Relationships: []
      }
      articulos: {
        Row: {
          actualizado_en: string
          categoria_id: string | null
          contenido: Json
          creado_en: string
          estado: Database["public"]["Enums"]["estado_publicacion"]
          extracto: string
          fecha: string
          grupo: string
          id: string
          id_antiguo: string | null
          idioma: string
          imagen_id: string | null
          publicado_en: string | null
          seo_descripcion: string
          seo_titulo: string
          slug: string
          titulo: string
        }
        Insert: {
          actualizado_en?: string
          categoria_id?: string | null
          contenido?: Json
          creado_en?: string
          estado?: Database["public"]["Enums"]["estado_publicacion"]
          extracto?: string
          fecha?: string
          grupo?: string
          id?: string
          id_antiguo?: string | null
          idioma?: string
          imagen_id?: string | null
          publicado_en?: string | null
          seo_descripcion?: string
          seo_titulo?: string
          slug: string
          titulo?: string
        }
        Update: {
          actualizado_en?: string
          categoria_id?: string | null
          contenido?: Json
          creado_en?: string
          estado?: Database["public"]["Enums"]["estado_publicacion"]
          extracto?: string
          fecha?: string
          grupo?: string
          id?: string
          id_antiguo?: string | null
          idioma?: string
          imagen_id?: string | null
          publicado_en?: string | null
          seo_descripcion?: string
          seo_titulo?: string
          slug?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "articulos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias_articulo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articulos_idioma_fkey"
            columns: ["idioma"]
            isOneToOne: false
            referencedRelation: "idiomas"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "articulos_imagen_id_fkey"
            columns: ["imagen_id"]
            isOneToOne: false
            referencedRelation: "medios"
            referencedColumns: ["id"]
          },
        ]
      }
      bloques: {
        Row: {
          actualizado_en: string
          creado_en: string
          datos: Json
          id: string
          orden: number
          pagina_id: string
          tipo: Database["public"]["Enums"]["tipo_bloque"]
          visible: boolean
        }
        Insert: {
          actualizado_en?: string
          creado_en?: string
          datos?: Json
          id?: string
          orden?: number
          pagina_id: string
          tipo: Database["public"]["Enums"]["tipo_bloque"]
          visible?: boolean
        }
        Update: {
          actualizado_en?: string
          creado_en?: string
          datos?: Json
          id?: string
          orden?: number
          pagina_id?: string
          tipo?: Database["public"]["Enums"]["tipo_bloque"]
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "bloques_pagina_id_fkey"
            columns: ["pagina_id"]
            isOneToOne: false
            referencedRelation: "paginas"
            referencedColumns: ["id"]
          },
        ]
      }
      borradores: {
        Row: {
          actualizado_en: string
          actualizado_por: string | null
          datos: Json
          fila_id: string
          tabla: string
        }
        Insert: {
          actualizado_en?: string
          actualizado_por?: string | null
          datos: Json
          fila_id: string
          tabla: string
        }
        Update: {
          actualizado_en?: string
          actualizado_por?: string | null
          datos?: Json
          fila_id?: string
          tabla?: string
        }
        Relationships: []
      }
      canales: {
        Row: {
          actualizado_en: string
          cifra: string
          creado_en: string
          estado: Database["public"]["Enums"]["estado_publicacion"]
          grupo: string
          id: string
          idioma: string
          nombre: string
          orden: number
          publicado_en: string | null
          texto: string
          url: string | null
        }
        Insert: {
          actualizado_en?: string
          cifra?: string
          creado_en?: string
          estado?: Database["public"]["Enums"]["estado_publicacion"]
          grupo?: string
          id?: string
          idioma?: string
          nombre?: string
          orden?: number
          publicado_en?: string | null
          texto?: string
          url?: string | null
        }
        Update: {
          actualizado_en?: string
          cifra?: string
          creado_en?: string
          estado?: Database["public"]["Enums"]["estado_publicacion"]
          grupo?: string
          id?: string
          idioma?: string
          nombre?: string
          orden?: number
          publicado_en?: string | null
          texto?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "canales_idioma_fkey"
            columns: ["idioma"]
            isOneToOne: false
            referencedRelation: "idiomas"
            referencedColumns: ["codigo"]
          },
        ]
      }
      carpetas: {
        Row: {
          creado_en: string
          id: string
          nombre: string
        }
        Insert: {
          creado_en?: string
          id?: string
          nombre: string
        }
        Update: {
          creado_en?: string
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      categorias_articulo: {
        Row: {
          actualizado_en: string
          creado_en: string
          grupo: string
          id: string
          idioma: string
          nombre: string
          orden: number
          slug: string
        }
        Insert: {
          actualizado_en?: string
          creado_en?: string
          grupo?: string
          id?: string
          idioma?: string
          nombre: string
          orden?: number
          slug: string
        }
        Update: {
          actualizado_en?: string
          creado_en?: string
          grupo?: string
          id?: string
          idioma?: string
          nombre?: string
          orden?: number
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categorias_articulo_idioma_fkey"
            columns: ["idioma"]
            isOneToOne: false
            referencedRelation: "idiomas"
            referencedColumns: ["codigo"]
          },
        ]
      }
      clientes: {
        Row: {
          actualizado_en: string
          alto_logo: number | null
          con_juno: boolean
          creado_en: string
          enlace: string | null
          estado: Database["public"]["Enums"]["estado_publicacion"]
          estilo: Database["public"]["Enums"]["estilo_cliente"]
          id: string
          logo_id: string | null
          nombre: string
          orden: number
          publicado_en: string | null
        }
        Insert: {
          actualizado_en?: string
          alto_logo?: number | null
          con_juno?: boolean
          creado_en?: string
          enlace?: string | null
          estado?: Database["public"]["Enums"]["estado_publicacion"]
          estilo?: Database["public"]["Enums"]["estilo_cliente"]
          id?: string
          logo_id?: string | null
          nombre?: string
          orden?: number
          publicado_en?: string | null
        }
        Update: {
          actualizado_en?: string
          alto_logo?: number | null
          con_juno?: boolean
          creado_en?: string
          enlace?: string | null
          estado?: Database["public"]["Enums"]["estado_publicacion"]
          estilo?: Database["public"]["Enums"]["estilo_cliente"]
          id?: string
          logo_id?: string | null
          nombre?: string
          orden?: number
          publicado_en?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_logo_id_fkey"
            columns: ["logo_id"]
            isOneToOne: false
            referencedRelation: "medios"
            referencedColumns: ["id"]
          },
        ]
      }
      idiomas: {
        Row: {
          activo: boolean
          codigo: string
          creado_en: string
          nombre: string
          predeterminado: boolean
        }
        Insert: {
          activo?: boolean
          codigo: string
          creado_en?: string
          nombre: string
          predeterminado?: boolean
        }
        Update: {
          activo?: boolean
          codigo?: string
          creado_en?: string
          nombre?: string
          predeterminado?: boolean
        }
        Relationships: []
      }
      medios: {
        Row: {
          actualizado_en: string
          alto: number | null
          ancho: number | null
          foco_x: number | null
          foco_y: number | null
          bytes: number | null
          carpeta_id: string | null
          creado_en: string
          duracion: number | null
          id: string
          mime: string
          ruta: string | null
          texto_alternativo: string
          tipo: Database["public"]["Enums"]["tipo_medio"]
          titulo: string
          url_origen: string | null
        }
        Insert: {
          actualizado_en?: string
          alto?: number | null
          ancho?: number | null
          foco_x?: number | null
          foco_y?: number | null
          bytes?: number | null
          carpeta_id?: string | null
          creado_en?: string
          duracion?: number | null
          id?: string
          mime?: string
          ruta?: string | null
          texto_alternativo?: string
          tipo: Database["public"]["Enums"]["tipo_medio"]
          titulo?: string
          url_origen?: string | null
        }
        Update: {
          actualizado_en?: string
          alto?: number | null
          ancho?: number | null
          foco_x?: number | null
          foco_y?: number | null
          bytes?: number | null
          carpeta_id?: string | null
          creado_en?: string
          duracion?: number | null
          id?: string
          mime?: string
          ruta?: string | null
          texto_alternativo?: string
          tipo?: Database["public"]["Enums"]["tipo_medio"]
          titulo?: string
          url_origen?: string | null
        }
        Relationships: []
      }
      mensajes: {
        Row: {
          acepta_privacidad: boolean
          actualizado_en: string
          correo: string
          creado_en: string
          estado: Database["public"]["Enums"]["estado_mensaje"]
          id: string
          mensaje: string
          nombre: string
          notas: string
          origen: string
          servicio: string
          telefono: string
        }
        Insert: {
          acepta_privacidad: boolean
          actualizado_en?: string
          correo: string
          creado_en?: string
          estado?: Database["public"]["Enums"]["estado_mensaje"]
          id?: string
          mensaje: string
          nombre: string
          notas?: string
          origen?: string
          servicio?: string
          telefono?: string
        }
        Update: {
          acepta_privacidad?: boolean
          actualizado_en?: string
          correo?: string
          creado_en?: string
          estado?: Database["public"]["Enums"]["estado_mensaje"]
          id?: string
          mensaje?: string
          nombre?: string
          notas?: string
          origen?: string
          servicio?: string
          telefono?: string
        }
        Relationships: []
      }
      opiniones: {
        Row: {
          actualizado_en: string
          autor: string
          contexto: string
          creado_en: string
          estado: Database["public"]["Enums"]["estado_publicacion"]
          grupo: string
          id: string
          idioma: string
          orden: number
          proyecto_id: string | null
          publicado_en: string | null
          texto: string
        }
        Insert: {
          actualizado_en?: string
          autor?: string
          contexto?: string
          creado_en?: string
          estado?: Database["public"]["Enums"]["estado_publicacion"]
          grupo?: string
          id?: string
          idioma?: string
          orden?: number
          proyecto_id?: string | null
          publicado_en?: string | null
          texto?: string
        }
        Update: {
          actualizado_en?: string
          autor?: string
          contexto?: string
          creado_en?: string
          estado?: Database["public"]["Enums"]["estado_publicacion"]
          grupo?: string
          id?: string
          idioma?: string
          orden?: number
          proyecto_id?: string | null
          publicado_en?: string | null
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "opiniones_idioma_fkey"
            columns: ["idioma"]
            isOneToOne: false
            referencedRelation: "idiomas"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "opiniones_proyecto_id_fkey"
            columns: ["proyecto_id"]
            isOneToOne: false
            referencedRelation: "proyectos"
            referencedColumns: ["id"]
          },
        ]
      }
      paginas: {
        Row: {
          actualizado_en: string
          creado_en: string
          estado: Database["public"]["Enums"]["estado_publicacion"]
          grupo: string
          id: string
          idioma: string
          imagen_id: string | null
          publicado_en: string | null
          seo_descripcion: string
          seo_titulo: string
          slug: string
          titulo: string
        }
        Insert: {
          actualizado_en?: string
          creado_en?: string
          estado?: Database["public"]["Enums"]["estado_publicacion"]
          grupo?: string
          id?: string
          idioma?: string
          imagen_id?: string | null
          publicado_en?: string | null
          seo_descripcion?: string
          seo_titulo?: string
          slug: string
          titulo?: string
        }
        Update: {
          actualizado_en?: string
          creado_en?: string
          estado?: Database["public"]["Enums"]["estado_publicacion"]
          grupo?: string
          id?: string
          idioma?: string
          imagen_id?: string | null
          publicado_en?: string | null
          seo_descripcion?: string
          seo_titulo?: string
          slug?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "paginas_idioma_fkey"
            columns: ["idioma"]
            isOneToOne: false
            referencedRelation: "idiomas"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "paginas_imagen_id_fkey"
            columns: ["imagen_id"]
            isOneToOne: false
            referencedRelation: "medios"
            referencedColumns: ["id"]
          },
        ]
      }
      proyecto_servicios: {
        Row: {
          destacado: boolean
          orden: number
          proyecto_id: string
          servicio_id: string
        }
        Insert: {
          destacado?: boolean
          orden?: number
          proyecto_id: string
          servicio_id: string
        }
        Update: {
          destacado?: boolean
          orden?: number
          proyecto_id?: string
          servicio_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "proyecto_servicios_proyecto_id_fkey"
            columns: ["proyecto_id"]
            isOneToOne: false
            referencedRelation: "proyectos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proyecto_servicios_servicio_id_fkey"
            columns: ["servicio_id"]
            isOneToOne: false
            referencedRelation: "servicios"
            referencedColumns: ["id"]
          },
        ]
      }
      proyectos: {
        Row: {
          actualizado_en: string
          anio: number | null
          camara: string
          clip_id: string | null
          con_juno: boolean
          categorias_extra: string[]
          como_lo_hicimos: string
          creado_en: string
          destacado_orden: number | null
          detras_de_camaras: Json
          direccion: string
          el_resultado: string
          el_reto: string
          estado: Database["public"]["Enums"]["estado_publicacion"]
          frase: string
          galeria: Json
          grupo: string
          historia: string
          id: string
          id_antiguo: string | null
          idioma: string
          imagen_cabecera_id: string | null
          imagen_id: string | null
          mi_papel: string
          orden: number
          papel: string
          premios: Json
          productora: string
          publicado_en: string | null
          seo_descripcion: string
          seo_titulo: string
          slug: string
          tarjeta: string
          tipo_id: string | null
          titulo: string
          titulos_seccion: Json
          video_portada_id: string | null
          videos: Json
          videos_debajo_del_texto: boolean
          youtube_id: string | null
          youtube_inicio: number | null
        }
        Insert: {
          actualizado_en?: string
          anio?: number | null
          camara?: string
          clip_id?: string | null
          con_juno?: boolean
          categorias_extra?: string[]
          como_lo_hicimos?: string
          creado_en?: string
          destacado_orden?: number | null
          detras_de_camaras?: Json
          direccion?: string
          el_resultado?: string
          el_reto?: string
          estado?: Database["public"]["Enums"]["estado_publicacion"]
          frase?: string
          galeria?: Json
          grupo?: string
          historia?: string
          id?: string
          id_antiguo?: string | null
          idioma?: string
          imagen_cabecera_id?: string | null
          imagen_id?: string | null
          mi_papel?: string
          orden?: number
          papel?: string
          premios?: Json
          productora?: string
          publicado_en?: string | null
          seo_descripcion?: string
          seo_titulo?: string
          slug: string
          tarjeta?: string
          tipo_id?: string | null
          titulo?: string
          titulos_seccion?: Json
          video_portada_id?: string | null
          videos?: Json
          videos_debajo_del_texto?: boolean
          youtube_id?: string | null
          youtube_inicio?: number | null
        }
        Update: {
          actualizado_en?: string
          anio?: number | null
          camara?: string
          clip_id?: string | null
          con_juno?: boolean
          categorias_extra?: string[]
          como_lo_hicimos?: string
          creado_en?: string
          destacado_orden?: number | null
          detras_de_camaras?: Json
          direccion?: string
          el_resultado?: string
          el_reto?: string
          estado?: Database["public"]["Enums"]["estado_publicacion"]
          frase?: string
          galeria?: Json
          grupo?: string
          historia?: string
          id?: string
          id_antiguo?: string | null
          idioma?: string
          imagen_cabecera_id?: string | null
          imagen_id?: string | null
          mi_papel?: string
          orden?: number
          papel?: string
          premios?: Json
          productora?: string
          publicado_en?: string | null
          seo_descripcion?: string
          seo_titulo?: string
          slug?: string
          tarjeta?: string
          tipo_id?: string | null
          titulo?: string
          titulos_seccion?: Json
          video_portada_id?: string | null
          videos?: Json
          videos_debajo_del_texto?: boolean
          youtube_id?: string | null
          youtube_inicio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "proyectos_clip_id_fkey"
            columns: ["clip_id"]
            isOneToOne: false
            referencedRelation: "medios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proyectos_idioma_fkey"
            columns: ["idioma"]
            isOneToOne: false
            referencedRelation: "idiomas"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "proyectos_imagen_cabecera_id_fkey"
            columns: ["imagen_cabecera_id"]
            isOneToOne: false
            referencedRelation: "medios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proyectos_imagen_id_fkey"
            columns: ["imagen_id"]
            isOneToOne: false
            referencedRelation: "medios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proyectos_tipo_id_fkey"
            columns: ["tipo_id"]
            isOneToOne: false
            referencedRelation: "tipos_proyecto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proyectos_video_portada_id_fkey"
            columns: ["video_portada_id"]
            isOneToOne: false
            referencedRelation: "medios"
            referencedColumns: ["id"]
          },
        ]
      }
      redirecciones: {
        Row: {
          creado_en: string
          desde: string
          hacia: string
        }
        Insert: {
          creado_en?: string
          desde: string
          hacia: string
        }
        Update: {
          creado_en?: string
          desde?: string
          hacia?: string
        }
        Relationships: []
      }
      revisiones: {
        Row: {
          autor: string | null
          creado_en: string
          datos: Json
          fila_id: string
          id: string
          tabla: string
        }
        Insert: {
          autor?: string | null
          creado_en?: string
          datos: Json
          fila_id: string
          id?: string
          tabla: string
        }
        Update: {
          autor?: string | null
          creado_en?: string
          datos?: Json
          fila_id?: string
          id?: string
          tabla?: string
        }
        Relationships: []
      }
      servicios: {
        Row: {
          actualizado_en: string
          aporto: Json
          con_quien: string
          creado_en: string
          estado: Database["public"]["Enums"]["estado_publicacion"]
          fotos_cabecera: Json
          frase: string
          grupo: string
          id: string
          idioma: string
          imagen_apaisada_id: string | null
          imagen_id: string | null
          llamada: string
          mirada: Json
          nombre: string
          orden: number
          para_quien: Json
          pasos: Json
          preguntas: Json
          publicado_en: string | null
          resumen: string
          seo_descripcion: string
          seo_titulo: string
          slug: string
          titulo_mirada: string
        }
        Insert: {
          actualizado_en?: string
          aporto?: Json
          con_quien?: string
          creado_en?: string
          estado?: Database["public"]["Enums"]["estado_publicacion"]
          fotos_cabecera?: Json
          frase?: string
          grupo?: string
          id?: string
          idioma?: string
          imagen_apaisada_id?: string | null
          imagen_id?: string | null
          llamada?: string
          mirada?: Json
          nombre?: string
          orden?: number
          para_quien?: Json
          pasos?: Json
          preguntas?: Json
          publicado_en?: string | null
          resumen?: string
          seo_descripcion?: string
          seo_titulo?: string
          slug: string
          titulo_mirada?: string
        }
        Update: {
          actualizado_en?: string
          aporto?: Json
          con_quien?: string
          creado_en?: string
          estado?: Database["public"]["Enums"]["estado_publicacion"]
          fotos_cabecera?: Json
          frase?: string
          grupo?: string
          id?: string
          idioma?: string
          imagen_apaisada_id?: string | null
          imagen_id?: string | null
          llamada?: string
          mirada?: Json
          nombre?: string
          orden?: number
          para_quien?: Json
          pasos?: Json
          preguntas?: Json
          publicado_en?: string | null
          resumen?: string
          seo_descripcion?: string
          seo_titulo?: string
          slug?: string
          titulo_mirada?: string
        }
        Relationships: [
          {
            foreignKeyName: "servicios_idioma_fkey"
            columns: ["idioma"]
            isOneToOne: false
            referencedRelation: "idiomas"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "servicios_imagen_apaisada_id_fkey"
            columns: ["imagen_apaisada_id"]
            isOneToOne: false
            referencedRelation: "medios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "servicios_imagen_id_fkey"
            columns: ["imagen_id"]
            isOneToOne: false
            referencedRelation: "medios"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_proyecto: {
        Row: {
          actualizado_en: string
          creado_en: string
          en_listado_general: boolean
          grupo: string
          id: string
          idioma: string
          nombre: string
          orden: number
          slug: string
        }
        Insert: {
          actualizado_en?: string
          creado_en?: string
          en_listado_general?: boolean
          grupo?: string
          id?: string
          idioma?: string
          nombre: string
          orden?: number
          slug: string
        }
        Update: {
          actualizado_en?: string
          creado_en?: string
          en_listado_general?: boolean
          grupo?: string
          id?: string
          idioma?: string
          nombre?: string
          orden?: number
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "tipos_proyecto_idioma_fkey"
            columns: ["idioma"]
            isOneToOne: false
            referencedRelation: "idiomas"
            referencedColumns: ["codigo"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claves_extra: { Args: { p_tabla: string }; Returns: string[] }
      columnas_editables: { Args: { p_tabla: string }; Returns: string[] }
      comprobar_lista_medios: {
        Args: { p_campo: string; p_lista: Json }
        Returns: undefined
      }
      descartar: { Args: { p_id: string; p_tabla: string }; Returns: undefined }
      es_admin: { Args: never; Returns: boolean }
      extras_publicados: {
        Args: { p_id: string; p_tabla: string }
        Returns: Json
      }
      publicar: { Args: { p_id: string; p_tabla: string }; Returns: undefined }
      restaurar_revision: { Args: { p_revision: string }; Returns: undefined }
      sincronizar_bloques: {
        Args: { p_lista: Json; p_pagina: string }
        Returns: undefined
      }
      sincronizar_servicios: {
        Args: { p_lista: Json; p_proyecto: string }
        Returns: undefined
      }
    }
    Enums: {
      estado_mensaje: "nuevo" | "respondido" | "cerrado"
      estado_publicacion: "borrador" | "publicado"
      estilo_cliente: "logo" | "nombre" | "firma"
      tipo_bloque:
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
        | "llamada"
        | "galeria"
        | "video"
        | "cita"
        | "colaboracion"
      tipo_medio: "imagen" | "video" | "documento"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      estado_mensaje: ["nuevo", "respondido", "cerrado"],
      estado_publicacion: ["borrador", "publicado"],
      estilo_cliente: ["logo", "nombre", "firma"],
      tipo_bloque: [
        "portada",
        "servicios",
        "filmmaker",
        "trabajos",
        "cifras",
        "proceso",
        "sobre-mi",
        "opiniones",
        "clientes",
        "blog",
        "texto",
        "llamada",
        "galeria",
        "video",
        "cita",
        "colaboracion",
      ],
      tipo_medio: ["imagen", "video", "documento"],
    },
  },
} as const
