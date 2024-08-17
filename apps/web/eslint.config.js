import baseConfig, { restrictEnvAccess } from "@giverve/eslint-config/base";
import nextjsConfig from "@giverve/eslint-config/nextjs";
import reactConfig from "@giverve/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
