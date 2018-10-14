/**
 * Takes a string containing escaped unicode characters as input and returns a
 * string with displayed unicode characters
 */
export const displayUnicode = (str: string): string =>
    str.replace(/&#(\d+);/g, (_match, code) =>
        String.fromCharCode(parseInt(code, 10)),
    );

/**
 * Takes a string and count as input and returns a pluralized string as output
 * (if count is plural)
 */
export const pluralize = (word: string, count: string | number): string => {
    const n: number = typeof count === 'number' ? count : parseInt(count, 10);
    return `${isNaN(n) ? 0 : n} ${n === 1 ? word : `${word}s`}`;
};
