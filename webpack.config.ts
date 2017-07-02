import * as path from 'path';
import * as webpack from 'webpack';
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV === 'production';

const commonPlugins: webpack.Plugin[] = [
    new webpack.optimize.CommonsChunkPlugin({
        filename: 'vendor.bundle.js',
        minChunks: Infinity,
        name: 'vendor',
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
];

const devPlugins: webpack.Plugin[] = [
    ...commonPlugins,
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!isProduction),
    }),
    // new BundleAnalyzerPlugin({ analyzerMode: 'server', analyzerPort: 8888, openAnalyzer: true }),
];

const productionPlugins: webpack.Plugin[] = [
    ...commonPlugins,
    new webpack.LoaderOptionsPlugin({
        minimize: true,
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
];

const config: webpack.Configuration = {
    cache: true,
    devtool: isProduction ? 'hidden-source-map' : 'eval-source-map',
    entry: {
        'educator-dashboard': './aliemu/js/educator-dashboard/',
        vendor: ['react', 'mobx', 'mobx-react'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/aliemu/js'),
    },
    resolve: {
        modules: [path.resolve(__dirname, 'aliemu'), 'node_modules'],
        extensions: ['*', '.ts', '.tsx', '.js'],
        mainFiles: ['index'],
        mainFields: ['main', 'browser'],
        descriptionFiles: ['package.json'],
    },
    plugins: isProduction ? productionPlugins : devPlugins,
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'ts-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};

export default config;
