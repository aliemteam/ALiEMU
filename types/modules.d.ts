declare module 'browser-sync-webpack-plugin';
declare module 'webpack-fix-style-only-entries';

declare module '*.scss' {
    const content: {
        [identifier: string]: any;
    };
    export = content;
}

declare module '*.svg' {
    import * as React from 'react';
    export default class extends React.Component<any> {}
}
