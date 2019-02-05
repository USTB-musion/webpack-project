let button = document.createElement("button");

button.innerHTML = "musion";

// vue，react的懒加载原理也是如此
button.addEventListener("click", function() {
  // es6草案中的语法, jsonp实现动态加载文件
  import("./source.js").then(data => {
    console.log(data.default);
  });
  console.log("click");
});

document.body.appendChild(button);
