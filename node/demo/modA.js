module.exports.test = 'A';
console.log('A1');
const modB = require('./modB');
console.log('A2');
console.log('modA:', modB);
module.exports.test = 'AA';
