const path =  require('path');
const resolve = (dir) => path.join(__dirname, dir);
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

//复制文件插件;
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
    // 基本路径
    publicPath : process.env.NODE_ENV === "production" ? "http://static8.baihe.com/xxxx/" : "/",
    // 输出文件目录
    outputDir: '../bh-plaza_source',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    filenameHashing: false,
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        // 开启 CSS source maps?
        sourceMap: false,
        // 启用 CSS modules for all css / pre-processor files.
        modules: false,
        loaderOptions: {
            sass: {
                data: `@import "./node_modules/base_mixins/_base_mixins.scss";`
            }
        }
    },
    chainWebpack: config  => {
    	// 添加别名
        config.resolve.alias
          .set('vue$', 'vue/dist/vue.esm.js')
          .set('@', resolve('src'))
          .set('@assets', resolve('src/assets'))
          .set('@components', resolve('src/components'))
          .set('@views', resolve('src/views'))
    },
    configureWebpack: () => {},
    // vue-loader 配置项
	// https://vue-loader.vuejs.org/en/options.html
	vueLoader: {},
	// 生产环境是否生成 sourceMap 文件
 	productionSourceMap: false,
 	// 是否启用dll
	// See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
	dll: false,
 	// PWA 插件相关配置
	// see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
	pwa: {},
 	// webpack-dev-server 相关配置
    devServer: {
    	https: false,
    	hotOnly: false,
         // 设置主机地址
        host: 'localhost',
        // 设置默认端口
        port: 8081,
        open: false,//项目启动时是否自动打开浏览器，我这里设置为false,不打开，true表示打开
        before: app => {},
        // 设置代理
        proxy: {
            [process.env.VUE_APP_URL]: {//代理api
                //target: "https://cpi.baihe.com/",//服务器api地址
                changeOrigin: true,//是否跨域
                //ws: true, // proxy websockets
                pathRewrite:{
                   ['^'+process.env.VUE_APP_URL]:''
                },
                secure: false
            }
        }
    },
    // 第三方插件配置
	pluginOptions: {
	  new CopyPlugin([
	      { from: 'source', to: 'dest' },
	      { from: 'other', to: 'public' },
	    ]),
	}

}
