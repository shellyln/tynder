var path    = require('path');
var webpack = require('webpack');


const babelOptions = {
    loader: 'babel-loader',
    options: {
        'sourceMaps': true,
        'presets': [
            ['@babel/preset-env', {
                'targets': {
                    'chrome': 68
                }
            }]
        ],
        'ignore': [],
    }
};


module.exports = function (env) {
    return [{
        target: "web",
        entry: {
            tynder: [
                path.resolve(__dirname, 'src/index.ts')
            ],
            "tynder-rt": [
                path.resolve(__dirname, 'src/index-rt.ts')
            ]
        },
        node: {
            // fs: false,
            // console: false,
            // process: false,
            global: false,
            __filename: false,
            __dirname: false,
            // Buffer: false,
            // setImmediate: false,
        },
        output: {
            library: 'tynder',

            libraryTarget: 'umd',
            globalObject: 'this',
            filename: process.env.NODE_ENV === 'production' ? '[name].min.js' : '[name].js',
            path: path.resolve(__dirname, 'dist'),
            devtoolModuleFilenameTemplate: void 0
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                use: [
                    babelOptions,
                    'ts-loader?' + JSON.stringify({
                        configFile: 'tsconfig.json'
                    }),
                ],
                exclude: /node_modules[\/\\](?!tynder|liyad|fruitsconfits).*$/
            }, {
                test: /\.jsx?$/,
                use: [
                    babelOptions,
                ],
                exclude: /node_modules[\/\\](?!tynder|liyad|fruitsconfits).*$/
            }, {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
            }, {
                enforce: 'pre',
                test: /\.[tj]sx?$/,
                use: {
                    loader: 'source-map-loader',
                    options: {
                    }
                },
                exclude: /node_modules[\/\\](?!tynder|liyad|fruitsconfits).*$/
            }]
        },
        plugins: [],
        resolve: {
            extensions: ['.tsx', '.ts', '.jsx', '.js']
        },
        devtool: 'source-map'
    },

]}
