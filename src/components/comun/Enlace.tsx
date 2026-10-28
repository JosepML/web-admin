"use client";

import Link from "next/link";
import { useTransicion } from "./Transicion";

type Props = Omit<React.ComponentProps<typeof Link>, "href"> & { href: string; fundido?: boolean };

/**
 * Enlace interno que navega con la transición de la web.
 * Si dentro hay una imagen con data-transicion, es la que crece hasta la cabecera. Con `fundido`, la imagen no
 * crece (la página de destino no la lleva de cabecera): solo el fundido corto.
 */
export function Enlace({ href, onClick, fundido, ...resto }: Props) {
  const ir = useTransicion();
  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        ir(href, fundido ? null : e.currentTarget.querySelector<HTMLImageElement>("img[data-transicion]"));
      }}
      {...resto}
    />
  );
}
