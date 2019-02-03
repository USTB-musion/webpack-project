import $ from "jquery";
console.log($); // 在每个模块中注入$对象

// 三种方式：
// 1.expose-loader 暴露到全局上
// 2.providePlugin 给每个人提供一个$
// 3.引入不打包的方式

// webpack📦图片
// 1.在js中创建图片来引入
// file-loader 默认会在内部生成一张图片到build目录下，把生成的图片返回回来
import logo from "./react.jpg"; // 把图片引入，返回的结果是一个新的图片地址
let image = new Image();
image.src = logo;
console.log(logo);
document.body.appendChild(image);

// 2.在css中引入background: url("")
// 3.<img src="" alt="">

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
