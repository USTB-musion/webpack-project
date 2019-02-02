// webpack是node.js写出来的
let path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let MiniCssExtractPlugin = require("mini-css-extract-plugin");
let optimizeCss = require("optimize-css-assets-webpack-plugin");
let UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new optimizeCss()
    ]
  },
  mode: "development", // production development
  entry: "./src/index.js", // 入口
  output: {
    filename: "bundle.[hash].js", // 📦之后的文件名
    path: path.resolve(__dirname, "build") // 路径必须是一个绝对路径
  },
  plugins: [
    // 数组，放着所有的webpack插件
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      // 将html压缩
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true
      },
      hash: true
    }),
    new MiniCssExtractPlugin({
      filename: "main.css"
    })
  ],
  // 模块
  module: {
    rules: [
      // loader的顺序，字符串只用一个loader，多个loader需要[]，默认是从右向左执行，从下向上执行
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader", // @import 解析路径
          "less-loader", // 把less -> css
          "postcss-loader"
        ]
      }
    ]
  }
};
