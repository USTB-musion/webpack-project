class SyncParralleHook {
  constructor() {
    this.tasks = [];
  }
  tapPromise(name, task) {
    this.tasks.push(task);
  }
  promise(...args) {
    let tasks = this.tasks.map(task => task(...args));
    return Promise.all(tasks);
  }
}

let hook = new SyncParralleHook(["name"]);

hook.tapPromise("react", function(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("react", name);
      resolve();
    }, 1000);
  });
});
hook.tapPromise("node", function(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("node", name);
      resolve();
    }, 1000);
  });
});
hook.promise("musion").then(function() {
  console.log("end");
});
