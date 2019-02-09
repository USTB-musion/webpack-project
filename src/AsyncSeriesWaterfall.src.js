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
