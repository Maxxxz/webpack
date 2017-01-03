/*
  Webpack 在执行的时候，除了在命令行传入参数，还可以通过指定的配置文件来执行。
  默认情况下，会搜索当前目录的 webpack.config.js 文件，
  这个文件是一个 node.js 模块，返回一个 json 格式的配置信息对象，
  或者通过 --config 选项来指定配置文件。
*/

/*
  没有这个配置文件的时候，可以直接通过运行
  $ webpack js/entry.js pack/bundle.js
  来打包指定的文件
*/
var webpack = require('webpack')

module.exports = {
  entry: './js/entry.js',    //这个入口是非热部署的
  /*
  entry就是模块的入口
    1. entry的值是字符串，这个字符串对应的模块会在启动的时候加载
    2. entry的值是数组，这个数组内所有模块会在启动的时候加载，数组的最后一个元素作为export
    3. entry的值是对象，可以构建多个bundle
  */
  output: {
    path: 'pack',
    filename: 'bundle.js'
  },
  module: {
    //loaders:可以根据模块类型（扩展名、类型名）来自动绑定需要的 loader。
    loaders: [
      //下面这段配置相当于$ webpack entry.js bundle.js --module-bind 'css=style!css' 
      //可以让css文件引入require("!style!css!./style.css");直接require("./style.css")使用。减少了代码量
      {test: /\.css$/, loader: 'style!css'}
    ]
  }
}