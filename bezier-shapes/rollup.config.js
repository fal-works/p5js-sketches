import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";

// ---- settings ------------

const name = "Bezier Shapes";
const version = "0.1.0";
const bundleFalWorksLibraries = false;

// --------------------------

const bundledLibraries = bundleFalWorksLibraries
  ? `
 *
 * Bundled libraries:
 *   @fal-works/creative-coding-core (MIT license)
 *   @fal-works/p5-extension (MIT license)
 *`
  : "";

const bannerComment = `/**
 * ${name}.${bundledLibraries}
 * @copyright 2019 FAL
 * @version ${version}
 */
`;

const typescriptPlugin = typescript({
  useTsconfigDeclarationDir: true
});

const globals = bundleFalWorksLibraries
  ? {
      p5: "p5"
    }
  : {
      p5: "p5",
      "@fal-works/creative-coding-core": "CreativeCodingCore",
      "@fal-works/p5-extension": "p5ex"
    };

const external = bundleFalWorksLibraries
  ? ["p5"]
  : ["p5", "@fal-works/creative-coding-core", "@fal-works/p5-extension"];

const plugins = bundleFalWorksLibraries
  ? [
      resolve({
        extensions: [".mjs"],
        modulesOnly: true
      }),
      typescriptPlugin
    ]
  : [typescriptPlugin];

const config = {
  input: "src/main.ts",
  output: {
    file: "dist/main.js",
    format: "iife",
    sourcemap: true,
    banner: bannerComment,
    preferConst: true,
    globals
  },
  external,
  plugins
};

export default config;
