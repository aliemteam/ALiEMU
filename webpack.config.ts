import 'dotenv/config';

import path from 'path';

import { CheckerPlugin, TsConfigPathsPlugin } from 'awesome-typescript-loader';
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import rimraf from 'rimraf';
import { BannerPlugin, Configuration, DefinePlugin, Plugin } from 'webpack';
import FixStyleOnlyEntriesPlugin from 'webpack-fix-style-only-entries';

import { version as VERSION } from './package.json';

const STYLE_BANNER = `
/*
Theme Name: ALiEMU
Author: ALiEM
Description: Theme for ALiEMU.com
Version: ${VERSION}
License: MIT
License URI: https://opensource.org/licenses/MIT
Text Domain: aliemu
*/
`;

function assertEnv(key: string): string {
    const value = process.env[key];
    if (value === undefined) {
        throw new Error(
            `Required environment variable "${key}" is not defined.`,
        );
    }
    return JSON.stringify(value);
}

export default (_: any, argv: any): Configuration => {
    const IS_PRODUCTION = argv.mode === 'production';

    rimraf.sync(path.join(__dirname, 'dist', '*'));

    const plugins = new Set<Plugin>([
        new FixStyleOnlyEntriesPlugin({ silent: !IS_PRODUCTION }),
        new DefinePlugin({
            'process.env': {
                GOOGLE_PLACES_KEY: IS_PRODUCTION
                    ? assertEnv('GOOGLE_PLACES_KEY')
                    : assertEnv('GOOGLE_DEV_KEY'),
            },
        }),
        new BannerPlugin({
            banner: STYLE_BANNER,
            raw: true,
            include: /style\.css$/,
        }),
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
                from: 'assets/icons/*',
            },
            {
                from: 'assets/**',
                ignore: ['assets/icons'],
                transform(content: any, contentPath) {
                    if (!IS_PRODUCTION) {
                        return content;
                    }
                    switch (path.extname(contentPath)) {
                        case '.svg':
                            return imagemin.buffer(content, {
                                plugins: [imageminSvgo()],
                            });
                        case '.png':
                            return imagemin.buffer(content, {
                                plugins: [imageminPngquant({ strip: true })],
                            });
                        default:
                            return content;
                    }
                },
            },
        ]),
        new CheckerPlugin(),
    ]);

    if (!IS_PRODUCTION) {
        plugins.add(
            new BrowserSyncPlugin({
                proxy: 'localhost:8080',
                open: false,
                reloadDebounce: 2000,
                notify: false,
            }),
        );
    }

    return {
        devtool: IS_PRODUCTION ? 'source-map' : 'cheap-module-eval-source-map',
        watchOptions: {
            ignored: /(node_modules|__tests__)/,
        },
        context: path.resolve(__dirname, 'src'),
        entry: {
            /**
             * JS Entrypoints
             */
            'js/catalog': 'js/catalog',
            'js/dashboard': ['datalist-polyfill', 'js/dashboard'],
            'js/feedback': 'js/feedback',
            'js/landing-page': 'js/landing-page',
            'js/login': 'js/login',
            'js/mobile-nav-menu-helper': 'js/mobile-nav-menu-helper',

            /**
             * Stylesheet entrypoints
             */
            'css/editor': 'css/editor?global',
            style: 'css/style?global',
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
        stats: IS_PRODUCTION ? 'normal' : 'minimal',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    sideEffects: false,
                    rules: [
                        {
                            loader: 'babel-loader',
                        },
                        {
                            loader: 'awesome-typescript-loader',
                            options: {
                                silent: argv.json,
                                useCache: !IS_PRODUCTION,
                                cacheDirectory: path.resolve(
                                    __dirname,
                                    'node_modules/.cache/awesome-typescript-loader',
                                ),
                                reportFiles: [
                                    '**/*.{ts,tsx}',
                                    '!**/__tests__/**',
                                ],
                            },
                        },
                    ],
                },
                {
                    test: /\.scss$/,
                    rules: [
                        {
                            use: [MiniCssExtractPlugin.loader],
                        },
                        {
                            oneOf: [
                                {
                                    resourceQuery: /global/,
                                    use: [
                                        {
                                            loader: 'css-loader',
                                            options: {
                                                url: false,
                                                importLoaders: 2,
                                                modules: false,
                                            },
                                        },
                                    ],
                                },
                                {
                                    use: [
                                        {
                                            loader: 'css-loader',
                                            options: {
                                                url: false,
                                                importLoaders: 2,
                                                modules: true,
                                                camelCase: 'only',
                                                localIdentName:
                                                    '[name]__[local]___[hash:base64:5]',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            use: [
                                {
                                    loader: 'postcss-loader',
                                    options: {
                                        ident: 'postcss',
                                        plugins: [
                                            require('postcss-preset-env')(),
                                            ...(IS_PRODUCTION
                                                ? [require('cssnano')()]
                                                : []),
                                        ],
                                    },
                                },
                                {
                                    loader: 'sass-loader',
                                    options: {
                                        includePaths: ['src/css'],
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    rules: [
                        {
                            use: [MiniCssExtractPlugin.loader],
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                modules: false,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [
                                    require('postcss-preset-env')(),
                                    ...(IS_PRODUCTION
                                        ? [require('cssnano')()]
                                        : []),
                                ],
                            },
                        },
                    ],
                },
                {
                    test: /\.svg$/,
                    use: ['@svgr/webpack'],
                },
            ],
        },
    };
};
