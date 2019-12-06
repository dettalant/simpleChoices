import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

// dealing with scoped package name
const pkgName = pkg.name.split("/").pop();
const bannerComment = `/*!
 *   ${pkgName}.js
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
  name: pkgName,
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
