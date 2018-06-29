const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const { execSync } = require('child_process');
const path = require('path');
const webpack = require('webpack');

const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const imagemin = require('imagemin');
const pngquant = require('imagemin-pngquant');
const svgo = require('imagemin-svgo');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Clean out dist directory
execSync(`rm -rf ${__dirname}/dist/*`);

const plugins = new Set([
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.WatchIgnorePlugin([
        /(node_modules|gulpfile|dist|webpack.config)/,
        path.resolve(__dirname, 'lib', 'tmp'),
        path.resolve(__dirname, 'lib', 'scripts'),
        path.resolve(__dirname, 'lib', 'utils'),
    ]),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin([
        {
            from: '**/*.php',
            ignore: ['templates/pages'],
        },
        {
            from: 'templates/pages/*.php',
            to: 'page-[name].[ext]',
        },
        {
            from: 'vendor/*',
        },
        {
            from: 'assets/**',
            transform: (content, pathname) => {
                switch (path.extname(pathname)) {
                    case '.png':
                        return imagemin.buffer(content, {
                            plugins: [pngquant()],
                        });
                    case '.svg':
                        return imagemin.buffer(content, {
                            plugins: [svgo()],
                        });
                    default:
                        return content;
                }
            },
        },
    ]),
]);

if (!IS_PRODUCTION) {
    plugins.add(
        new BrowserSyncPlugin(
            {
                proxy: 'localhost:8080',
                open: false,
                reloadDebounce: 2000,
                notify: false,
            },
            {
                injectCss: true,
            },
        ),
    );
}

if (IS_PRODUCTION) {
    plugins
        .add(new webpack.optimize.ModuleConcatenationPlugin())
        .add(new webpack.optimize.OccurrenceOrderPlugin(true))
        .add(new UglifyJsPlugin({ sourceMap: true }));
}

module.exports = {
    mode: IS_PRODUCTION ? 'production' : 'development',
    watch: !IS_PRODUCTION,
    devtool: IS_PRODUCTION ? 'cheap-module-source-map' : 'source-map',
    context: path.resolve(__dirname, 'src'),
    entry: {
        /**
         * JS Entrypoints
         */
        'js/catalog': 'js/catalog',
        'js/dashboard': 'js/dashboard',
        'js/mobile-nav-menu-helper': 'js/mobile-nav-menu-helper',
        'js/polyfills': 'js/polyfills',

        /**
         * Stylesheet entrypoints
         */
        'css/editor': 'css/_entrypoints/editor',
        style: 'css/_entrypoints/style',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        alias: {
            css: path.resolve(__dirname, 'src/css/'),
        },
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['*', '.ts', '.tsx', '.js', '.scss'],
        plugins: [new TsConfigPathsPlugin()],
    },
    plugins: [...plugins],
    stats: {
        children: IS_PRODUCTION,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(?:__tests__|node_modules)/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            useBabel: true,
                            useCache: !IS_PRODUCTION,
                            cacheDirectory: path.resolve(
                                __dirname,
                                'node_modules/.cache/awesome-typescript-loader',
                            ),
                            babelCore: '@babel/core',
                            reportFiles: ['src/**/*.{ts,tsx}'],
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                oneOf: [
                    {
                        resourceQuery: /global/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                    modules: false,
                                    minimize: IS_PRODUCTION,
                                    sourceMap: !IS_PRODUCTION,
                                },
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: !IS_PRODUCTION,
                                    outputStyle: IS_PRODUCTION
                                        ? 'compressed'
                                        : 'expanded',
                                    includePaths: ['src/css'],
                                },
                            },
                        ],
                    },
                    {
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                    modules: true,
                                    minimize: IS_PRODUCTION,
                                    sourceMap: !IS_PRODUCTION,
                                    camelCase: 'only',
                                    localIdentName:
                                        '[name]__[local]___[hash:base64:5]',
                                },
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: !IS_PRODUCTION,
                                    outputStyle: IS_PRODUCTION
                                        ? 'compressed'
                                        : 'expanded',
                                    includePaths: ['src/css'],
                                },
                            },
                        ],
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: IS_PRODUCTION,
                            sourceMap: !IS_PRODUCTION,
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                use: [
                    'babel-loader',
                    {
                        loader: 'react-svg-loader',
                        options: {
                            svgo: {
                                plugins: [{ removeTitle: false }],
                                floatPrecision: 2,
                            },
                        },
                    },
                ],
            },
        ],
    },
};
