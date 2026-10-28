"use client";

import type { Medio } from "@/lib/datos/tipos";
import { Revelar } from "../piezas";
import { FormularioContacto } from "./FormularioContacto";
import { Retrato } from "./Retrato";

/**
 * Foto de Josep con el título encima y, al lado, el formulario: la página /contacto y la llamada («Hablemos») del
 * final de las demás páginas son esta misma pieza. En pantallas anchas los dos lados miden lo mismo.
 */
export function SeccionContacto({
  medio,
  cabecera,
  opciones,
  marcados,
  valor,
  alCambiar,
  nota,
  origen,
}: {
  medio: Medio | null;
  /** Título y texto que van sobre la foto */
  cabecera: React.ReactNode;
  opciones: string[];
  marcados?: string[];
  valor?: string[];
  alCambiar?: (lista: string[]) => void;
  nota?: React.ReactNode;
  origen?: string;
}) {
  return (
    <div className="mx-auto grid max-w-7xl items-stretch gap-4 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
      <div className="lg:h-full">
        {medio ? (
          <Retrato medio={medio} className="lg:h-full">
            {cabecera}
          </Retrato>
        ) : (
          <div>{cabecera}</div>
        )}
      </div>
      <Revelar retraso={0.2} className="lg:h-full">
        <FormularioContacto opciones={opciones} marcados={marcados} valor={valor} alCambiar={alCambiar} nota={nota} origen={origen} />
      </Revelar>
    </div>
  );
}
