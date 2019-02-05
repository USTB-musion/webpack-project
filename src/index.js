import jquery from "jquery";

import moment from "moment";

// 设置语言

// 手动引入所需要的语言
import "moment/locale/zh-cn";

moment.locale("zh-cn");

console.log(
  "00",
  moment()
    .endOf("day")
    .fromNow()
);
