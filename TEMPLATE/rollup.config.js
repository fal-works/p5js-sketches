import typescript from "rollup-plugin-typescript2";
import cleanup from "rollup-plugin-cleanup";

const title = "Title";
const comment = "Website => https://www.fal-works.com/";
const version = "0.1.0";
const copyright = "2019 FAL";
const author = "FAL <contact@fal-works.com>";
const license = "CC-BY-SA-3.0";

const hasAdditionalBanner = false;
const additionalBanner = `/**
 *
 */
`;

const bannerComment =
  `/**
 * ${title}.
 * ${comment}
 * @copyright ${copyright}
 * @author ${author}
 * @version ${version}
 * @license ${license}
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
