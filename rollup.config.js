import jsx from "rollup-plugin-jsx";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "src/index.jsx",
  output: {
    file: "dist/bundle.js",
    format: "umd",
    name: "ThresholdEditor",
    globals: {
      backbone: "Backbone"
    }
  },
  external: ["jquery", "underscore", "backbone"],
  plugins: [resolve(), jsx({ factory: "h" }), commonjs()]
};
