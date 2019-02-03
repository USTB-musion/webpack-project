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

console.log(str);
