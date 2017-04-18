var webpack = require('webpack');
var CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
    entry: "./app/assets/js/main.js",
    output: {
        path: "./public/assets",
        filename: "bundle.js",
        publicPath: "/assets/"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: "/node_modules/",
                loader: 'babel-loader',
                query: {
                    presets: ["es2015", "react"]
                }
            },
            {
                test: /\.scss$/,
                loader: "style-loader!css-loader!autoprefixer-loader!sass-loader"
            }, 
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: "file-loader?name=img/img-[hash:6].[ext]"
            }
        ]
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings: true
            }
        }),
        new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.(js|html)$/,
			threshold: 10240,
			minRatio: 0.8
		})
    ]
};