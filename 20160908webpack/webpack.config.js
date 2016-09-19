var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// var node_modules = path.resolve(__dirname, 'node_modules');	//这个只是查询，压缩未做
// var pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');

module.exports = {
    entry: [
        'webpack/hot/dev-server', 
        path.resolve(__dirname, 'app/main.js')
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    /*resolve: {		
        alias: {
        	//每当 "react" 在代码中被引入，它会使用压缩后的 React JS 文件，而不是到 node_modules 中找。
          'react': pathToReact
        }
    },*/
    //plugins: [new HtmlWebpackPlugin()]    //和上面热部署插件冲突？？？ 加了项目启动不了
    //bebel 处理ES6+react
   /* module: {
	   loaders: [
	     {
	       test: /\.jsx$/,
	       exclude: /node_modules/,
	       loaders: ["babel-loader"],
	       //loaders: 'babel'
	     }
	   ],
	 },*/
    resolve: {
        alias: {
          com: path.resolve(__dirname, './com'),
          testalias: path.resolve(__dirname, './com/testalias.js'),
        }
    }
    ,
	module: {
	    loaders: [{
	      test: /\.js?$/, // 用正则来匹配文件路径，这段意思是匹配 js 或者 jsx
	      loader: 'babel' // 加载模块 "babel" 是 "babel-loader" 的缩写
	    }, {
	      test: /\.css$/, // Only .css files
	      loader: 'style!css' // Run both loaders
	    }]
	    //,noParse: [pathToReact]//每当 Webpack 尝试去解析那个压缩后的文件，我们阻止它，因为这不必要。
		
	}
};



// var webpackConfig = {
//   entry: 'index.js',
//   output: {
//     path: 'dist',
//     filename: 'index_bundle.js'
//   },
//   plugins: [new HtmlWebpackPlugin()]
// };