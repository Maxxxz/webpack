var t2 = require("./../../js/common/test1");

import t from "./../../js/common/test1";

// require("./../../js/common/test3");
console.log(t.a);
console.log(t2);

console.log('use');

import test from "./../../js/use/index.js";
console.log(test);

document.querySelector('#test').onclick=function(){
	// var b = require.ensure(
	// 	[], 
	// 	function(require){
	// 	    var test = require('./../../js/use/index.js');
	// 	    console.log(test);
	// 	    alert(1);
	// 	    return test;
	// 	},
	// 	'use');
	// alert(2);
	// console.log('b',b);

	const f = () => {
	  return new Promise((resolve, reject) => {
	    require.ensure(
		[], 
		function(require){
		    var test = require('./../../js/use/index.js');
		    console.log('test',test);
		    alert(1);
		    reject(test); 
		},
		'use');
	  });
	};

	const testAsync = async () => {
	  try {
	    const t = await f();
	    console.log('t',t);
	  } catch (err) {
	    console.log('err',err);
	  }
	};

	testAsync();

	alert(2);

}
