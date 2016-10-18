var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry:
    [
        'webpack-dev-server/client?http://0.0.0.0:3300',//资源服务器地址  没用 要下面？？？？？
        'webpack/hot/only-dev-server', 
        path.resolve(__dirname, 'app/main.js')
    ],
    // output: {
    //     path: path.resolve(__dirname, 'build'),
    //     filename: 'bundle.js',
    // },
    output: {
        publicPath: "/build/",
        path: path.resolve(__dirname, 'build'),
        filename: "bundle.js"
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"development"'
        }),
        new webpack.HotModuleReplacementPlugin()
      ],
    resolve: {
        alias: {
          acom: path.resolve(__dirname, './com'),
          testalias: path.resolve(__dirname, './com/testalias.js'),
        }
    },
    devServer:{
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        // contentBase: './', // 根目录
        publicPath: '/build/',
        port: 3002
    },
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

