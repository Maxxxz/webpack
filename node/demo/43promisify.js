const fs = require('fs');
const promisify = require('util').promisify;

const read = promisify(fs.readFile);

// read('./43promisify.js')
//   .then(data => {
//     console.log(data.toString());
//   })
//   .catch(err => {
//     console.log(err);
//   });

async function test() {
  const cont = await read('./43promisify.js');
  console.log(cont.toString());
}
test();
