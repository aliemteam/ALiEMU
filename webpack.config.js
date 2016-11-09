const path = require('path');
const webpack = require('webpack');
// const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

const devPlugins = [
    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false,
    }),
    new webpack.NoErrorsPlugin(),
    // new ForkCheckerPlugin(),
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: 'vendor',
    //     minChunks: 2,
    //     filename: 'aliemu/vendor/vendor.bundle.js',
    // }),
];

const productionPlugins = [
    ...devPlugins,
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
        output: {
            comments: false,
        },
        sourceMap: false,
    }),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }),
];

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    devtool: isProduction ? 'hidden-source-map' : 'eval-source-map',
    cache: true,
    entry: {
        'aliemu/features/dashboards/educator-dashboard/index': './aliemu/features/dashboards/educator-dashboard/index.tsx',
        // vendor: ['react', 'mobx', 'mobx-react'],
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
                loaders: ['babel', 'ts'],
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
            },
        ],
    },
};
