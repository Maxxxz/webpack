require("./../../js/common/test2");
require("./../../js/common/test3");
require("./../../css/common.css");

var moment = require('moment');
import createHistory from 'history/createBrowserHistory';

const history = createHistory()
console.log("history.location",history.location);

console.log("moment",moment().format());



test2();
console.log(2);