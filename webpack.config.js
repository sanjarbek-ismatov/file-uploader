const webpackNodeExternals = require("webpack-node-externals");
const htmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
module.exports = {
  entry: "./index.ts",
  mode: process.env.NODE_ENV,
  target: "node",
  externals: [webpackNodeExternals()],
  output: {
    filename:
      process.env.NODE_ENV === "development"
        ? "bundle-development.js"
        : "bundle-production.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: ["ts-loader"],
      },
      // { test: /\.ejs$/i, use: ["html-loader", "template-ejs-loader"] },
    ],
  },
  // plugins: [
  //   new htmlWebpackPlugin({
  //     filename: "index.html",
  //     template: "./views/index.ejs",
  //   }),
  // ],
};
