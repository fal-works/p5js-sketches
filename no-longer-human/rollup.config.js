import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import cleanup from "rollup-plugin-cleanup";

const title = "NoLongerHuman";
const version = "0.1.0";

const hasAdditionalBanner = true;
const additionalBanner = `/**
 * Font from: [Oradano明朝GSSRフォント](http://www.asahi-net.or.jp/~sd5a-ucd/freefonts/Oradano-Mincho/)
 * Text from: [青空文庫 ＞ 人間失格（太宰治）](https://www.aozora.gr.jp/cards/000035/files/301_14912.html)
 */
`;

const myBanner =
  `/**
 * ${title}.
 * Website => https://www.fal-works.com/
 * Including module: p5ex (Copyright 2018 FAL, licensed under MIT).
 * @copyright 2018 FAL
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
      comments: [
        /^\*\*(?![\s\S]*@module\b)/,
        /^\*[^*](?!\s*tslint\s*:\s*(enable|disable))/,
        /^\/(?!\s*tslint\s*:\s*(enable|disable))/
      ],
      maxEmptyLines: 1,
      extensions: [".ts", ".mjs"]
    })
  ]
};
