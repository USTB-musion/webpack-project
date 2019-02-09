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
