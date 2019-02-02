// webpack是node.js写出来的
let path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devServer: {
    // 开发服务器的配置
    port: 3000,
    progress: true,
    contentBase: "./build",
    compress: true
  },
  mode: "production", // production development
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
    })
  ]
};
