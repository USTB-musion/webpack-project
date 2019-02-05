// import "./style";

// import "bootstrap";
console.log(DEV);

let xhr = new XMLHttpRequest();

xhr.open("GET", "/api/user", true);

xhr.onload = function() {
  console.log(xhr.response);
};

xhr.send();
