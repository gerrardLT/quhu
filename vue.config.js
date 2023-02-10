/*
 * @Author: gerrardlt 305690790@qq.com
 * @Date: 2023-01-13 02:44:18
 * @LastEditors: gerrardlt 305690790@qq.com
 * @LastEditTime: 2023-01-30 01:54:23
 * @FilePath: \quhu\vue.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const path = require('path');
const HotHashWebpackPlugin = require('hot-hash-webpack-plugin');
const WebpackBar = require('webpackbar');
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const resolve = (dir) => path.join(__dirname, '.', dir);

module.exports = {
  productionSourceMap: false,
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'assets',
  devServer: {
    proxy: {
      '/abc': {
        // target: 'http://45.77.114.109:668',
        target: 'https://api.onlyfun.city',
        changeOrigin: true,
        pathRewrite: {
          '/abc': ''
        }
      },
      '/steem': {
        target: 'https://node.onlyfun.city',
        // target: 'https://node.onlyfun.city',
        changeOrigin: true,
        pathRewrite: {
          '/steem': ''
        }
      }
    },
    port: 8888,
    host: '0.0.0.0',
    https: false,
    open: true
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

    config.plugin('define').tap(args => [{
      ...args,
      "window.isDefine": JSON.stringify(true)
    }]);

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
            asset: '[path].gz[query]', // 提示示compression-webpack-plugin@3.0.0的话asset改为filename
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
    }
  }
};