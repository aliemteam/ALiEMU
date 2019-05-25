import { addQueryArgs } from '@wordpress/url';

interface Success<T> {
    success: true;
    data: T;
}

interface Error {
    success: false;
    data: {
        code: string | number;
        message: string;
    };
}

type Response<T> = Success<T> | Error;

declare const AU_AJAX_NONCE: string;

export default async function ajax<T>(
    action: string,
    data: Record<string, string | number | boolean>,
): Promise<Response<T>> {
    const response = await fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: addQueryArgs(undefined, {
            ...data,
            _ajax_nonce: AU_AJAX_NONCE,
            action,
        }).slice(1),
    });
    if (!response.ok) {
        return {
            success: false,
            data: {
                code: response.status,
                message: response.statusText,
            },
        };
    }
    return response.json();
}
