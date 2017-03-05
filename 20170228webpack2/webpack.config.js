var path = require('path');

const config = {
  entry: {
    pageOne: './src/enter/pageOne/index.js',
    pageTwo: './src/enter/pageTwo/index.js',
    pageThree: './src/enter/pageThree/index.js'
  }
  ,output: {
  	path: './dist',											//不加./ 会跑到对应磁盘的根目录去新增。。。
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