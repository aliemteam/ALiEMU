// TODO: send PR to definitelytyped for these
declare module '@wordpress/dom-ready';
declare module '@wordpress/html-entities';

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
    // eslint-disable-next-line react/display-name
    export default class extends React.Component<any> {}
}
