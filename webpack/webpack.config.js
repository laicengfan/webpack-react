const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const EsLintWebpackPlugin = require('eslint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

// 相对路径转绝对路径
const resolvePath = _path => path.resolve(__dirname, _path)

// 获取cross-env环境变量
const isEnvProduction = process.env.NODE_ENV === 'production'

const getStyleLoaders = (prevLoader) => {
  return [
    // 将css单独抽取成文件
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
      // 处理css兼容问题
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: ['postcss-preset-env']
        }
      }
    },
    prevLoader
  ].filter(Boolean)
}

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
      use: getStyleLoaders('less-loader')
    }, {
      test: /\.less$/,
      use: getStyleLoaders()
    }, {
      test: /\.s[ac]ss$/,
      use: getStyleLoaders('sass-loader')
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
        cacheCompression: false,
        plugins: [
          'react-refresh/babel'
        ]
      }
    }]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: resolvePath('../public/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: isEnvProduction ? 'css/[name].[contenthash:10].css' : 'css/[name].css',
      chunkFilename: isEnvProduction ? 'css/[name].[contenthash:10].chunk.css' : 'css/[name].chunk.css',
    }),
    new EsLintWebpackPlugin({
      context: resolvePath('../src'),
      exclude:'node_modules',
      cache: true,
      cacheLocation: resolvePath('../node_modules/.cache/.eslintCache')
    }),
    new ReactRefreshWebpackPlugin()
  ],

  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"]
  },

  mode: 'development',

  devtool: 'cheap-module-source-map',

  devServer: {
    host: 'localhost',
    port: 8080,
    open: true,
    hot: true,
    // 使用 index.html 代替所有404页面，解决使用H5的history API刷新页面导致404的问题
    historyApiFallback: true,
  },
}