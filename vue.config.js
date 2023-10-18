/*
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-13 02:44:18
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-10-08 09:10:43
 * @FilePath: \quhu\vue.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const path = require('path');
const HotHashWebpackPlugin = require('hot-hash-webpack-plugin');
const WebpackBar = require('webpackbar');
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const webpack = require('webpack')
const productionGzipExtensions = ['js', 'css']
const resolve = (dir) => path.join(__dirname, '.', dir)
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  productionSourceMap: process.env.NODE_ENV === 'production'?false:true,
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'assets',
  devServer: {
    proxy: {
      '/abc': {
        // target: 'http://45.77.114.109:668',
        target: 'https://api.onlyfun.city',
        // target: 'https://re.steem.vip/api',
        changeOrigin: true,
        pathRewrite: {
          '/abc': ''
        }
      },
      '/steem': {
        target: 'https://app.onlyfun.city/api',
        // target: 'https://api.justyy.com',
        changeOrigin: true,
        pathRewrite: {
          '/steem': ''
        }
      },
      '/dep': {
        target: 'http://178.18.253.86:668',
        // target: 'https://node.onlyfun.city',
        changeOrigin: true,
        pathRewrite: {
          '/dep': ''
        }
      },
      '/socket': {
        target: 'ws://app.onlyfun.city:668/ws',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/socket': '/'
        }
      }
    },
    port: 8888,
    host: '0.0.0.0',
    https: false,
    open: true
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.sass` 这个文件
        // 注意：在 sass-loader v8 中，这个选项名是 "prependData"
        additionalData: `@import "~@/variables.sass"`
      },
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `prependData` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      scss: {
        additionalData: `@import "~@/variables.scss";`
      }
    }
  },
  // lintOnSave: false,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
    //引入图标
    config.module.rule("svg").exclude.add(resolve("./src/assets/svg"));
    config.module.rule("icon").test(/\.svg$/)
      .include.add(resolve("./src/assets/svg")).end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: 'icon-[name]'
      });

    config
      .plugin('html')
      .tap(args => {
        // try {
        //   console.log(args)
        //   throw new Error('123')
        // } catch (error) {
        //   throw new Error(error)
        // }
       
        args[0].title = 'onlyfun'
        return args
      })
    config.plugin('define').tap(args => [{
      ...args,
      "window.isDefine": JSON.stringify(true),
    }]);
    config
      .plugin('Quill')
      .use(webpack.ProvidePlugin, [{
        'window.Quill': 'quill'

      }])

    //   config.set('externals', {
    //     three: 'three',
    //     'vue-router': 'VueRouter',
    //     axios: 'axios',
    //     lodash: '_',
    //     moment: 'moment',
    //     nprogress: 'NProgress',
    //     'element-ui': 'ELEMENT'
    // })
    // 生产环境配置
    if (process.env.NODE_ENV === 'production') {
      config.output.filename('./js/[name].[chunkhash:8].js');
      config.output.chunkFilename('./js/[name].[chunkhash:8].js');
      config.plugin('extract-css').tap(args => [{
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].css'
      }]);
      config.plugin('hotHash').use(HotHashWebpackPlugin, [{ version: '1.0.0' }]);
      config.plugin('webpackBar').use(WebpackBar);

      config.optimization.minimize(true)
        .minimizer('terser')
        .tap(args => {
          let { terserOptions } = args[0];
          terserOptions.compress.drop_console = true;
          terserOptions.compress.drop_debugger = true;
          return args
        });
      config.optimization.splitChunks({
        cacheGroups: {
          common: {
            name: 'common',
            chunks: 'all',
            minSize: 1,
            minChunks: 2,
            priority: 1
          },
          vendor: {
            name: 'chunk-libs',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 10
          }
        }
      });
    }
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV == 'production') {
      // 为生产环境修改配置
      config.mode = 'production'
      // 将每个依赖包打包成单独的js文件
      let optimization = {
        minimizer: [new UglifyPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log']
            }
          }
        })]
      }

      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]', // 提示示compression-webpack-plugin@3.0.0的话asset改为filename
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        })
      );

      Object.assign(config, {
        optimization
      })
    } else {
      // 为开发环境修改配置
      config.mode = 'development'
      config.devtool = "source-map"
    }
  }
};