var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:1337',
        'webpack/hot/dev-server',
        './src/js/index'
    ],
    output: {
        path: __dirname,
        filename: 'bundle.js',
        publicPath: '/static/public/build'
    },
    node: {
        fs: "empty"
    },

    module: {
        loaders: [
            { test: /\.js$/, loaders: ['babel'], include: path.join(__dirname, 'src') },
            { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader?sourceMap', include: path.join(__dirname, 'src/scss')},
            { test: /\.css$/, loader: 'style-loader!css-loader?sourceMap', include: path.join(__dirname, 'src/scss')},
        ]
    },
    plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin()
    ]

};



