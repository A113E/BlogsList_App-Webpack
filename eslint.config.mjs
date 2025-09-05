import js from "@eslint/js";
import globals from "globals";
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from "eslint/config";


export default defineConfig([
  globalIgnores(["./build/"]),
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js, stylistic }, extends: ["js/recommended"], languageOptions: { globals: globals.node },
   rules: { // Reglas para definir estilos de correcion esLint
      eqeqeq: "error",
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-console": 0,
    },
},
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
]);
