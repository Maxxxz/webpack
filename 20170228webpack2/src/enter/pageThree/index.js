var moment = require('moment');
import createHistory from 'history/createBrowserHistory';

const history = createHistory()
console.log("history.location",history.location);

console.log("moment",moment().format());
console.log(3);