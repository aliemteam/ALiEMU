import { useState } from '@wordpress/element';
import {
    addQueryArgs,
    getQueryArg,
    OutputArg,
    removeQueryArgs,
} from '@wordpress/url';

export default function useQueryParam<T extends OutputArg>(
    key: string,
    defaultValue: T,
): readonly [T, (v?: T) => void] {
    const [queryParam, setQueryParam] = useState<T>(
        (getQueryArg(location.href, key) as T) || defaultValue,
    );
    return [
        queryParam,
        (value?: T) => {
            if (value) {
                history.replaceState(
                    {},
                    '',
                    addQueryArgs(location.href, { [key]: value }),
                );
                setQueryParam(value);
            } else {
                history.replaceState(
                    {},
                    '',
                    removeQueryArgs(location.href, key),
                );
                setQueryParam(defaultValue);
            }
        },
    ];
}
