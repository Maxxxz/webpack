console.log('counter.js')
var i = 0;

function count(){
  return ++i;
}

exports.count = count;
