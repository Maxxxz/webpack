var t2 = require("./../../js/common/test1");

import t from "./../../js/common/test1";

// require("./../../js/common/test3");
console.log(t.a);
console.log(t2);

console.log('use');

import test from "./../../js/use/index.js";
console.log(test);
		    
document.querySelector('#test').onclick=function(){
	require.ensure(
		[], 
		function(require){
		    // var test = require('./../../js/use/index.js');
		    // import test from "./../../js/use/index.js";
		    // console.log(test);
		},
		'use');
}
