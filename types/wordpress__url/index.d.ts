// Type definitions for @wordpress/url
// Project: https://github.com/WordPress/gutenberg/tree/master/packages/url
// Definitions by: Derek P Sifford <https://github.com/dsifford>

interface InputArgsObject {
    [key: string]: InputArgsValue;
}
interface OutputArgObject {
    [key: string]: OutputArg;
}

interface InputArgsArray extends Array<InputArgsValue> {}
interface OutputArgArray extends Array<OutputArg> {}

type InputArgsValue =
    | string
    | number
    | boolean
    | InputArgsObject
    | InputArgsArray
    | null
    | undefined;

type InputArgs = InputArgsObject;
type OutputArg = string | OutputArgObject | OutputArgArray;

export function addQueryArgs(url?: string, args?: InputArgs): string;
export function filterURLForDisplay(url: string): string;
export function getAuthority(url: string): string | undefined;
export function getFragment(url: string): string | undefined;
export function getPath(url: string): string | undefined;
export function getProtocol(url: string): string | undefined;
export function getQueryArg(url: string, arg: string): OutputArg | undefined;
export function getQueryString(url: string): string | undefined;
export function hasQueryArg(url: string, arg: string): boolean;
export function isURL(url: string): boolean;
export function isValidAuthority(url: string): boolean;
export function isValidFragment(frag: string): boolean;
export function isValidPath(path: string): boolean;
export function isValidProtocol(proto: string): boolean;
export function isValidQueryString(query: string): boolean;
export function prependHTTP(url: string): string;
export function removeQueryArgs(url: string, ...args: string[]): string;
export function safeDecodeURI(uri: string): string;
