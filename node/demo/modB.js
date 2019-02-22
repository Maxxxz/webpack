module.exports.test = 'B';
console.log('B1');
const modA = require('./modA');
console.log('B2');
console.log('modB:', modA);
module.exports.test = 'BB';
