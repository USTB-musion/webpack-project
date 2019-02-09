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
