/*
  Webpack 在执行的时候，除了在命令行传入参数，还可以通过指定的配置文件来执行。
  默认情况下，会搜索当前目录的 webpack.config.js 文件，
  这个文件是一个 node.js 模块，返回一个 json 格式的配置信息对象，
  或者通过 --config 选项来指定配置文件。
*/

var webpack = require('webpack')

module.exports = {
  entry: './entry.js',    //这个入口是非热部署的
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style!css'}
    ]
  }
}