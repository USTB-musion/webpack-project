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
