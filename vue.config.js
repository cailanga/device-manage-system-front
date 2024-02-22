const path = require('path');
const productionEnv = require('./config/prod.env'); // 按需引入环境变量

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/vue-admin/' : '/',
  outputDir: path.resolve(__dirname, '../dist'),
  assetsDir: 'static',
  productionSourceMap: true,
// ...
  lintOnSave: false,
  devServer: {
    port: 8081,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },

  // 这里可以根据 productionEnv 中的变量来进行更多的生产环境配置
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
  },

  // CSS SourceMap 的配置
  css: {
    sourceMap: false,
  }
};
