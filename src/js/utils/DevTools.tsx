// tslint:disable:no-typeof-undefined
import DevTool from 'mobx-react-devtools';
import * as React from 'react';

export default function devtool(props: any): JSX.Element | null {
    if (process.env.NODE_ENV !== 'production') {
        return <DevTool {...props} />;
    }
    return null;
}

export function configureDevtool(options: {
    logEnabled?: boolean;
    updatesEnabled?: boolean;
    graphEnabled?: boolean;
    logFilter?: (p: any) => boolean;
}): void {
    if (process.env.NODE_ENV !== 'production') {
        const cdt = require('mobx-react-devtools').configureDevtool;
        cdt(options);
    }
}
