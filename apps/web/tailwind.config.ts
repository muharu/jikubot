import type { Config } from "tailwindcss";

import baseConfig from "@giverve/tailwind-config/web";

export default {
  /**
   * Tailwind CSS configuration file.
   *
   * This configuration extends the base setup by including additional content paths.
   * Specifically, it adds the path to the UI package located in `../../packages/ui/`
   * to ensure that Tailwind CSS classes used within that package are recognized.
   *
   * @note Including the UI package may trigger warnings from Tailwind CSS about
   *       content paths. This is expected due to the location of the package in `node_modules`
   *       and can be safely ignored.
   *
   * @note example warning by Tailwind CSS will look like:
   * Your `content` configuration includes a pattern which looks like it's accidentally matching all of `node_modules` and can cause serious performance issues.
   * Pattern: `..\..\packages\ui\**\*.ts`
   */
  content: [...baseConfig.content, "../../packages/ui/**/*.{ts,tsx}"],
  presets: [baseConfig],
  theme: {},
} satisfies Config;
