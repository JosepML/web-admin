"use server";

// Dispara la reconstrucción y despliegue automático de la web pública en GitHub Pages.
// Requiere la variable GITHUB_DISPATCH_TOKEN en .env.local (o en el entorno del panel).
// Usa la API oficial de GitHub: repository_dispatch -> event_type: "publicar_contenido".

export async function dispararDespliegueWeb(): Promise<{ ok: boolean; mensaje?: string }> {
  const token = process.env.GITHUB_DISPATCH_TOKEN?.trim();
  if (!token) {
    console.warn("Falta GITHUB_DISPATCH_TOKEN en las variables de entorno de Vercel.");
    return {
      ok: false,
      mensaje: "Guardado en Supabase, pero falta configurar GITHUB_DISPATCH_TOKEN en Vercel para compilar GitHub Pages.",
    };
  }

  try {
    const res = await fetch("https://api.github.com/repos/JosepML/web-publica/dispatches", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "JosepMira-WebAdmin",
      },
      body: JSON.stringify({ event_type: "publicar_contenido" }),
    });

    if (res.ok || res.status === 204) {
      return { ok: true, mensaje: "Publicado en Supabase y compilando web pública (lista en ~2 min)." };
    }

    return { ok: false, mensaje: `GitHub respondió con código ${res.status}. Comprueba los permisos del token.` };
  } catch (e) {
    return { ok: false, mensaje: e instanceof Error ? e.message : String(e) };
  }
}
