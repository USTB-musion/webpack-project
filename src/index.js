import src from "./source.js";

console.log("12321", src);

if (module.hot) {
  module.hot.accept("./source", () => {
    console.log("123");
  });
}
