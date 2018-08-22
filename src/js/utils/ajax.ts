interface AjaxData {
    [k: string]: string | number | boolean;
}

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

export async function wpAjax<T = any>(
    action: string,
    nonce: string,
    data: AjaxData,
): Promise<T> {
    // tslint:disable-next-line:await-promise
    const response: AjaxResponse<T> = await jQuery.post(window.ajaxurl, {
        action,
        _ajax_nonce: nonce,
        ...data,
    });
    if (!response.success) {
        throw response.data;
    }
    return response.data;
}
