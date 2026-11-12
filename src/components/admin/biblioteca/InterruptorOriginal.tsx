"use client";

import { useEffect, useState } from "react";
import { fijarSubirOriginal, subirOriginal } from "@/lib/admin/comprimir";

/** «Subir original sin comprimir»: por defecto las fotos se reducen al subirlas (máx. 2400 px). Se recuerda en este navegador. */
export function InterruptorOriginal() {
  const [original, setOriginal] = useState(false);
  useEffect(() => setOriginal(subirOriginal()), []);
  return (
    <label className="mt-2 flex w-fit cursor-pointer items-center gap-2 text-xs text-[var(--jm-tenue)]">
      <input
        type="checkbox"
        checked={original}
        onChange={(e) => {
          setOriginal(e.target.checked);
          fijarSubirOriginal(e.target.checked);
        }}
      />
      Subir original sin comprimir (si no, las fotos se reducen a un máximo de 2400 px al subirlas)
    </label>
  );
}
