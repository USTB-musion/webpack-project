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
