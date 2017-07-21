const path = require('path');
const webpack = require('webpack'); 	//访问内置的插件,也可以自己写插件的！

var webpackMerge = require('webpack-merge');				//合并JSON的插件

var ManifestPlugin = require('webpack-manifest-plugin');	//生成对应hash值map的插件	
var AssetsPlugin = require('assets-webpack-plugin');	

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;	//打包结果图解 https://github.com/th0r/webpack-bundle-analyzer
const ExtractTextPlugin = require('extract-text-webpack-plugin');	//提取样式文件	
// 多个提取实例
const extractCSS = new ExtractTextPlugin({filename:'stylesheets/[name].[chunkhash].css'});	

const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
console.log( "__dirname", __dirname, path.resolve(__dirname, './dist') );	
console.log("process.env.NODE_ENV",process.env.NODE_ENV);	

const baseConfig = {
	entry: {					
		'pageOne': './src/entry/index.js',
		'moment': 'moment',
		//'echarts': 'echarts'
	},
	// externals:{
	// 	'moment': 'moment'
	// }
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
		,publicPath: './dist/'	 //1打包后文件对应的引用路径。建议写成变量提取出来方便修改， 2加了路径里加了 [hash]/会报路径文件不允许用chunkhash的错
		,filename: '[name].[chunkhash].bundle.js'	//打包后的文件名上面几个对应的entry入口文件
		,chunkFilename: 'js/[name].[chunkhash].bundle.js'	//通过require.ensure异步引入的模块对应生成的文件，name:require.ensure()最后一个参数，如果没有给参数就自动赋值id	//[id].[chunkhash].bundle.js
	}

	,module:{
	  	rules: [			//配置费入口文件的加载路径		//直接这样写会被打包到对应require的入口文件里
			{
				test: /\.js$/,
				use: {								//注意webpack2一些属性的名称改变以及位置移动
		            loader: 'babel-loader',		//可以用缓存优化速度http://www.css88.com/doc/webpack2/loaders/babel-loader/	
		            options: {
						presets: ['es2015', 'stage-0'],
						plugins: ['transform-runtime']
					}
		        },
				exclude: /(node_modules|bower_components|common)/,
				
			},
			{
				test: /\.css$/, 
				// use: [ 'style-loader', 'css-loader' ]	//原版
				use: extractCSS.extract({			//没有讲fallback和use是什么意思
					fallback: "style-loader",	//加载器 (例如 'style-loader'), 应用于当 css 没有被提取(也就是一个额外的 chunk，当 allChunks: false)
					use: "css-loader",	//	(必填), 加载器 (Loader), 被用于将资源转换成一个输出的 CSS 模块
		  		})
			}
		]
	}

	/*
	* 解析器
	* 可以自己写插件，方法见http://www.css88.com/doc/webpack2/configuration/resolve
	*/
	,resolve:{
		alias:{
			'echart2': path.resolve(__dirname, './src/common/echarts.min.js'),
		}
	}
	,externals:{		//仅仅针对入口文件？
		'echarts': 'echarts'
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

			// name: "echarts" // or
			names: ["moment","mainfeast"]	//,"common"

			,filename: 'common/[name].[chunkhash].js'	
			// ,children: false  

			// ,async: "true" //boolean|string,  	//???未使用
			,minChunks: function(module){
				var context = module.context;
				// if(context && (context.indexOf('echarts') >= 0 || context.indexOf('zrender') >= 0)){
				// 	console.log('第二个',module);
				// }
				return context && (context.indexOf('echarts') >= 0 || context.indexOf('zrender') >= 0);
			}
		})
		,new webpack.optimize.CommonsChunkPlugin({
			name: "echarts" // or
 			,minChunks: function(module){
				var context = module.context;
				// if(context && (context.indexOf('echarts') >= 0 || context.indexOf('zrender') >= 0)){
				// 	console.log('第二个',module);
				// }
				return context && (context.indexOf('echarts') >= 0 || context.indexOf('zrender') >= 0);
			}
			// ,children: false  //???未使用
		})
		
		,new AssetsPlugin({	
			filename:'webpack-assets.js',				//对这个文件的缓存优化，有用wepack的插件生活从HTML才行
			prettyPrint: true,
			processOutput: function (assets) {
			    return 'window.staticMap = ' + JSON.stringify(assets)
			}
		})
		,extractCSS
		,new BundleAnalyzerPlugin({
			analyzerHost: '127.0.0.1',
			// Port that will be used in `server` mode to start HTTP server.
			analyzerPort: 8881,
		})	//打包结果图解 https://github.com/th0r/webpack-bundle-analyzer
		,new UglifyJsPlugin({
			sourceMap: false
		})
	]
	  
};
	
const config = webpackMerge(baseConfig,devConfig)

module.exports = config;