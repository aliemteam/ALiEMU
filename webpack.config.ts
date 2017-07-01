import * as path from 'path';
import * as webpack from 'webpack';
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV === 'production';

const devPlugins = [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
        filename: 'aliemu/vendor/vendor.bundle.js',
        minChunks: Infinity,
        name: 'vendor',
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({
        __DEV__: JSON.stringify(!isProduction),
        'process.env': {
            NODE_ENV: isProduction ? JSON.stringify('production') : '',
        }
    }),
    // new BundleAnalyzerPlugin({ analyzerMode: 'server', analyzerPort: 8888, openAnalyzer: true }),
];

const productionPlugins = [
    ...devPlugins,
    new webpack.LoaderOptionsPlugin({
        minimize: true,
    }),
    new webpack.optimize.UglifyJsPlugin(),
];

const config: webpack.Configuration = {
    cache: true,
    devtool: isProduction ? 'hidden-source-map' : 'eval-source-map',
    entry: {
        'aliemu/features/dashboards/educator-dashboard/index':
            './aliemu/features/dashboards/educator-dashboard/index.tsx',
        vendor: ['react', 'mobx', 'mobx-react'],
    },
    output: {
        filename: '[name].js',
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
