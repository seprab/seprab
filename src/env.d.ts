/// <reference types="astro/client" />

// YAML files are imported as plain data (wired up by @rollup/plugin-yaml in
// astro.config.mjs). Real typing/validation happens in src/lib/data.ts via zod.
declare module '*.yaml' {
  const data: unknown;
  export default data;
}
