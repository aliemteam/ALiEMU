import { addQueryArgs, InputArgs } from '@wordpress/url';

declare const AU_API_NONCE: string;

export type Params = InputArgs;

const fetchInit: Readonly<RequestInit> = {
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': AU_API_NONCE,
    },
};

export async function GET<T>(endpoint: string, params?: Params): Promise<T> {
    const response = await fetch(addQueryArgs(endpoint, params), {
        ...fetchInit,
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.json();
}

export async function POST<T>(endpoint: string, params: object): Promise<T> {
    const response = await fetch(endpoint, {
        ...fetchInit,
        method: 'POST',
        body: JSON.stringify(params),
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.json();
}

export async function DELETE<T>(endpoint: string, params?: object): Promise<T> {
    const response = await fetch(endpoint, {
        ...fetchInit,
        method: 'DELETE',
        body: params ? JSON.stringify(params) : '',
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response.bodyUsed ? response.json() : undefined;
}

export async function fetchMany<T>(
    endpoint: string,
    params: Params,
    collection: T[],
): Promise<T[]> {
    const response = await fetch(
        addQueryArgs(endpoint, { ...params, offset: collection.length }),
        { ...fetchInit },
    );
    const totalLength = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    collection = [...collection, ...(await response.json())];
    return collection.length >= totalLength
        ? collection
        : fetchMany(endpoint, params, collection);
}
