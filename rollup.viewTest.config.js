import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

const plugins = [
  typescript({
    tsconfig: "./tsconfig-build.json",
    tsconfigOverride: {
      compilerOptions: { declaration: false }
    }
  }),
];

export default {
  input: "viewTest/viewTest.ts",
  output: {
    file: "viewTest/index.js",
    format: "iife",
    name: pkg.name,
  },
  plugins
};
