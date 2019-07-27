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
