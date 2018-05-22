import DevTool from 'mobx-react-devtools';
import * as React from 'react';

export default (): JSX.Element | null => {
    if (process.env.NODE_ENV !== 'production') {
        return <DevTool position={{ bottom: 0, right: 0 }} />;
    }
    return null;
};

interface ConfigureOptions {
    logEnabled?: boolean;
    updatesEnabled?: boolean;
    graphEnabled?: boolean;
    logFilter?: (p: any) => boolean;
}

export const configureDevtool = (options: ConfigureOptions): void => {
    if (process.env.NODE_ENV !== 'production') {
        const cdt = require('mobx-react-devtools').configureDevtool;
        cdt(options);
    }
};
