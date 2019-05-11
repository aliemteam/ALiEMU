interface AjaxSuccess<T> {
    success: true;
    data: T;
}

interface AjaxError {
    success: false;
    data: {
        code: string;
        message: string;
    };
}

type AjaxResponse<T> = AjaxSuccess<T> | AjaxError;

const { AU_AJAX } = window;

export async function wpAjax<T>(
    action: string,
    data: { [k: string]: Scalar },
): Promise<AjaxResponse<T>> {
    const { nonce, url } = AU_AJAX;
    let response: AjaxResponse<T>;
    try {
        response = await jQuery.post(url, {
            _ajax_nonce: nonce,
            action,
            ...data,
        });
    } catch (_e) {
        response = {
            success: false,
            data: {
                code: 'http_error',
                message:
                    'An unexpected error occurred while handling your request. Please try again later.',
            },
        };
    }
    return response;
}
