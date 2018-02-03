import { TsConfigPathsPlugin } from 'awesome-typescript-loader';
import { execSync } from 'child_process';
import * as path from 'path';
import * as webpack from 'webpack';

import * as BroswerSyncPlugin from 'browser-sync-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin';

const imagemin = require('imagemin');
const pngquant = require('imagemin-pngquant');
const svgo = require('imagemin-svgo');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Clean out dist directory
execSync(`rm -rf ${__dirname}/dist/*`);

const plugins: Set<webpack.Plugin> = new Set([
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
    new ExtractTextPlugin({
        filename: (getPath: (format: string) => string): string => {
            const p = getPath('[name]');
            const dirname = path.dirname(p) + '.css';
            const filename = path.basename(p) + '.css';
            switch (filename) {
                case 'index.css':
                    return `css/${dirname}`;
                case 'style.css':
                    return 'style.css';
                default:
                    return `css/${filename}`;
            }
        },
        ignoreOrder: true,
    }),
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
            transform: (content, pathname): any => {
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
                        throw new Error(
                            `Need to install imagemin plugin for ${path.extname(
                                pathname,
                            )}`,
                        );
                }
            },
        },
    ]),
]);

if (!IS_PRODUCTION) {
    plugins.add(
        new BroswerSyncPlugin({
            proxy: 'localhost:8080',
            open: false,
            reloadDebounce: 2000,
            notify: false,
        },
        {
            injectCss: true,
        }),
    );
}

if (IS_PRODUCTION) {
    plugins
        .add(new webpack.optimize.ModuleConcatenationPlugin())
        .add(new webpack.optimize.OccurrenceOrderPlugin(true))
        .add(new UglifyJsPlugin({ sourceMap: true }));
}

export default <webpack.Configuration>{
    watch: !IS_PRODUCTION,
    devtool: IS_PRODUCTION ? 'cheap-module-source-map' : 'source-map',
    context: path.resolve(__dirname, 'src'),
    entry: {
        /**
         * JS Entrypoints
         */
        'js/educator-dashboard': 'js/_entrypoints/educator-dashboard',
        'js/mobile-nav-menu-helper': 'js/_entrypoints/mobile-nav-menu-helper',

        /**
         * Stylesheet entrypoints
         */
        style: 'css/_entrypoints/style',
        'css/editor': 'css/_entrypoints/editor',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
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
                        use: ExtractTextPlugin.extract({
                            use: [
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
                                        includePaths: [
                                            path.resolve(
                                                __dirname,
                                                'src/styles',
                                            ),
                                        ],
                                    },
                                },
                            ],
                            allChunks: true,
                        }),
                    },
                    {
                        use: ExtractTextPlugin.extract({
                            use: [
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
                                        includePaths: [
                                            path.resolve(
                                                __dirname,
                                                'src/styles',
                                            ),
                                        ],
                                    },
                                },
                            ],
                            allChunks: true,
                        }),
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: IS_PRODUCTION,
                                sourceMap: !IS_PRODUCTION,
                            },
                        },
                    ],
                    allChunks: true,
                }),
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
