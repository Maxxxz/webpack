const path = require('path');
const webpack = require('webpack'); 	//访问内置的插件,也可以自己写插件的！

var webpackMerge = require('webpack-merge');				//合并的插件
var ManifestPlugin = require('webpack-manifest-plugin');	//生成对应hash值map的插件	
var AssetsPlugin = require('assets-webpack-plugin');		
//(function(exports, require, module, __filename, __dirname){\n, 在尾部添加了\n}); 利用node添加的函数获取路径

console.log( "__dirname", __dirname, path.resolve(__dirname, './dist') );	

const baseConfig = {
	/*
	* 入口
	*1.插件CommonsChunkPlugin可创建公用模块，只在一开始的时候引入（所有的公用块都是一开始直接打包还是到每次对应文件require的时候才加载？）
	*2.一般经验，每个 HTML 文档只使用一个入口起点。
	*/
	entry: {					
		//key（命名不做限制）: '模块名/绝对路径+文件/相对路径+文件'	
		'pageOne': './src/enter/pageOne/index.js'
		,'pageTwo': './src/enter/pageTwo/index.js'
		,'pageThree': './src/enter/pageThree/index.js'

		//公用部分
		//key（命名与下面的CommonsChunkPlugin里names对应，不然还是会打包进去到被引入的模块里）: '上面命名规则/数组[上面命名规则,上面命名规则]'
		,'common': ['./src/js/common/test1.js','./src/js/common/test2.js']	//主动定义公用模块！！
		,'antd': './src/antd/index.js'		//公用模块-antd   
		,'moment': 'moment'			//公用插件-moment  
		// ,'test3': './src/js/common/test3.js'	//主动定义公用模块！！
	}
}

const devConfig = {
	/*
	* 输出(路径、文件名)
	* [name]:entry的key
	* [hash]:每次打包都会更新的哈希值
	* [chunkhash]:文件更新后才会更新的哈希值
	*
	*/
	output: {
		path: __dirname + '/dist'					//打包输出的路径：1.此处是绝对路径，2.用 ./指定到相对路径打包时会报错， 3 path.resolve(__dirname, './dist') 也可拼接链接,且后者必须是相对链接！ 4.单个入口文件名见文档http://www.css88.com/doc/webpack2/concepts/output/
		// ,publicPath: 'http://cdn.example.com/assets/'	 //1打包后文件对应的引用路径。建议写成变量提取出来方便修改， 2加了路径里加了 [hash]/会报路径文件不允许用chunkhash的错
		//下面文件都在上面path路径里生成
		,filename: '[name].[chunkhash].bundle.js'	//打包后的文件名上面几个对应的entry入口文件
		,chunkFilename: 'js/[id].[chunkhash].bundle.js'	//各个模块对应生成的文件
		//,hotUpdateChunkFilename: 'hot/[id].[hash].hot-update.js' //热部署打包生成的文件
		//,sourceMapFilename: 'hot/[file].[id].[hash]'		//JavaScript 文件的 SourceMap 的文件名。
	}
	/*
	* 加载器，用于require加载js、css、scss等
	* 一定要加上 -dev便于后期包管理！！
	*/
	,module:{
	  	rules: [			//配置费入口文件的加载路径		//直接这样写会被打包到对应require的入口文件里
	  		/*
				记得使用前npm安装对应的加载器，并且加上-dev安装到开发依赖中，详细区分依赖便于后期维护包
	  		*/
	  		/*
				js使用bable方便对应js版本控制等
				npm install --save-dev css-loader
	  		*/
			{
				test: /\.js$/,
				use: {								//注意webpack2一些属性的名称改变以及位置移动
		            loader: 'babel-loader',		
		            options: {
						presets: ['es2015']
					}
		        },
				include: [
					path.join(process.cwd(), './src/js')
				],
				exclude: /(node_modules|bower_components|common)/,
				
			},
			/*
				css加载器
				npm install --save-dev css-loader
			*/
			{
				test: /\.css$/, 
				use: [ 'style-loader', 'css-loader' ]	
			}
		]
	}
	/*
	* 插件库
	* 可以自己写插件，方法见 http://www.css88.com/doc/webpack2/concepts/plugins/。
	* 注意事项
	*/
	,plugins: [
		/*
		* 提取公用模块插件
		* 只能提取入口主动定义的公用模块！
		*/
		new webpack.optimize.CommonsChunkPlugin({
			//名字对应上面公用模块的名字，如果此处有名字，上面没有，就不会生成包文件，并且webpack内置的一些函数会打包到最后一个公用模块里。
			//上下文字顺序可不一致，只是此处导致最后一个文件会打包进去一些webpack内置的东西，第一个文件会打包其他满足下面函数定义但上面没有抽出的公用模块。
			// name: "test", // or
			names: ["pub","common","antd","moment","otherVender" ]	//
			// 忽略该值就会选择入口的全部chunks
			// 这个一定是对应entry入口的名字！！ 并且需要比入口文件先提前引入
			// 这是 common chunk 的名称。已经存在的 chunk 可以通过传入一个已存在的 chunk 名称而被选择。
			// 如果一个字符串数组被传入，这相当于插件针对每个 chunk 名被多次调用
			// 如果该选项被忽略，同时 `options.async` 或者 `options.children` 被设置，所有的 chunk 都会被使用，否则 `options.filename` 会用于作为 chunk 名。

			,filename: 'common/[name].[chunkhash].js'	
			// common chunk 的文件名模板。可以包含与 `output.filename` 相同的占位符。
			// 如果被忽略，原本的文件名不会被修改(通常是 `output.filename` 或者 `output.chunkFilename`)


			/*,
			看下面的minChunks: function (module) {		//搭配name最后多一个一起使用，可以是子文件超过*此调用就放到公用里
               // 该配置假定你引入的 vendor 存在于 node_modules 目录中
               console.log("module",module.context);
               return module.context && module.context.indexOf('node_modules') !== -1;
            } */ 
			// minChunks: number|Infinity|function(module, count) -> boolean,   ？？？
			// 在传入  公共chunk(commons chunk) 之前所需要包含的最少数量的 chunks 。
			// 数量必须大于等于2，或者少于等于 chunks的数量
			// 传入 `Infinity` 会马上生成 公共chunk，但里面没有模块。
			// 你可以传入一个 `function` ，以添加定制的逻辑（默认是 chunk 的数量）
 			// 随着 入口chunk 越来越多，用Infinity(无穷)这个配置保证没其它的模块会打包进 公共chunk ，确保公用模块不会被撑太大！ 

 			/*module为webpack中对应文件的id等信息，count是该文件被引用的次数  ??count次数只对入口有效还是对ensure引入的模块也有效*/ 
 			/*number/Infinity(无穷)或者function*/
 			,minChunks: function(module, count) {

		    	// 如果模块是一个路径，而且在路径中有 "test3" 这个名字出现，
			    // 而且它还被t个不同的 chunks/入口chunk 所使用，那请将它拆分到
			    // 会被打包到names里第一个文件名的路径中。
			    
			    var t = 2;
			    if(module.resource && (/test3/).test(module.resource) && count >= t){
			    	console.log('我');
				    console.log(module.resource); //module太大了，输出文件路径就好
				    console.log(count);
			    }
			    return module.resource && (/test3/).test(module.resource) && count >= t;
			}

			// ,chunks: "[common]"	??给了入口名但是没啥用
			// 通过 chunk name 去选择 chunks 的来源。chunk 必须是  公共chunk 的子模块。
			// 如果被忽略，所有的，所有的 入口chunk (entry chunk) 都会被选择。

			,children: false  //??未使用
			// boolean,  搭配names给多一个使用，true的话入口文件引入的文件是全部打包到公用的
			// 如果设置为 `true`，所有  公共chunk 的子模块都会被选择	??不知道有啥用

			// ,async: true, //boolean|string,  	//??未使用
			// 如果设置为 `true`，一个异步的  公共chunk 会作为 `options.name` 的子模块，和 `options.chunks` 的兄弟模块被创建。
			// 它会与 `options.chunks` 并行被加载。可以通过提供想要的字符串，而不是 `true` 来对输出的文件进行更换名称。

			// ,minSize: 5   ???会导致moment和antd模块打包到了对应入口文件里，原因未知，暂时别用吧
			// 在 公共chunk 被创建立之前，所有 公共模块 (common module) 的最少大小。
		})
		// ,new webpack.optimize.UglifyJsPlugin({  //详情见 http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
		//   compress: {         //压缩配置对应的配置这里 https://github.com/mishoo/UglifyJS2#usage
		//     screw_ie8: false,
		//     warnings: false,
		//     drop_debugger: true,
		//     drop_console: true
		//   },
		//   output: {comments: false},
		//   mangle: false,   //去掉压缩混淆，不然会出问题。
		//   sourceMap: false //去掉sourceMap。
		// })
		/*
		* 生成entry入口文件的hashmap
		* 用第二个吧。
		*/
		,new ManifestPlugin({	//https://www.npmjs.com/package/webpack-manifest-plugin
		  fileName: 'my-manifest.js',
		  basePath: './'
		})
		,new AssetsPlugin({	//https://www.npmjs.com/package/assets-webpack-plugin
			filename:'webpack-assets.js',
			processOutput: function (assets) {
			    return 'window.staticMap = ' + JSON.stringify(assets)
			}
		})
	]
	  
};
	
const config = webpackMerge(baseConfig,devConfig)

module.exports = config;