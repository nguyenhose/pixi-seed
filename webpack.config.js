const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
    return ({
        stats: 'minimal',
        entry: './src/index.ts',

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js'
        },

        devServer: {
            compress: true,
            allowedHosts: 'all',
            static: false,
            client: {
                logging: 'warn',
                overlay: {
                    errors: true,
                    warnings: false
                },
                progress: true
            },
            port: 6868, 
            host: '0.0.0.0'
        },

        performance: { hints: false },

        devtool: argv.mode === 'development' ? 'eval-source-map' : undefined,

        optimization: {
            minimize: argv.mode === 'production',
            minimizer: [new TerserPlugin({
                terserOptions: {
                    ecma: 6,
                    // compress: { drop_console: true},
                    output: { comments: false, beautify: false },
                }
            })]
        },

        module: {
            rules: [
                {
                    test: /\.ts(x)?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/
                }
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        plugins: [
            // copy static assets to final build
            new CopyPlugin({
                patterns: [{ from : 'static/' }]
            }),
            // make an index.html from the template
            new HtmlWebpackPlugin({
                template: 'build-templates/index.ejs',
                hash: true,
                minify: true
            })
        ]
    })
}