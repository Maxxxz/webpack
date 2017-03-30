var path = require('path');

//(function(exports, require, module, __filename, __dirname){\n, 在尾部添加了\n}); 利用node添加的函数获取路径

console.log( "__dirname", __dirname, path.resolve(__dirname, './dist') );	



const config = {
	/*
	* 入口
	*1.插件CommonsChunkPlugin可创建公用模块，只在一开始的时候引入（所有的公用块都是一开始直接打包还是到每次对应文件require的时候才加载？）
	*2.一般经验，每个 HTML 文档只使用一个入口起点。
	*/
	entry: {						
		pageOne: './src/enter/pageOne/index.js',
		pageTwo: './src/enter/pageTwo/index.js',
		pageThree: './src/enter/pageThree/index.js'
	}
	/*
	* 输出(路径、文件名)
	* [name]:entry的key
	* [hash]:每次打包都会更新的哈希值
	* [chunkhash]:文件更新后才会更新的哈希值
	*
	*/
	,output: {
		path: __dirname + '/dist'					//打包输出的路径：1.此处是绝对路径，2.用 ./指定到相对路径打包时会报错， 3 path.resolve(__dirname, './dist') 也可拼接链接,且后者必须是相对链接！ 4.单个入口文件名见文档http://www.css88.com/doc/webpack2/concepts/output/
		,publicPath: 'http://cdn.example.com/assets/[hash]/'	//打包后文件对应的引用路径。建议写成变量提取出来方便修改
		//下面文件都在上面path路径里生成
		,filename: '[name].[chunkhash].bundle.js'	//打包后的文件名上面几个对应的entry入口文件
		,chunkFilename: 'js/[id].[chunkhash].bundle.js'	//各个模块对应生成的文件
		//,hotUpdateChunkFilename: 'hot/[id].[hash].hot-update.js' //热部署打包生成的文件
		//,sourceMapFilename: 'hot/[file].[id].[hash]'		//JavaScript 文件的 SourceMap 的文件名。
	}
  ,module:{
  	rules: [			//配置费入口文件的加载路径		//直接这样写会被打包到对应require的入口文件里
  		/*
			记得使用前安装对应的加载器，并且加上-dev安装到开发依赖中，详细区分依赖便于后期维护包
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
			// include: [
			// 	path.join(process.cwd(), './src/js/common')
			// ],
			exclude: /(node_modules|bower_components)/,
			
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
	  
};


module.exports = config;