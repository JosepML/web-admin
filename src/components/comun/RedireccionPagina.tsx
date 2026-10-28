"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RedireccionPagina({ hacia }: { hacia: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(hacia);
  }, [hacia, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center text-center">
      <meta httpEquiv="refresh" content={`0; url=${hacia}`} />
      <link rel="canonical" href={hacia} />
      <p className="text-sm text-[var(--jm-suave)]">
        Redirigiendo a <a href={hacia} className="underline text-[var(--jm-texto)]">{hacia}</a>…
      </p>
    </div>
  );
}
