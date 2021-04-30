'use strict';

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    cache: true,
    // mode='development' uses eval(), which doesn't work in chrome extension's sandbox environment.
    mode: 'production',
    entry: {
        contentScript: `./src/contentScript.ts`,
        background: `./src/background.ts`,
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: ['./node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpg|jpeg|gif|ico)$/,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './src/static/**/*',
                    to: '[name][ext]',
                },
            ],
        }),
        new ForkTsCheckerWebpackPlugin(),
    ],
};
