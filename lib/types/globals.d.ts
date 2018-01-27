declare module 'browser-sync-webpack-plugin';
declare module 'extract-text-webpack-plugin';
declare module 'gulp-uglify/composer';
declare module 'uglify-es';
declare module 'uglifyjs-webpack-plugin';
declare module '*.scss' {
    const content: {
        [identifier: string]: any;
    };
    export = content;
}
declare module '*.svg' {
    import * as React from 'react';
    export default class extends React.Component {}
}
