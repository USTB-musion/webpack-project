##使用说明

- 切换不同的分支对应对应的代码
- 分为 webpack 基础配置，webpack 优化，taptable，手写 webpack，手写 loader，手写 plugins

## webpack 可以进行 0 配置

- 📦 工具 -> 输出后的结果(JS 模块)
- 📦(支持 js 的模块化)

## 手动配置 webpack

- webpack 的 0 配置有点弱
- 默认配置文件的名字 webpack.config.js

## 转化 ES6 语法

````js
      {
        test: /\.js$/, // normal
        use: {
          loader: "babel-loader",
          options: {
            // 用babel-loader 需要把es6 -> es5
            presets: ["@babel/preset-env"],
            plugins: [
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: false }],
              "@babel/plugin-transform-runtime"
            ]
          }
        },
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/
      },
```

## 处理js语法及校验
```js
      {
        test: /\.js$/,
        use: {
          loader: "eslint-loader",
          options: {
            enforce: "pre" // previous post
          }
        }
      },
````

## 全局变量引入问题

三种方式：

- expose-loader 暴露到全局上
- providePlugin 给每个人提供一个\$
- 引入不打包的方式

## 打包图片

- 在 js 中创建图片来引入
- 在 css 中引入 background: url("")
- <img src="" alt="">
    file-loader 完整的图片
    url-loader base64📦，减少HTTP请求
    html-withimg-loader

```js
      {
        test: /\.html$/,
        use: "html-withimg-loader"
      },
      {
        test: /\.(png|jpg|gif)$/,
        // 做一个限制，当我们的图片小于多少K时，用base 64转化
        // 否则用file-loader产生真实的图片
        use: {
          loader: "url-loader",
          options: {
            limit: 200 * 1024
          }
        }
      },
```

## 📦 多页应用

```js
module.exports = {
  // 多入口
  entry: {
    home: "./src/index.js",
    other: "./src/other.js"
  },
  output: {
    // name -> home a
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["home"]
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "other.html",
      chunks: ["other", "home"]
    })
  ]
};
```

## watch && sourceMap

```js
  watch: true,
  // 监控的选项
  watchOptions: {
    poll: 1000,
    // 防抖
    aggregateTimeout: 500,
    // 不需要进行监控哪个文件
    ignored: /node_modules/
  },
  devtool: "cheap-module-source-map",
```

## 好用的一些小插件

- cleanWebpackPlugin
  （A webpack plugin to remove/clean your build folder(s) before building）
- copyWebpackPlugin
  （Copies individual files or entire directories to the build directory.）
- bannerPlugin 内置
  （为每个 chunk 文件头部添加 banner（比如说版本信息等））

## webpack 跨域

- 代理：重写的方式，把请求代理到 express 服务器上 代理

```js
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        pathRewrite: { "/api": "" }
      }
    }
  },
```

- 前端单纯想 mock 数据

```js
  devServer: {
    before(app) {
      app.get("/api/user", (req, res) => {
        res.json({ name: "musion-before" });
      });
    }
  },
```

- 把前端代码启动到服务端上：利用 webpack-dev-middleware

```js
let webpack = require("webpack");

// 中间件
let middle = require("webpack-dev-middleware");

let config = require("./webpack.config.js");

let compiler = webpack(config);

app.use(middle(compiler));
```

## resolve 属性的配置

```js
  // 解析第三方包 common
  resolve: {
    modules: [path.resolve("node_modules")],
    // 扩展名
    extensions: [".js", ".css", ".json", ".vue"]
    mainFields: ["style", "main"],
    入口的名字 默认为index.js
    mainFiles: [],
    别名
    alias: {
      bootstrap: "bootstrap/dist/css/bootstrap.css"
    }
  }
```

## 定义环境变量

- DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用

```js
plugins: [
  new webpack.DefinePlugin({
    DEV: JSON.stringify("production")
  })
];
```

## 区分不同环境

- 开发环境：webpack.dev.js

```js
// 这是开发环境webpack.dev.js
let { smart } = require("webpack-merge");

let base = require("./webpack.config.js");

module.exports = smart(base, {
  mode: "development"
});
```

- 生产环境：webpack.prod.js

```js
// 这是生产环境webpack.prod.js
let { smart } = require("webpack-merge");

let base = require("./webpack.config.js");

module.exports = smart(base, {
  mode: "production",
  optimization: {
    minimizer: []
  }
});
```

# webpack 优化

## noParse 参数

- noParse 配置项可以让 Webpack 忽略对部分没采用模块化的文件的递归解析和处理，这样做的好处是能提高构建性能。 原因是一些库例如 jQuery 、ChartJS 它们庞大又没有采用模块化标准，让 Webpack 去解析这些文件耗时又没有意义。

```js
  module: {
    // 不去解析jquery的依赖关系
    noParse: /jquery/
  },
```

## ignorePlugin

- moment 2.18 会将所有本地化内容和核心功能一起打包）。可以使用 IgnorePlugin 在打包时忽略本地化内容，经过实验，使用 ignorePlugin 之后 📦 之后的体积由 1.2M 降低至 800K

```js
// 用法：
new webpack.IgnorePlugin(requestRegExp, [contextRegExp]);

//eg.
plugins: [new webpack.IgnorePlugin(/\.\/local/, /moment/)];
```

## DllPlugin

- DllPlugin 是基于 Windows 动态链接库（dll）的思想被创作出来的。这个插件会把第三方库单独打包到一个文件中，这个文件就是一个单纯的依赖库。这个依赖库不会跟着你的业务代码一起被重新打包，只有当依赖自身发生版本变化时才会重新打包。

#### 用 DllPlugin 处理文件，要分两步走：

- 基于 dll 专属的配置文件，打包 dll 库

```js
let path = require("path");
let webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: {
    react: ["react", "react-dom"]
  },
  output: {
    filename: "_dll_[name].js", // 产生的文件名
    path: path.resolve(__dirname, "dist"),
    library: "_dll_[name]"
  },
  plugins: [
    // name要等于library里的name
    new webpack.DllPlugin({
      name: "_dll_[name]",
      path: path.resolve(__dirname, "dist", "manifest.json")
    })
  ]
};
```

- 基于 webpack.config.js 文件，打包业务代码

```js
let path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let webpack = require("webpack");

module.exports = {
  mode: "development",
  // 多入口
  entry: {
    home: "./src/index.js"
  },
  devServer: {
    port: 3000,
    open: true,
    contentBase: "./dist"
  },
  module: {
    // 不去解析jquery的依赖关系
    noParse: /jquery/,
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.resolve("src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      }
    ]
  },
  output: {
    // name -> home a
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "dist", "manifest.json")
    }),
    new webpack.IgnorePlugin(/\.\/local/, /moment/),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html"
    }),
    new webpack.DefinePlugin({
      DEV: JSON.stringify("production")
    })
  ]
};
```
