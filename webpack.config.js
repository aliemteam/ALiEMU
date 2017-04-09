const path = require('path');
const webpack = require('webpack');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV === 'production';

const devPlugins = [
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: 'aliemu/vendor/vendor.bundle.js',
    }),
    new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!isProduction),
    }),
    // new BundleAnalyzerPlugin({
    //     analyzerMode: 'server',
    //     analyzerPort: 8888,
    //     openAnalyzer: true,
    // }),
];

const productionPlugins = [
    ...devPlugins,
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            unused: true,
            dead_code: true,
        },
        screw_ie8: true,
    }),
];

module.exports = {
    devtool: isProduction ? 'hidden-source-map' : 'eval-source-map',
    cache: true,
    entry: {
        'aliemu/js/educator-dashboard/index': './aliemu/js/educator-dashboard/index.tsx',
        vendor: [
            'react',
            'mobx',
            'mobx-react',
            'moment',
        ],
    },
    output: {
        filename: '[name].js',
    },
    resolve: {
        modules: [path.resolve(__dirname, 'aliemu'), 'node_modules'],
        extensions: ['*', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        mainFiles: ['index'],
        mainFields: ['main', 'browser'],
        descriptionFiles: ['package.json'],
    },
    plugins: isProduction ? productionPlugins : devPlugins,
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                include: path.resolve(__dirname, 'aliemu'),
                exclude: /__tests__/,
                loaders: ['babel-loader', 'ts-loader'],
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader'],
            },
        ],
    },
};
