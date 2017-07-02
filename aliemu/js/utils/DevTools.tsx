// tslint:disable:no-typeof-undefined
import DevTool from 'mobx-react-devtools';
import * as React from 'react';
declare const __DEV__;

export default function devtool(props): JSX.Element | null {
    if (typeof __DEV__ !== 'undefined') {
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
    if (typeof __DEV__ !== 'undefined') {
        const cdt = require('mobx-react-devtools').configureDevtool;
        cdt(options);
    }
}
