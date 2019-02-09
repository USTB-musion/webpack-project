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
