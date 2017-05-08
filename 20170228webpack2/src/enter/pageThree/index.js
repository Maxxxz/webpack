var moment = require('moment');
require("./../../js/common/test3");
import createHistory from 'history/createBrowserHistory';

// const history = createHistory()
// console.log("history.location",history.location);
// console.log("moment",moment().format());
console.log(3);

require.ensure(
	[],	//依赖：['./a.js']  a.js 和 下面函数require的 都被打包到一起，而且从主文件束中拆分出来。但只有 b.js 的内容被执行。a.js 的内容仅仅是可被使用，但并没有被输出。   //"./../../js/product/productDetail/form.js" 试了下确实会打包到同一个文件里
	function(require){	//回调：当所有的依赖都加载完成后，webpack会执行这个回调函数。require 对象的一个实现会作为一个参数传递给这个回调函数。因此，我们可以进一步 require() 依赖和其它模块提供下一步的执行。
		require("./../../js/product/productDetail/index.js");
	}, 
	'productDetail' 
	//chunkName 是提供给这个特定的 require.ensure() 的 chunk 的名称。通过提供 require.ensure() 不同执行点相同的名称，我们可以保证所有的依赖都会一起放进相同的 文件束(bundle)
	// !!!!名字一样的时候，会打包进同一个文件里
);

require.ensure(
	[],	
	function(require){
		require("./../../js/product/productList/index.js");
	}, 
	'productList'
);