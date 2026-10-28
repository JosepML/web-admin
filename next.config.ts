import type { NextConfig } from "next";

const local = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("http://localhost");

const nextConfig: NextConfig = {
  // Panel de administración dinámico (autenticación con Supabase, middleware y API routes)
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "oadmqwtnxpbotxcgzaoo.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "i9.ytimg.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "www.edigitalagency.com.au" },
      { protocol: "https", hostname: "iili.io" },
      { protocol: "https", hostname: "i.postimg.cc" },
      { protocol: "https", hostname: "www.platinocrowdfunding.com" },
      { protocol: "https", hostname: "rbgescuela.com" },
      ...(local ? [{ protocol: "http" as const, hostname: "localhost", port: "54321" }] : []),
    ],
  },
};

export default nextConfig;
