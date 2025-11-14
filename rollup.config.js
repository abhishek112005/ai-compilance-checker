import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import babel from "@rollup/plugin-babel"
import postcss from "rollup-plugin-postcss"

export default [
  {
    input: "lib/index.js",
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/index.esm.js",
        format: "es",
        sourcemap: true,
      },
    ],
    external: ["react", "react-dom"],
    plugins: [
      resolve({
        browser: true,
      }),
      commonjs(),
      babel({
        babelHelpers: "bundled",
        presets: [["@babel/preset-react", { runtime: "automatic" }]],
        extensions: [".js", ".jsx"],
      }),
      postcss({
        extract: true,
        minimize: true,
      }),
    ],
  },
]
