let { AsyncParallelHook } = require("tapable");
// 异步的钩子分为串行和并行
// 串行：第一个异步执行完，才会执行第二个
// 并行：需要等待所有并发的异步事件执行后再执行回调方法

// tapable库中有3种注册方法： tap:同步注册 tapAsync:异步注册(cb) tapPromise(注册是promise)
// 调用夜分为三种方法：call callAsync promise
class Lesson {
  constructor() {
    this.hooks = {
      arch: new AsyncParallelHook(["name"])
    };
  }
  // 注册监听函数
  tap() {
    this.hooks.arch.tapPromise("node", name => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("node", name);
          resolve();
        }, 1000);
      });
    });
    this.hooks.arch.tapPromise("react", (name, cb) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("react", name);
          resolve();
        }, 1000);
      });
    });
  }
  start() {
    this.hooks.arch.promise("musion").then(function() {
      console.log("end");
    });
  }
}

let l = new Lesson();

// 注册这两个事件
l.tap();
// 启动钩子
l.start();
