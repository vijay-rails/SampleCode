const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
console.log('running production server webpack config with node env value: ')
console.log(process.env.NODE_ENV)
module.exports = {
	entry: path.join(__dirname, 'src', 'client.js'),  // overwritten by universal-webpack-settings.json
	output: {
		path: path.join(__dirname, 'src', 'static', 'js'), // overwritten by universal-webpack-settings.json
		filename: 'bundle.js'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'BROWSER': JSON.stringify(false),
				'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
			}
		}),
		// new webpack.optimize.DedupePlugin(), not used anymore in wp2
		// new webpack.optimize.OccurenceOrderPlugin(), is now on by default in wp2 don't need to specify it anymore
		new webpack.optimize.UglifyJsPlugin({
			compress: { warnings: false },
			mangle: true,
			sourcemap: true,
			beautify: false,
			dead_code: true
		}),
		new ExtractTextPlugin('bundle.css')
	],
	module: {
		rules: [
			{
				test: /\.jsx?/,
				loader: 'babel-loader',
				include: path.join(__dirname, 'src'),
				exclude: path.join(__dirname, 'node_modules')
			}, {
				test: /\.css$/,
				// loaders: ['style-loader', 'css-loader']
				use: ExtractTextPlugin.extract({
					use: 'css-loader'
				})
			}, {
				test: /\.(woff2?|ttf|eot|svg)$/,
				use: 'url-loader?limit=10000'
			}, {
				test: /\.(png|jpg)$/,
				use: 'url-loader?limit=8192'
			}, {
				test: /\.json$/,
				use: 'json-loader'
			}
		]
	}
}