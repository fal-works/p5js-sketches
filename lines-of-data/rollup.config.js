import typescript from "rollup-plugin-typescript2";
import cleanup from "rollup-plugin-cleanup";

const title = "Lines of Data";
const version = "0.1.2";

const hasAdditionalBanner = false;
const additionalBanner = `/**
 *
 */
`;

const bannerComment =
  `/**
 * ${title}.
 * Website => https://www.fal-works.com/
 * @copyright 2019 FAL
 * @author FAL <contact@fal-works.com>
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
    banner: bannerComment,
    preferConst: true,
    globals: {
      p5: "p5"
    }
  },
  external: ["p5"],
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true
    }),
    cleanup({
      comments: [/^\*\*(?![\s\S]*@module\b)/],
      maxEmptyLines: 2,
      extensions: [".js", ".ts", ".mjs"]
    })
  ]
};
