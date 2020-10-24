var path    = require('path');
var webpack = require('webpack');



module.exports = function (env) {
    return [{
        target: "node",
        entry: {
            spec: [
                path.resolve(__dirname, 'src/_spec/index.ts')
            ]
        },
        output: {
            library: 'JasmineSpecsRunnerApp',

            libraryTarget: 'commonjs2',
            filename: 'index.spec.js',
            path: path.resolve(__dirname, 'bin.test'),
            devtoolModuleFilenameTemplate: '../[resource-path]',
            // devtoolModuleFilenameTemplate: void 0
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                use: [
                    'babel-loader',
                    'ts-loader?' + JSON.stringify({
                        configFile: 'tsconfig.spec.json'
                    }),
                ],
                exclude: /node_modules[\/\\](?!tynder|liyad|fruitsconfits).*$/
            }, {
                test: /\.jsx?$/,
                use: ['babel-loader'],
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
