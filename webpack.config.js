'use strict';
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = () => ({
	devtool: 'source-map',
	stats: 'errors-only',
	entry: {
		index: './src/index'
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
		clean: true
	},
	module: {
		rules: [{
			test: /\.pug$/,
			use: 'pug-loader'
		},
		{
			test: /\.styl$/,
			use: [
				'style-loader',
				'css-loader',
				'stylus-loader'
			]
		}]
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{
					context: './src',
					from: '*',
					globOptions: {
						ignore: ['*.js']
					}
				},
				{
					from: 'src/static',
					to: 'static'
				},
				{
					from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js'
				},
				{
					from: 'node_modules/activate-power-mode/dist/activate-power-mode.js'
				}
			]
		}),
		new HtmlWebpackPlugin({
			title: 'Markdown New Tab',
			template: './src/pug/index.pug'
		})
	],
	optimization: {
		// Without this, function names will be garbled and enableFeature won't work
		concatenateModules: true,

		// Automatically enabled on production; keeps it somewhat readable for AMO reviewers
		minimizer: [
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					mangle: false,
					compress: false,
					output: {
						beautify: true,
						indent_level: 2
					}
				}
			})
		]
	}
});
