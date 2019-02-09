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
