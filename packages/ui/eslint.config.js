import baseConfig from "@giverve/eslint-config/base";
import reactConfig from "@giverve/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [],
  },
  ...baseConfig,
  ...reactConfig,
];
