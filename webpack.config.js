let path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let webpack = require("webpack");

module.exports = {
  // 多入口
  entry: {
    home: "./src/index.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  // 解析第三方包 common
  resolve: {
    // modules: [path.resolve("node_modules")],
    // 扩展名
    // extensions: [".js", ".css", ".json", ".vue"]
    // mainFields: ["style", "main"],
    //入口的名字 默认为index.js
    // mainFiles: [],
    // 别名
    // alias: {
    //   bootstrap: "bootstrap/dist/css/bootstrap.css"
    // }
  },
  devServer: {
    // 3.把前端代码启动到服务端上
    // 2.前端单纯想模拟数据
    // before(app) {
    //   app.get("/api/user", (req, res) => {
    //     res.json({ name: "musion-before" });
    //   });
    // }
    // 1.重写的方式，把请求代理到express服务器上 代理
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:3000",
    //     pathRewrite: { "/api": "" }
    //   }
    // }
  },
  output: {
    // name -> home a
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html"
    }),
    new webpack.DefinePlugin({
      DEV: JSON.stringify("production")
    })
  ]
};

// // webpack是node.js写出来的
// let path = require("path");
// let HtmlWebpackPlugin = require("html-webpack-plugin");
// let MiniCssExtractPlugin = require("mini-css-extract-plugin");
// let optimizeCss = require("optimize-css-assets-webpack-plugin");
// let UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// let webpack = require("webpack");

// module.exports = {
//   optimization: {
//     minimizer: [
//       new UglifyJsPlugin({
//         cache: true,
//         parallel: true,
//         sourceMap: true
//       }),
//       new optimizeCss()
//     ]
//   },
//   mode: "development", // production development
//   entry: "./src/index.js", // 入口
//   output: {
//     filename: "bundle.[hash].js", // 📦之后的文件名
//     path: path.resolve(__dirname, "build") // 路径必须是一个绝对路径
//   },
//   plugins: [
//     // 数组，放着所有的webpack插件
//     new HtmlWebpackPlugin({
//       template: "./src/index.html",
//       filename: "index.html",
//       // 将html压缩
//       minify: {
//         removeAttributeQuotes: true,
//         collapseWhitespace: true
//       },
//       hash: true
//     }),
//     new MiniCssExtractPlugin({
//       filename: "css/main.css"
//     }),
//     new webpack.ProvidePlugin({
//       // 在每个模块中都注入$
//       $: "jquery"
//     })
//   ],
//   // 模块
//   module: {
//     rules: [
//       // loader的顺序，字符串只用一个loader，多个loader需要[]，默认是从右向左执行，从下向上执行
//       {
//         test: /\.html$/,
//         use: "html-withimg-loader"
//       },
//       {
//         test: /\.(png|jpg|gif)$/,
//         // 做一个限制，当我们的图片小于多少K时，用base 64转化
//         // 否则用file-loader产生真实的图片
//         use: {
//           loader: "url-loader",
//           options: {
//             limit: 1,
//             outputPath: "/img/"
//           }
//         }
//       },
//       {
//         test: require.resolve("jquery"),
//         use: "expose-loader?$"
//       },
//       // {
//       //   test: /\.js$/,
//       //   use: {
//       //     loader: "eslint-loader",
//       //     options: {
//       //       enforce: "pre" // previous post
//       //     }
//       //   }
//       // },
//       {
//         test: /\.js$/, // normal
//         use: {
//           loader: "babel-loader",
//           options: {
//             // 用babel-loader 需要把es6 -> es5
//             presets: ["@babel/preset-env"],
//             plugins: [
//               ["@babel/plugin-proposal-decorators", { legacy: true }],
//               ["@babel/plugin-proposal-class-properties", { loose: false }],
//               "@babel/plugin-transform-runtime"
//             ]
//           }
//         },
//         include: path.resolve(__dirname, "src"),
//         exclude: /node_modules/
//       },
// {
//   test: /\.css$/,
//   use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
// },
//       {
//         test: /\.less$/,
//         use: [
//           MiniCssExtractPlugin.loader,
//           "css-loader", // @import 解析路径
//           "less-loader", // 把less -> css
//           "postcss-loader"
//         ]
//       }
//     ]
//   }
// };
