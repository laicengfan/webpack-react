const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const EsLintWebpackPlugin = require('eslint-webpack-plugin')

// 相对路径转绝对路径
const resolvePath = _path => path.resolve(__dirname, _path)

module.exports = {
  entry: resolvePath('../src/index.tsx'),

  output: {
    path: resolvePath('../dist'),
    clean: true,
    filename: 'scripts/[name].js'
  },

  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.less$/,
      use: [
        'style-loader',
        'css-loader',
        'less-loader'
      ]
    }, {
      test: /\.s[ac]ss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader'
      ]
    }, {
      // 处理图片
      test: /\.(jpe?g|png|gif|webp|svg)$/,
      type: 'asset',
      generator: {
        filename: 'assets/img/[hash:10][ext]'
      },
      parser: {
        dataUrlCondition: {
          // 小于60kb的图片会被base64处理
          maxSize: 60 * 1024
        }
      }
    }, {
      // 处理字体资源
      test: /\.(woff2?|ttf)$/,
      // type设置为 resource 原封不动输出内容
      type: 'asset/resource'
    },{
      test: /\.(js|jsx|ts|tsx)$/,
      // 只处理 src 下的文件，排除其他如 node_modules 的处理
      include: resolvePath('../src'),
      loader:'babel-loader',
      options: {
        // 开启babel缓存
        cacheDirectory: true,
        // 关闭缓存压缩
        cacheCompression: false
      }
    }]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: resolvePath('../public/index.html'),
    }),
    new EsLintWebpackPlugin({
      context: resolvePath('../src'),
      exclude:'node_modules',
      cache: true,
      cacheLocation: resolvePath('../node_modules/.cache/.eslintCache')
    })
    
  ],

  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"]
  },

  mode: 'development',

  devServer: {
    host: 'localhost',
    port: 8080,
    open: true,
    hot: true,
  },
}