const path =  require('path');
const resolve = (dir) => path.join(__dirname, dir);
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

//打包分析;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

//压缩JS;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const cdn = {
      css: [],
      js: [
        '//static8.baihe.com/common/js/vue.min.js',
        '//static8.baihe.com/common/js/vuex.min.js',
        '//static8.baihe.com/common/js/vue-router.min.js',
        '//static8.baihe.com/common/js/axios.min.js'
      ]
    };

module.exports = {
    // 基本路径
    publicPath : IS_PROD ? "http://static8.baihe.com/projectName/" : "/",
    // 输出文件目录
    outputDir: '../projectName',
    assetsDir: '',  // 相对于outputDir的静态资源(js、css、img、fonts)目录
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
                data: `
                    @import "./node_modules/base_mixins/_base_mixins.scss";
                    $src: "${process.env.VUE_APP_OSS_SRC}";
                `
            }
        }
    },
    // 在生产环境下为 Babel 和 TypeScript 使用 `thread-loader`
    // 在多核机器下会默认开启。
    parallel: require('os').cpus().length > 1,
    chainWebpack: config => {

    	// 添加别名
        config.resolve.alias
          .set('vue$', 'vue/dist/vue.esm.js')
          .set('@', resolve('src'))
          .set('@assets', resolve('src/assets'))
          .set('@components', resolve('src/components'))
          .set('@views', resolve('src/views'));

        // 打包分析
        if (process.env.IS_ANALY) {
          config.plugin('webpack-report')
            .use(BundleAnalyzerPlugin, [{
              analyzerMode: 'static',
            }]);
        }

        if(IS_PROD){
            // html中添加cdn
            config.plugin('html').tap(args => {
              args[0].cdn = cdn
              return args
            })

            // 压缩代码
            config.optimization.minimize(true);
            //分割代码
            config.optimization.splitChunks({
                 chunks: 'all'
            })

            // 移除 prefetch 插件
            config.plugins.delete('prefetch');
            // 移除 preload 插件
            config.plugins.delete('preload');
            // 修复HMR
            config.resolve.symlinks(true);
            //修复 Lazy loading routes Error
            config.plugin('html').tap(args => {
                args[0].chunksSortMode = 'none';
                return args;
            });

            //压缩图片;
            config.module
                .rule("image-webpack-loader")
                .test(/\.(gif|png|jpe?g|svg)$/i)
                .use("file-loader")
                .loader("image-webpack-loader")
                .options({
                    mozjpeg: {progressive: true, quality: 65},
                    optipng: {enabled: false},
                    pngquant: {quality: "65-90", speed: 4},
                    gifsicle: {interlaced: false},
                    webp: {quality: 75}
                })
                .tap(() => ({
                  disable: IS_PROD
                }))
                .end();
        }

    },
    configureWebpack: config => {

        if(IS_PROD){
            config.externals = {
              vue: 'Vue',
              'vue-router': 'VueRouter',
              vuex: 'Vuex',
              axios: 'axios'
            }

            // 为生产环境修改配置...
            config.plugins.push(
                //生产环境自动删除console
                new UglifyJsPlugin({
                    chunkFilter: chunk => {
                        // Exclude uglification for the `vendor` chunk
                        if (chunk.name === 'vendor') {
                            return false;
                        }

                        return true;
                    },
                    uglifyOptions: {
                        compress: {
                            //warnings: false,
                            drop_debugger: true,
                            drop_console: true,
                        },
                    },
                    sourceMap: false,
                    parallel: true,
                })
            );
        }
    },
    // vue-loader 配置项
	// https://vue-loader.vuejs.org/en/options.html
	//vueLoader: {},
	// 生产环境是否生成 sourceMap 文件
 	productionSourceMap: false, // 生产环境的 source map
 	// 是否启用dll
	// See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
	//dll: false,
 	// PWA 插件相关配置
	// see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
	//pwa: {},
 	// webpack-dev-server 相关配置
    devServer: {
        overlay: { // 让浏览器 overlay 同时显示警告和错误
          warnings: true,
          errors: true
        },
    	https: false,
    	hotOnly: false,
         // 设置主机地址
        host: 'localhost',
        // 设置默认端口
        port: 8081,
        open: false,//项目启动时是否自动打开浏览器，我这里设置为false,不打开，true表示打开
        //before: app => {},
        // 设置代理
        //proxy: {
            // [process.env.VUE_APP_URL]: {//代理api
            //     target: "https://",//服务器api地址
            //     changeOrigin: true,//是否跨域
            //     ws: true, // proxy websockets
            //     pathRewrite:{
            //        ['^'+process.env.VUE_APP_URL]:''
            //     },
            //     secure: false
            // }
        //}
    }
}
