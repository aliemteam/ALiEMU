/**
 * Small polyfill / helper for extracting URL search params as a Map.
 */
export function mapUrlParams(): Map<string, string> {
    const searchParams = window.location.search;
    if ('URLSearchParams' in window) {
        return new Map([...new URLSearchParams(searchParams).entries()]);
    } else {
        return new Map(
            searchParams
                .substring(1)
                .split('&')
                .map(
                    (item): [string, string] => {
                        const [key, val] = item.split('=');
                        return [
                            key,
                            decodeURIComponent(val).replace(/\+/g, ' '),
                        ];
                    },
                ),
        );
    }
}
