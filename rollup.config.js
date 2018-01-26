import jsx from "rollup-plugin-jsx";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import postcss from 'rollup-plugin-postcss';

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "umd",
    name: "ThresholdEditor",
    globals: {
      backbone: "Backbone",
      underscore: "_"
    }
  },
  external: ["jquery", "underscore", "backbone"],
  plugins: [
    postcss({
      plugins:[],
      sourceMap: true,
    }),
    resolve(),
    jsx({ factory: "h" }),
    commonjs(),
    babel({
      exclude: "node_modules/**"
    }),
    
  ]
};
