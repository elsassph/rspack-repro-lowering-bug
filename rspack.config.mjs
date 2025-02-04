import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isRunningWebpack = !!process.env.WEBPACK;
const isRunningRspack = !!process.env.RSPACK;
if (!isRunningRspack && !isRunningWebpack) {
  throw new Error("Unknown bundler");
}

function getSwcOptions(es5) {
  return es5 === "1"
    ? {
        isModule: "unknown", // autodetect ESM vs CJS
        jsc: {
          externalHelpers: true,
        },
        env: {
          mode: "usage",
          coreJs: "3.40.0",
          target: "es2015",
        },
      }
    : undefined;
}

/**
 * @type {import('webpack').Configuration | import('@rspack/cli').Configuration}
 */
const config = {
  mode: "development",
  devtool: false,
  entry: {
    main: "./src/index",
  },
  plugins: [new HtmlWebpackPlugin()],
  output: {
    clean: true,
    path: isRunningWebpack
      ? path.resolve(__dirname, "webpack-dist")
      : path.resolve(__dirname, "rspack-dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      // transpile and polyfill app code
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        loader: "builtin:swc-loader",
        options: getSwcOptions(process.env.ES5),
        type: "javascript/auto",
      },

      // transpile and polyfill 'external' NPM libraries
      {
        test: /\.m?js$/,
        include: [/node_modules/],
        exclude: [/node_modules(\/|\\)core-js/],
        loader: "builtin:swc-loader",
        options: getSwcOptions(process.env.ES5),
        type: "javascript/auto",
      },
    ],
  },
  experiments: {
    css: true,
  },
};

export default config;
