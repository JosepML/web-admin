import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oadmqwtnxpbotxcgzaoo.supabase.co").trim().replace(/\/+$/, "");
const SUPABASE_KEY = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_cuj1iVbaEM0X_C9YiYV7eQ_FgwCxbbo").trim();

/**
 * Sesión de Josep: refresca la cookie de Supabase cuando caduca y protege /admin.
 * Un visitante no tiene cookie de sesión y pasa sin ninguna consulta (la web pública no se frena).
 */
export async function middleware(req: NextRequest) {
  const enAdmin = req.nextUrl.pathname.startsWith("/admin");
  const entrar = req.nextUrl.pathname === "/admin/entrar";
  const conSesion = req.cookies.getAll().some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"));

  if (!conSesion) {
    if (enAdmin && !entrar) return aEntrar(req);
    return NextResponse.next();
  }

  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll(cookies) {
        cookies.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        cookies.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });
  // getUser() valida el token con Supabase y, si ha caducado, lo renueva (setAll guarda el nuevo)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (enAdmin && !entrar && !user) return aEntrar(req);
  return res;
}

function aEntrar(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/admin/entrar";
  url.search = `?volver=${encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Todo menos los archivos estáticos y las imágenes optimizadas
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|avif|mp4|ico)$).*)"],
};
