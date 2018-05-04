import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import cleanup from 'rollup-plugin-cleanup';

const title = 'Rectangle Lives';
const version = '0.2.0';

const hasAdditionalBanner = true;
const additionalBanner = `/**
 * Reused codes from:
 *   "ca-formats" v0.0.0
 *   © 2018 Jamen Marz
 *   MIT license
 *   https://github.com/jamen/ca-formats
 *
 * Modification by FAL.
 */
`;

const myBanner = `/**
 * ${title}.
 * Website => https://www.fal-works.com/
 * Including module: p5ex (Copyright 2018 FAL, licensed under MIT).
 * @copyright 2018 FAL
 * @author FAL <falworks.contact@gmail.com>
 * @version ${version}
 * @license CC-BY-SA-3.0
 */
` + (hasAdditionalBanner ? ('\n' + additionalBanner) : "");



export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/sketch.js',
    format: 'iife',
    sourcemap: true,
    name: 'rectangleLives',
    globals: {
      // 'p5ex': 'p5ex',
    },
    banner: myBanner
  },
  external: [
    // 'p5ex',
  ],
  plugins: [
    resolve({
      extensions: ['.js', '.mjs'],
      modulesOnly: false
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
      extensions: ['.ts', '.mjs']
    })
  ],
}
