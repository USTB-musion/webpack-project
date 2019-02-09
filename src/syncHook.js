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
