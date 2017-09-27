import { TsConfigPathsPlugin } from 'awesome-typescript-loader';
import { resolve } from 'path';
import * as webpack from 'webpack';
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const sharedPlugins: webpack.Plugin[] = [
    new webpack.NoEmitOnErrorsPlugin(),
    // new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
];

const devPlugins: webpack.Plugin[] = [
    ...sharedPlugins,
    new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!IS_PRODUCTION),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    // new BundleAnalyzerPlugin({ analyzerMode: 'server', analyzerPort: 8888, openAnalyzer: true }),
];

const productionPlugins: webpack.Plugin[] = [
    ...sharedPlugins,
    new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: {
            screw_ie8: true,
            keep_fnames: true,
        },
        compress: {
            screw_ie8: true,
        },
        comments: false,
    }),
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
    }),
];

const config: webpack.Configuration = {
    watch: !IS_PRODUCTION,
    watchOptions: {
        ignored: /(node_modules|gulpfile|dist|lib|webpack.config)/,
    },
    devtool: IS_PRODUCTION ? 'cheap-module-source-map' : 'source-map',
    entry: {
        'educator-dashboard': './aliemu/js/educator-dashboard/',
        'nav-helper': ['./aliemu/js/nav-helper'],
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, 'dist/aliemu/js'),
    },
    resolve: {
        modules: [resolve(__dirname, 'aliemu'), 'node_modules'],
        extensions: ['*', '.ts', '.tsx', '.js'],
        plugins: [new TsConfigPathsPlugin()],
    },
    plugins: IS_PRODUCTION ? productionPlugins : devPlugins,
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /(?:__tests__|node_modules)/,
                use: ['awesome-typescript-loader'],
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};

export default config;
