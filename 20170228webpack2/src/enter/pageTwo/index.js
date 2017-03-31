require("./../../js/common/test2");
var moment = require('moment');
import createHistory from 'history/createBrowserHistory';

const history = createHistory()
console.log("history.location",history.location);

console.log("moment",moment().format());



test2();
console.log(2);