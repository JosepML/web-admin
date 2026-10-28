import type { MetadataRoute } from "next";
import { URL_SITIO } from "@/lib/seo/url";

export default function robots(): MetadataRoute.Robots {
  // Al lanzar (fase 7), NEXT_PUBLIC_INDEXAR="1" abre el rastreo público.
  const indexar = process.env.NEXT_PUBLIC_INDEXAR === "1";

  if (!indexar) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: `${URL_SITIO}/sitemap.xml`,
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/prototipos", "/prototipos/", "/gracias"],
    },
    sitemap: `${URL_SITIO}/sitemap.xml`,
  };
}
