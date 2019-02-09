let { AsyncSeriesWaterfallHook } = require("tapable");

class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncSeriesWaterfallHook(["name"])
    };
  }
  // 注册监听函数
  tap() {
    this.hooks.arch.tapAsync("node", (name, cb) => {
      setTimeout(() => {
        console.log("node", name);
        // cb(null, "it is result");
        cb("error", "musion");
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
