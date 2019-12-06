import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

const bannerComment = `/*!
 *   ${pkg.name}.js
 *
 * @author dettalant
 * @version v${pkg.version}
 * @license ${pkg.license} License
 */`;

const plugins = [
  typescript({
    tsconfig: "tsconfig-build.json",
    useTsconfigDeclarationDir: true
  }),
];

const buildName = ["index", ".js"];

const dirName = "./dist/";
const cjsOutput = {
  dir: dirName,
  entryFileNames: buildName.join(""),
  format: "cjs",
  name: pkg.name,
  banner: bannerComment,
  sourceMap: "inline",
}

export default {
  input: "./src/index.ts",
  output: [
    cjsOutput,
  ],
  plugins
};
