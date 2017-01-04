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
  /*
  entry就是模块的入口
    1. entry的值是字符串，这个字符串对应的模块会在启动的时候加载
    2. entry的值是数组，这个数组内所有模块会在启动的时候加载，数组的最后一个元素作为export
    3. entry的值是对象，可以构建多个bundle
  */
  entry: './js/entry.js',    //这个入口是非热部署的
  /*
    输出的路径+文件
  */
  output: {
    path: 'pack', //文件夹名
    filename: 'bundle.js'
  }
  
  ,module: {
    //loaders:可以根据模块类型（扩展名、类型名）来自动绑定需要的 loader。
    //打包引用路径时候的加载器以及快捷路径的配置
    loaders: [
      //下面这段配置相当于$ webpack entry.js bundle.js --module-bind 'css=style!css' 
      //可以让css文件引入require("!style!css!./style.css");直接require("./style.css")使用。减少了代码量
      //要在packge.json里配置包安装目录 或者直接npm install css-loader style-loader
      //还有不同的加载器
      /*
      {
        "html-loader": "^0.4.3",
        "less-loader": "^2.2.3",
        "markdown-loader": "^0.1.7",
        "url-loader": "^0.5.7",
        "babel-loader": "^6.2.4",
        "json-loader": "^0.5.4",
        "postcss-loader": "^0.8.2",
        "react-hot-loader": "^1.3.0",
        "sass-loader": "^3.2.1",
        "style-loader": "^0.13.1",
        "transform-loader": "^0.2.3"
      }
      */
      {test: /\.css$/, loader: 'style!css'}
      //css文件加载器另一种写法
      //{ test: /\.css$/, loaders: ["style", "css"] },
      //还有一些详细的配置
      /*{
        test: /\.js(x)*$/,
        loader: 'babel-loader',   //babel的loader
        include: [
          // 只去解析运行目录下的 src 和 demo 文件夹
          path.join(process.cwd(), './src'),
          path.join(process.cwd(), './demo')
        ],
        query: {
            presets: ['react', 'es2015-ie', 'stage-1']
        }
      }*/
      //我们的项目中用了happypack去加速构建
      //http://www.tuicool.com/articles/EzMVfei
    ]
  }
  //插件
  ,plugins: [
    //打包后快速添加注释
    new webpack.BannerPlugin('This file is created by Max')
  ]
}