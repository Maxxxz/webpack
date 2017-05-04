var moment = require('moment');
require("./../../js/common/test3");
import createHistory from 'history/createBrowserHistory';

const history = createHistory()
console.log("history.location",history.location);

console.log("moment",moment().format());
console.log(3);