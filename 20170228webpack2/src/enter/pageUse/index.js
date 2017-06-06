var t2 = require("./../../js/common/test1");

import t from "./../../js/common/test1";

// require("./../../js/common/test3");
console.log(t.a);
console.log(t2);

console.log('pageuse');

// import test from "./../../js/use/index.js";
// console.log(test);

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


	var fn = ()=>{
		return  new Promise((resolve, reject) => {
				    require.ensure(
						[], 
						function(require){
						    var test = require('./../../js/use/index.js');
						    console.log('2',test);
						    // resolve('resolve');
						},
						'use');
					});
	}

	async function asyncFn() {
	  console.log(1);
	  const result = await fn();
	  console.log(3,result);
	 }
	asyncFn();
	console.log(4);

}
