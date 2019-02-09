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

### noParse

- noParse 配置项可以让 Webpack 忽略对部分没采用模块化的文件的递归解析和处理，这样做的好处是能提高构建性能。 原因是一些库例如 jQuery 、ChartJS 它们庞大又没有采用模块化标准，让 Webpack 去解析这些文件耗时又没有意义。

启用 noParse：

```js
  module: {
    // 不去解析jquery的依赖关系
    noParse: /jquery/
  },
```

### ignorePlugin

- moment 2.18 会将所有本地化内容和核心功能一起打包）。可以使用 IgnorePlugin 在打包时忽略本地化内容，经过实验，使用 ignorePlugin 之后 📦 之后的体积由 1.2M 降低至 800K

```js
// 用法：
new webpack.IgnorePlugin(requestRegExp, [contextRegExp]);

//eg.
plugins: [new webpack.IgnorePlugin(/\.\/local/, /moment/)];
```

### DllPlugin

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

### Happypack——将 loader 由单进程转为多进程

- 大家知道，webpack 是单线程的，就算此刻存在多个任务，你也只能排队一个接一个地等待处理。这是 webpack 的缺点，好在我们的 CPU 是多核的，Happypack 会充分释放 CPU 在多核并发方面的优势，帮我们把任务分解给多个子进程去并发执行，大大提升打包效率。

#### happypack 的使用方法：

将 loader 中的配置转移到 happypack 中就好：

```js
let path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let webpack = require("webpack");
// 模块 happypack 可以实现多线程📦
let Happypack = require("happypack");

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
        use: "Happypack/loader?id=css"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.resolve("src"),
        use: "Happypack/loader?id=js"
      }
    ]
  },
  output: {
    // name -> home a
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new Happypack({
      id: "css",
      use: ["style-loader", "css-loader"]
    }),
    new Happypack({
      id: "js",
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      ]
    }),
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

### Tree-Shaking

- 基于 import/export 语法，Tree-Shaking 可以在编译的过程中获悉哪些模块并没有真正被使用，这些没用的代码，在最后打包的时候会被去除。适合于处理模块级别的代码，所以尽量使用 es6 的 import/export 语法。

### 抽离公共代码

> 把公共代码抽离出来的好处：

- 减少网络传输流量，降低服务器成本；
- 虽然用户第一次打开网站的速度得不到优化，但之后访问其它页面的速度将大大提升。

#### 启用抽离代码：

```js
  // webpack 4.x版本之前的commonChunkPlugins
  optimization: {
    // 分割代码块
    splitChunks: {
      // 缓存组
      cacheGroups: {
        // 公共模块
        common: {
          chunks: "initial",
          minSize: 0,
          // 最小公用模块次数
          minChunks: 2
        },
        vendor: {
          priority: 1,
          // 抽离出来
          test: /node_modules/,
          chunks: "initial",
          minSize: 0,
          minChunks: 2
        }
      }
    }
  }
```

### 按需加载

> 按需加载的思想

- 一次不加载完所有的文件内容，只加载此刻需要用到的那部分（会提前做拆分）
- 当需要更多内容时，再对用到的内容进行即时加载

通过 es6 的 import 实现按需加载，在使用 import() 分割代码后，你的浏览器并且要支持 Promise API 才能让代码正常运行， 因为 import() 返回一个 Promise，它依赖 Promise。对于不原生支持 Promise 的浏览器，你可以注入 Promise polyfill。

```js
let button = document.createElement("button");

button.innerHTML = "musion";

// vue，react的懒加载原理也是如此
button.addEventListener("click", function() {
  // es6草案中的语法, jsonp实现动态加载文件
  import("./source.js").then(data => {
    console.log(data.default);
  });
  console.log("click");
});

document.body.appendChild(button);
```

### 热更新

#### 模块热替换（HMR - Hot Module Replacement）是 webpack 提供的最有用的功能之一。它允许在运行时替换，添加，删除各种模块，而无需进行完全刷新重新加载整个页面，其思路主要有以下几个方面：

- 保留在完全重新加载页面时丢失的应用程序的状态
- 只更新改变的内容，以节省开发时间
- 调整样式更加快速，几乎等同于就在浏览器调试器中更改样式

：

> 启用 HRM

1. 引入了 webpack 库
2. 使用了 new webpack.HotModuleReplacementPlugin()
3. 设置 devServer 选项中的 hot 字段为 true

```js
let path = require("path");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let webpack = require("webpack");

module.exports = {
  mode: "production",
  // 多入口
  entry: {
    index: "./src/index.js",
    other: "./src/other.js"
  },
  devServer: {
    // 启用热更新
    hot: true,
    port: 3000,
    open: true,
    contentBase: "./dist"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.resolve("src"),
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-syntax-dynamic-import"]
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
    new webpack.NamedModulesPlugin(), // 打印更新的模块路径
    new webpack.HotModuleReplacementPlugin() // 热更新插件
  ]
};
```
### Tapable
对于Webpack有一句话**Everything is a plugin**，Webpack本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是Tapable。Tapable有点类似nodejs的events库，核心原理也是依赖与发布订阅模式。webpack中最核心的负责编译的Compiler和负责创建bundles的Compilation都是Tapable的实例。下面介绍一下tapable的用法和原理。以下实例的代码原文地址为[https://github.com/USTB-musion/webpack-project](https://github.com/USTB-musion/webpack-project)
``` js
const {
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncParallelHook,
	AsyncParallelBailHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncSeriesWaterfallHook
 } = require("tapable");
```
### Tapable Hook概览
![](https://user-gold-cdn.xitu.io/2019/2/8/168cdb3c4c9a71b9?w=915&h=430&f=png&s=150430)
Tapable提供了很多类型的hook，分为同步和异步两大类(异步中又区分异步并行和异步串行)，而根据事件执行的终止条件的不同，由衍生出 Bail/Waterfall/Loop 类型。

下图展示了每种类型的作用：
![](https://user-gold-cdn.xitu.io/2018/12/28/167f458ac2b1e527?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
![](https://user-gold-cdn.xitu.io/2018/12/28/167f458d6ff8424f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
- **BasicHook:** 执行每一个，不关心函数的返回值，有 SyncHook、AsyncParallelHook、AsyncSeriesHook。
- **BailHook:** 顺序执行 Hook，遇到第一个结果 result !== undefined 则返回，不再继续执行。有：SyncBailHook、AsyncSeriseBailHook, AsyncParallelBailHook。
- **WaterfallHook:** 类似于 reduce，如果前一个 Hook 函数的结果 result !== undefined，则 result 会作为后一个 Hook 函数的第一个参数。既然是顺序执行，那么就只有 Sync 和 AsyncSeries 类中提供这个Hook：SyncWaterfallHook，AsyncSeriesWaterfallHook
- **LoopHook:** 不停的循环执行 Hook，直到所有函数结果 result === undefined。同样的，由于对串行性有依赖，所以只有 SyncLoopHook 和 AsyncSeriseLoopHook （PS：暂时没看到具体使用 Case）

### SyncHook的用法及实现
Sync为同步串行的执行关系，用法如下：
``` js
let { SyncHook } = require("tapable");

class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncHook(["name"])
    };
  }
  // 注册监听函数
  tap() {
    this.hooks.arch.tap("node", function(name) {
      console.log("node", name);
    });
    this.hooks.arch.tap("react", function(name) {
      console.log("react", name);
    });
  }
  start() {
    this.hooks.arch.call("musion");
  }
}

let l = new Lesson();

// 注册这两个事件
l.tap();
// 启动钩子
l.start();

/**
 * 打印出来的值为：
 * node musion
 * react musion
 */
```
SyncHook是一个很典型的通过发布订阅方式实现的，实现方式如下：
``` js
// 钩子是同步的
class SyncHook {
  // args => ["name"]
  constructor() {
    this.tasks = [];
  }
  tap(name, task) {
    this.tasks.push(task);
  }
  call(...args) {
    this.tasks.forEach(task => task(...args));
  }
}

let hook = new SyncHook(["name"]);

hook.tap("react", function(name) {
  console.log("react", name);
});
hook.tap("node", function(name) {
  console.log("node", name);
});
hook.call("musion");

/**
 * 打印出来的值为：
 * node musion
 * react musion
 */
```

### SyncBailHook的用法及实现
SyncBailHook为同步串行的执行关系，只要监听函数中有一个函数的返回值不为 null，则跳过剩下所有的逻辑，用法如下：
``` js
let { SyncBailHook } = require("tapable");

class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncBailHook(["name"])
    };
  }
  // 注册监听函数
  tap() {
    this.hooks.arch.tap("node", function(name) {
      console.log("node", name);
      //return "stop";
      return undefined;
    });
    this.hooks.arch.tap("react", function(name) {
      console.log("react", name);
    });
  }
  start() {
    this.hooks.arch.call("musion");
  }
}

let l = new Lesson();

// 注册这两个事件
l.tap();
// 启动钩子
l.start();


/**
 * 打印出来的值为：
 * node musion
 * react musion
 */
```
SyncBailHook的实现：
``` js
// 钩子是同步的,bail -> 保险
class SyncBailHook {
  // args => ["name"]
  constructor() {
    this.tasks = [];
  }
  tap(name, task) {
    this.tasks.push(task);
  }
  call(...args) {
    // 当前函数的返回值
    let ret;
    // 当前要先执行第一个
    let index = 0;
    do {
      ret = this.tasks[index++](...args);
    } while (ret === undefined && index < this.tasks.length);
  }
}

let hook = new SyncBailHook(["name"]);

hook.tap("react", function(name) {
  console.log("react", name);
  return "stop";
});
hook.tap("node", function(name) {
  console.log("node", name);
});
hook.call("musion");


/**
 * 打印出来的值为：
 * node musion
 * react musion
 */
```

### SyncWaterfallHook的用法及实现
SyncWaterfallHook为同步串行的执行关系，上一个监听函数的返回值可以传给下一个监听函数，用法如下：
``` js
let { SyncWaterfallHook } = require("tapable");

// waterfall 瀑布 上面会影响下面的

class Lesson {
  constructor() {
    this.hooks = {
      arch: new SyncWaterfallHook(["name"])
    };
  }
  // 注册监听函数
  tap() {
    this.hooks.arch.tap("node", function(name) {
      console.log("node", name);
      return "node学得还不错";
    });
    this.hooks.arch.tap("react", function(data) {
      console.log("react", data);
    });
  }
  start() {
    this.hooks.arch.call("musion");
  }
}

let l = new Lesson();

// 注册这两个事件
l.tap();
// 启动钩子
l.start();

/**
 * 打印出来的值为：
 * node musion
 * react node学得还不错
 */
```
SyncWaterfallHook的实现：
``` js
// 钩子是同步的
class SyncWaterfallHook {
  // args => ["name"]
  constructor() {
    this.tasks = [];
  }
  tap(name, task) {
    this.tasks.push(task);
  }
  call(...args) {
    let [first, ...others] = this.tasks;
    let ret = first(...args);
    others.reduce((a, b) => {
      return b(a);
    }, ret);
  }
}

let hook = new SyncWaterfallHook(["name"]);

hook.tap("react", function(name) {
  console.log("react", name);
  return "react ok";
});
hook.tap("node", function(data) {
  console.log("node", data);
  return "node ok";
});
hook.tap("webpack", function(data) {
  console.log("webpack", data);
});
hook.call("musion");

/**
 * 打印出来的值为：
 * react musion
 * node react ok
 * webpack node ok
 */
```

### SyncLoopHook的用法及实现
SyncLoopHook为同步循环的执行关系，当监听函数被触发的时候，如果该监听函数返回true时则这个监听函数会反复执行，如果返回 undefined 则表示退出循环，用法如下：
``` js
let { SyncLoopHook } = require("tapable");

// 同步遇到某个不返回undefined的监听函数会多次执行

class Lesson {
  constructor() {
    this.index = 0;
    this.hooks = {
      arch: new SyncLoopHook(["name"])
    };
  }
  // 注册监听函数
  tap() {
    this.hooks.arch.tap("node", name => {
      console.log("node", name);
      return ++this.index === 3 ? undefined : "继续学";
    });
    this.hooks.arch.tap("react", data => {
      console.log("react", data);
    });
  }
  start() {
    this.hooks.arch.call("musion");
  }
}

let l = new Lesson();

// 注册这两个事件
l.tap();
// 启动钩子
l.start();

/**
 * 打印出来的值为：
 * node musion
 * node musion
 * node musion
 * react musion
 */

```
SyncLoopHook的实现：
``` js
// 钩子是同步的
class SyncLoopHook {
  // args => ["name"]
  constructor() {
    this.tasks = [];
  }
  tap(name, task) {
    this.tasks.push(task);
  }
  call(...args) {
    this.tasks.forEach(task => {
      let ret;
      do {
        ret = task(...args);
      } while (ret != undefined);
    });
  }
}

let hook = new SyncLoopHook(["name"]);

let total = 0;
hook.tap("react", function(name) {
  console.log("react", name);
  return ++total === 3 ? undefined : "继续学";
});
hook.tap("node", function(data) {
  console.log("node", data);
});
hook.tap("webpack", function(data) {
  console.log("webpack", data);
});
hook.call("musion");

/**
 * 打印出来的值为：
 * react musion
 * react musion
 * react musion
 * node musion
 * webpack musion
 */
```

### AsyncParallelHook的用法及实现
AsyncParallelHook为异步并发的执行关系，用法如下：
``` js
let { AsyncParallelHook } = require("tapable");
// 异步的钩子分为串行和并行
// 串行：第一个异步执行完，才会执行第二个
// 并行：需要等待所有并发的异步事件执行后再执行回调方法

// 注册方法： tap注册 tapAsync注册

class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncParallelHook(["name"])
    };
  }
  // 注册监听函数
  tap() {
    this.hooks.arch.tapAsync("node", (name, cb) => {
      setTimeout(() => {
        console.log("node", name);
        cb();
      }, 1000);
    });
    this.hooks.arch.tapAsync("react", (name, cb) => {
      setTimeout(() => {
        console.log("react", name);
        cb();
      }, 1000);
    });
  }
  start() {
    this.hooks.arch.callAsync("musion", function() {
      console.log("end");
    });
  }
}

let l = new Lesson();

// 注册这两个事件
l.tap();
// 启动钩子
l.start();

/**
 * 打印出来的值为：
 * node musion
 * react musion
 * end
 */


```
AsyncParallelHook的实现：
``` js
class SyncParralleHook {
  constructor() {
    this.tasks = [];
  }
  tapAsync(name, task) {
    this.tasks.push(task);
  }
  callAsync(...args) {
    // 拿出最终的函数
    let finalCallBack = args.pop();
    let index = 0;
    // 类似Promise.all
    let done = () => {
      index++;
      if (index === this.tasks.length) {
        finalCallBack();
      }
    };
    this.tasks.forEach(task => {
      task(...args, done);
    });
  }
}

let hook = new SyncParralleHook(["name"]);

hook.tapAsync("react", function(name, cb) {
  setTimeout(() => {
    console.log("react", name);
    cb();
  }, 1000);
});
hook.tapAsync("node", function(name, cb) {
  setTimeout(() => {
    console.log("node", name);
    cb();
  }, 1000);
});
hook.callAsync("musion", function() {
  console.log("end");
});


/**
 * 打印出来的值为：
 * react musion
 * react musion
 * react musion
 * node musion
 * webpack musion
 */
```

### AsyncSeriesHook的用法及实现
AsyncSeriesHook为异步串行的执行关系，用法如下：
``` js
// AsyncSeriesHook 异步串行
let { AsyncSeriesHook } = require("tapable");

class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncSeriesHook(["name"])
    };
  }
  // 注册监听函数
  tap() {
    this.hooks.arch.tapAsync("node", (name, cb) => {
      setTimeout(() => {
        console.log("node", name);
        cb();
      }, 4000);
    });
    this.hooks.arch.tapAsync("react", (name, cb) => {
      setTimeout(() => {
        console.log("react", name);
        cb();
      }, 1000);
    });
  }
  start() {
    this.hooks.arch.callAsync("musion", function() {
      console.log("end");
    });
  }
}

let l = new Lesson();

// 注册这两个事件
l.tap();
// 启动钩子
l.start();

/**
 * 打印出来的值为：
 * node musion
 * react musion
 * end
 */


```
AsyncSeriesHook的实现：
``` js
class SyncSeriesHook {
  constructor() {
    this.tasks = [];
  }
  tapAsync(name, task) {
    this.tasks.push(task);
  }
  callAsync(...args) {
    let finalCallback = args.pop();
    let index = 0;
    let next = () => {
      if (this.tasks.length === index) return finalCallback();
      let task = this.tasks[index++];
      task(...args, next);
    };
    next();
  }
}
```

### AsyncSeriesWaterfallHook的用法及实现
AsyncSeriesWaterfallHook为异步串行的执行关系，上一个监听函数的中的callback(err, data)的第二个参数,可以作为下一个监听函数的参数，用法如下：
``` js
class SyncSeriesWaterfallHook {
  constructor() {
    this.tasks = [];
  }
  tapAsync(name, task) {
    this.tasks.push(task);
  }
  callAsync(...args) {
    let finalCallback = args.pop();
    let index = 0;
    let next = (err, data) => {
      let task = this.tasks[index];
      if (!task) return finalCallback();
      // 执行的是第一个
      if (index === 0) {
        task(...args, next);
      } else {
        task(data, next);
      }
      index++;
    };
    next();
  }
}

let hook = new SyncSeriesWaterfallHook(["name"]);

hook.tapAsync("react", function(name, cb) {
  setTimeout(() => {
    console.log("react", name);
    cb(null, "musion");
  }, 3000);
});
hook.tapAsync("node", function(name, cb) {
  setTimeout(() => {
    console.log("node", name);
    cb(null);
  }, 1000);
});
hook.callAsync("musion", function() {
  console.log("end");
});

/**
 * 打印出来的值为：
 * node musion
 * end
 */


```
AsyncSeriesWaterfallHook的实现：
``` js
class SyncSeriesWaterfallHook {
  constructor() {
    this.tasks = [];
  }
  tapAsync(name, task) {
    this.tasks.push(task);
  }
  callAsync(...args) {
    let finalCallback = args.pop();
    let index = 0;
    let next = (err, data) => {
      let task = this.tasks[index];
      if (!task) return finalCallback();
      // 执行的是第一个
      if (index === 0) {
        task(...args, next);
      } else {
        task(data, next);
      }
      index++;
    };
    next();
  }
}
```
