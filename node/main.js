var counter1 = require('./util/counter');
var counter2 = require('./util/counter');

console.log(counter1.count());
console.log(counter2.count());
console.log(counter2.count());

delete require.cache[require.resolve('./util/counter')]

var counter2 = require('./src/run');

var a =1;
