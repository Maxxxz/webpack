var path = require('path');
// var webpack = require('webpack');
var config = require('./webpack.config');

// var jsonconf = require('gm-jsonconf');
// var siteConfig = jsonconf.parse(path.resolve(__dirname, 'config/deploy.json'));

//在开发时,将css直接打包到js里面,热加载
config.module.loaders.push({
  test: /\.(css|scss)$/,
  loaders: ["style", "css?minimize", "postcss", "sass"]
});

//开发环境进行热替换
config.entry = {
  'commons': [
    'webpack-dev-server/client?http://localhost:3002',
    'webpack/hot/only-dev-server',
    'webpack-hot-middleware/client?reload=true',
    'core-js/es6/object.js',
    'core-js/es6/promise.js',
    'react-fastclick',
    'react',
    'react-dom',
    'react-router',
    'redux',
    'react-redux',
    'redux-async-actions-reducers',
    'redux-thunk',
    'classnames',
    'js-cookie'
  ],
  'index': [
    path.resolve(__dirname, 'app/main.js')
  ]
};

config.module.loaders.push({
  test: /\.jsx?$/,
  include: path.join(__dirname, 'js'),
  exclude: /node_modules/,
  loaders: ['react-hot', 'babel']
});

//开启服务器的hot replace
// config.devServer = {
//   historyApiFallback: true,
//   hot: true,
//   inline: true,
//   progress: true,
//   contentBase: './', // 根目录
//   publicPath: siteConfig.publicPath,
//   port: siteConfig.port,
//   proxy: siteConfig.proxy
// };
//config.plugins.push(new webpack.HotModuleReplacementPlugin());

module.exports = config;