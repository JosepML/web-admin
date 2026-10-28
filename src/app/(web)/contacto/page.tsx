import type { Metadata } from "next";
import { SeccionContacto } from "@/components/contacto/SeccionContacto";
import { Revelar, Titular } from "@/components/piezas";
import { getPagina } from "@/lib/datos/paginas";
import { getFotoContacto } from "@/lib/datos/contacto";
import { getServicios } from "@/lib/datos/servicios";
import { textos } from "@/lib/datos/util";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Cuéntame tu proyecto y te respondo.",
};

// Formulario que guarda en la base; no depende de la caché de datos

export default async function Contacto({ searchParams }: { searchParams: Promise<{ temas?: string }> }) {
  const [servicios, inicio, { temas }] = await Promise.all([getServicios(), getPagina("inicio"), searchParams]);
  // Foto de Josep en un rodaje; si faltara, la del servicio Filmmaker
  const foto = await getFotoContacto(servicios.find((s) => s.slug === "filmmaker")?.imagen ?? null);
  // Las mismas pastillas que la llamada «¿Tienes una historia que contar?» del final de las páginas: los servicios y las ideas
  // de ese bloque. Lo que se eligió allí llega aquí marcado (?temas=Filmmaker,Videoclip)
  const ideas = textos(inicio?.bloques.find((b) => b.tipo === "llamada")?.datos.opciones);
  const opciones = [...servicios.map((s) => s.nombre), ...ideas];
  const marcados = (temas ?? "").split(",").map((t) => t.trim()).filter((t) => opciones.includes(t));
  return (
    <section className="px-4 pb-24 pt-28 sm:px-8 sm:pt-32">
      <SeccionContacto
        medio={foto}
        opciones={opciones}
        marcados={marcados}
        cabecera={
          <>
            <Titular nivel={1} antetitulo="Contacto" titulo="Hablemos de tu *proyecto*" />
            <Revelar retraso={0.12}>
              <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--jm-suave)]">
                Cuéntame qué tienes en mente, aunque aún no esté claro. Lo pensamos juntos y te propongo cómo llevarlo a la pantalla. Sin compromiso.
              </p>
            </Revelar>
          </>
        }
      />
    </section>
  );
}
