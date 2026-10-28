import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "legacy/**",
    ],
  },
  {
    // Los prototipos usan imágenes externas de la web antigua; en la fase 5 se pasa a next/image
    // La web usa <img> con img() (src/components/comun/imagen.ts), que ya pasa por el optimizador de Next
    files: ["src/app/prototipos/**", "src/components/**", "src/app/(web)/**"],
    rules: { "@next/next/no-img-element": "off" },
  },
];

export default eslintConfig;
