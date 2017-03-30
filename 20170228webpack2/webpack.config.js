var path = require('path');

//(function(exports, require, module, __filename, __dirname){\n, 在尾部添加了\n}); 利用node添加的函数获取路径

console.log( "__dirname", __dirname, path.resolve(__dirname, './dist') );	



const config = {
  entry: {
    pageOne: './src/enter/pageOne/index.js',
    pageTwo: './src/enter/pageTwo/index.js',
    pageThree: './src/enter/pageThree/index.js'
  }
  ,output: {
  	path: __dirname + '/dist',								//1.此处是绝对路径，2.用 ./指定到相对路径打包时会报错， 3 path.resolve(__dirname, './dist') 也可拼接链接,且后者必须是相对链接！
    filename: '[name].[chunkhash].bundle.js',				//上面几个entry对应的入口文件
    chunkFilename: 'js/[id].[chunkhash].bundle.js'			//各个模块对应生成的文件
  }
  ,module:{
  	rules: [			//配置费入口文件的加载路径		//直接这样写会被打包到对应require的入口文件里
		{
			test: /\.js$/,
			// loaders: ['react-hot', 'babel?cacheDirectory'],
			// loaders: ['babel-loader'],
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
			
		}
	 ]
  }
	  
};


module.exports = config;