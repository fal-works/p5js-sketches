import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import cleanup from "rollup-plugin-cleanup";

const title = "Rotational Symmetry";
const version = "0.1.8";

const hasAdditionalBanner = false;
const additionalBanner = `/**
 *
 */
`;

const myBanner =
  `/**
 * ${title}.
 * Website => https://www.fal-works.com/
 * @copyright 2019 FAL
 * @author FAL <falworks.contact@gmail.com>
 * @version ${version}
 * @license CC-BY-SA-3.0
 */
` + (hasAdditionalBanner ? "\n" + additionalBanner : "");

export default {
  input: "src/main.ts",
  output: {
    file: "dist/sketch.js",
    format: "iife",
    sourcemap: true,
    globals: {
      // p5ex: "p5ex"
    },
    banner: myBanner
  },
  // external: ["p5ex"],
  plugins: [
    resolve({
      extensions: [".js", ".mjs"],
      modulesOnly: true
    }),
    typescript({
      useTsconfigDeclarationDir: true
    }),
    cleanup({
      comments: [/^\*\*(?![\s\S]*@module\b)/],
      maxEmptyLines: 2,
      extensions: [".ts", ".mjs"]
    })
  ]
};
