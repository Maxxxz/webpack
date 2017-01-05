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
  // entry: './js/entry.js',    //这个入口是非热部署的
  entry:{
    'main/index':'./js/entry.js',
    'sec/index':'./js/entry.js'
  },
  //***入口的额外介绍  ***
  //entry可以是字符串（单入口），可以是数组（多入口），但为了后续发展，请务必使用object，因为object中的key在webpack里相当于此入口的name，既可以后续用来拼生成文件的路径，也可以用来作为此入口的唯一标识。我推荐的形式是这样的：
  /*
  entry: { // pagesDir是前面准备好的入口文件集合目录的路径 
    'alert/index': path.resolve(pagesDir, `./alert/index/page`),  
    'index/login': path.resolve(pagesDir, `./index/login/page`),  
    'index/index': path.resolve(pagesDir, `./index/index/page`), 
  },
  */
  //***我们项目热部署的入口  ***
  /*entry:{
    'index': [
      'webpack-hot-middleware/client?path=http://localhost:' + siteConfig.port + '/__webpack_hmr',
      './js/index'
    ],
    'setting': [
      'webpack-hot-middleware/client?path=http://localhost:' + siteConfig.port + '/__webpack_hmr',
      './js/index_setting'
    ]
  }*/
  //*** 生产环境的入口  ***
  /*config.entry = {
    // webpack 会自动打包公共的，这两个是兼容文件。入口不会引入，股灾commons 做文章
    'commons': [
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
      'js-cookie',
      './antd/dist/antd.min.js'
    ],
    'index': [
      './js/index'
    ],
    'setting': [
      './js/index_setting'
    ]
  };*/
  
  /*
    输出的路径+文件
  */
  output: {
    path: 'pack', //文件夹名
    filename: '[name].[chunkhash].bundle.js' 
    //[name]是entry的key值，若entry是字符串，则name为main。有两个key就会创建两入口。如果key是main/index 就会创建main文件夹！
    //[chunkhash]只有变化后才会更改hash值
    //[hash]每次都生成新的hash值
    //疑惑，index文件如何获取这个hash值？？

  }

  //path 和 filename 针对入口文件 publicPath针对css/img/is/等文件路径（相对于浏览器）chunkFilename是其他模块打包后的文件名
  //http://mp.weixin.qq.com/s?__biz=MzA5NTM2MTEzNw==&mid=2736710855&idx=2&sn=b08f6235f506c838efb01ec2ec3c793f&chksm=b6aac5d981dd4ccf2b903b711680aa31125936cf1dff27b650c2c0be7b1a0f86beb468f1f960&scene=21#wechat_redirect
  /*output: { 
    
    path: buildDir, // var buildDir = path.resolve(__dirname, './build'); 
    //path参数表示生成文件的根目录，需要传入一个绝对路径。path参数和后面的filename参数共同组成入口文件的完整路径。

    publicPath: '../../../../build/', 
    //publicPath参数表示的是一个URL路径（指向生成文件的根目录），用于生成css/js/图片/字体文件等资源的路径，以确保网页能正确地加载到这些资源。
    //publicPath参数跟path参数的区别是：path参数其实是针对本地文件系统的，而publicPath则针对的是浏览器；
    //因此，publicPath既可以是一个相对路径，如示例中的'../../../../build/'，也可以是一个绝对路径如http://www.xxxxx.com/。一般来说，我还是更推荐相对路径的写法，这样的话整体迁移起来非常方便。那什么时候用绝对路径呢？其实也很简单，当你的html文件跟其它资源放在不同的域名下的时候，就应该用绝对路径了，这种情况非常多见于后端渲染模板的场景。

    filename: '[name]/entry.js',    // [name]表示entry每一项中的key，用以批量指定生成后文件的名称 
      
      //[name]，指代入口文件的name，也就是上面提到的entry参数的key，因此，我们可以在name里利用/，即可达到控制文件目录结构的效果。
      //[hash]，指代本次编译的一个hash版本，值得注意的是，只要是在同一次编译过程中生成的文件，这个[hash]的值就是一样的；在缓存的层面来说，相当于一次全量的替换。
      //[chunkhash]，指代的是当前chunk的一个hash版本，也就是说，在同一次编译中，每一个chunk的hash都是不一样的；而在两次编译中，如果某个chunk根本没有发生变化，那么该chunk的hash也就不会发生变化。这在缓存的层面上来说，就是把缓存的粒度精细到具体某个chunk，只要chunk不变，该chunk的浏览器缓存就可以继续使用。
      

    chunkFilename: '[id].bundle.js', 
    //chunkFilename参数与filename参数类似，都是用来定义生成文件的命名方式的，只不过，chunkFilename参数指定的是除入口文件外的chunk（这些chunk通常是由于webpack对代码的优化所形成的，比如因应实际运行的情况来异步加载）的命名。
  },*/
  /*我们项目中的*/
  /*output: {
    path: path.join(__dirname, env === 'development' ? "build" : "dist"),
    filename: env === 'development' ? 'js/[name].[hash].bundle.js' : 'js/[name].[chunkhash].bundle.js',
    chunkFilename: env === 'development' ? 'js/[id].[chunkhash].bundle.js' : 'js/[id].[chunkhash].bundle.js',
    publicPath: siteConfig.publicPath
  },*/
  
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
      { 
        test: /\.css$/, 
        loader: 'style!css'
      }
      //css文件加载器另一种写法
      //{ test: /\.css$/, loaders: ["style", "css"] },
      //还有一些详细的配置
      /*{
        test: /\.js(x)*$/,     //test后面跟着是文件名(可有可无)+后缀 test参数用来指示当前配置项针对哪些资源，该值应是一个条件值(condition)。
        
        loader: 'babel-loader',   //babel的loader
        //loader/loaders参数，用来指示用哪个/哪些loader来处理目标资源，这俩货表达的其实是一个意思，只是写法不一样，我个人推荐用loader写成一行，多个loader间使用!分割，这种形式类似于管道的概念，又或者说是函数式编程。形如loader: 'css?!postcss!less'，可以很明显地看出，目标资源先经less-loader处理过后将结果交给postcss-loader作进一步处理，然后最后再交给css-loader。  
        //上面案例交接处不懂。

        exclude:???, ///exclude 参数用来剔除掉需要忽略的资源，该值应是一个条件值(condition)。
        

        include: [              //include是目录/路径
          // 只去解析运行目录下的 src 和 demo 文件夹
          path.join(process.cwd(), './src'),
          path.join(process.cwd(), './demo')
        ],
        query: {
            presets: ['react', 'es2015-ie', 'stage-1']
        }

        //tips
        //条件值(condition)可以是一个字符串（某个资源的文件系统绝对路径），可以是一个函数（官方文档里是有这么写，但既没有示例也没有说明，我也是醉了），可以是一个正则表达式（用来匹配资源的路径，最常用，强烈推荐！），最后，还可以是一个数组，数组的元素可以为上述三种类型，元素之间为与关系（既必须同时满足数组里的所有条件）。需要注意的是，loader是可以接受参数的，方式类似于URL参数，形如'css?minimize&-autoprefixer'，具体每个loader接受什么参数请参考loader本身的文档（一般也就只能在github里看了）。
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