import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";
import del from "rollup-plugin-delete";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pkg = require("./package.json");

const banner = `/* TableKit v${pkg.version} | (c) 2025 Mukesh Piprotar | MIT License */`;

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/tablekit.umd.js",
        format: "umd",
        name: "TableKit",
        globals: { jquery: "$" },
        banner,
      },
      {
        file: "dist/tablekit.esm.js",
        format: "esm",
      },
    ],
    external: ["jquery", "datatables.net"],
    plugins: [
      json(),
      typescript(),
      postcss({
        extract: true, // creates dist/tablekit.css
        minimize: true,
      }),
      replace({
        preventAssignment: true,
        __VERSION__: pkg.version, // 👈 inject version
      }),
      del({
        targets: "dist/*",
        exclude: ["dist/tablekit.umd.min.js", "dist/tablekit.umd.min.css"],
        hook: "buildEnd", // <-- delete at the end of the build
      }),
    ],
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/tablekit.umd.min.js",
        format: "umd",
        name: "TableKit",
        globals: { jquery: "$" },
        sourcemap: true,
      },
      {
        file: "dist/tablekit.esm.min.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    external: ["jquery", "datatables.net"],
    plugins: [
      terser(),
      json(),
      typescript(),
      postcss({
        extract: true, // creates dist/tablekit.css
        minimize: true,
      }),
      replace({
        preventAssignment: true,
        __VERSION__: pkg.version, // 👈 inject version
      }),
      del({
        targets: "dist/*",
        exclude: ["dist/tablekit.umd.min.js", "dist/tablekit.umd.min.css"],
        hook: "buildEnd", // <-- delete at the end of the build
      }),
    ],
  },
];
