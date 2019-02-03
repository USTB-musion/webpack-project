import $ from "jquery";
console.log($); // 在每个模块中注入$对象

// 三种方式：
// 1.expose-loader 暴露到全局上
// 2.providePlugin 给每个人提供一个$
// 3.引入不打包的方式

console.log("musion");

let str = require("./a");

require("./index.css");

require("./index.less");

let test = () => {
  console.log("666");
};

test();

class A {
  a = 1;
}

let a = new A();
console.log("111", a.a);

function* gen(params) {
  yield 1;
}

console.log(gen().next());

console.log(str);
