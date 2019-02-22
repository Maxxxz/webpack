const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: './release/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {  //这里配置或者.babelrc文件配置都行，只在一个地方配置就好
            // presets: ['@babel/preset-env'], 
            // plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]]
          }
        }
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './index.html'
    })
  ],

  devServer: {
    contentBase: path.join(__dirname, './release'),
    open: true,
    port: 9000
  }
};
