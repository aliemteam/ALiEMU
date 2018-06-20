import { ICoach, ICourse, ILearner } from 'utils/types';

interface Params {
    [k: string]: string | number | boolean | string[] | number[];
}

type IComment = WordPress.Comment;
type IUser = WordPress.User<'edit'>;

export class Comments {
    // {{{
    private static endpoint = '/wp-json/wp/v2/comments';

    static async fetchOne(id: number, params?: Params): Promise<IComment> {
        return _get(`${Comments.endpoint}/${id}`, params).then(data =>
            data.json(),
        );
    }
    // }}}
}

export class Courses {
    // {{{
    private static endpoint = '/wp-json/aliemu/v1/courses';

    static async fetchOne(id: number, params?: Params): Promise<ICourse> {
        return _get(`${Courses.endpoint}/${id}`, params).then(res =>
            res.json(),
        );
    }

    static async fetchMany(
        params: Params = {},
        startPage = 1,
        endPage = Infinity,
    ): Promise<ICourse[]> {
        return _getMany<ICourse>(Courses.endpoint, params, startPage, endPage);
    }
    // }}}
}

export class Groups {
    // {{{
    private static endpoint = '/wp-json/wp/v2/users/me/groups';

    static async fetchCoaches(params: Params = {}): Promise<ICoach[]> {
        return _getMany<ICoach>(`${Groups.endpoint}/coaches`, params);
    }

    static async addCoach(email: string): Promise<ICoach> {
        return _post<ICoach>(`${Groups.endpoint}/coaches`, { email });
    }

    static async removeCoach(id: number): Promise<Response> {
        return _delete(`${Groups.endpoint}/coaches/${id}`);
    }

    static async fetchLearners(params: Params = {}): Promise<ILearner[]> {
        return _getMany<ILearner>(`${Groups.endpoint}/learners`, params);
    }

    static async removeLearner(id: number): Promise<Response> {
        return _delete(`${Groups.endpoint}/learners/${id}`);
    }

    static async addLearnerTag(id: number, tag: string): Promise<string[]> {
        return _post<string[]>(`${Groups.endpoint}/learners/${id}/tags`, {
            tag,
        });
    }

    static async removeLearnerTag(id: number, tag: string): Promise<Response> {
        return _delete(`${Groups.endpoint}/learners/${id}/tags`, { tag });
    }
    // }}}
}

export class Users {
    // {{{
    private static endpoint = '/wp-json/wp/v2/users';

    static async update(fields: Partial<IUser> | FormData, id?: number): Promise<IUser> {
        return _post<IUser>(`${Users.endpoint}/${id ? id : 'me'}`, fields);
    }
    // }}}
}

function _get(endpoint: string, params?: Params): Promise<Response> {
    // {{{
    if (params) {
        endpoint = endpoint + parseParams(params);
    }
    return fetch(endpoint, {
        headers: {
            'X-WP-Nonce': window.AU_API.nonce,
        },
        mode: 'same-origin',
    });
    // }}}
}

function _post<T>(endpoint: string, params: object | FormData): Promise<T> {
    // {{{
    return fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.AU_API.nonce,
        },
        body: JSON.stringify(params),
        mode: 'same-origin',
    }).then(data => data.json());
    // }}}
}

function _delete(endpoint: string, params: object = {}): Promise<Response> {
    // {{{
    return fetch(endpoint, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.AU_API.nonce,
        },
        body: JSON.stringify(params),
        mode: 'same-origin',
    });
    // }}}
}

function parseParams(params: Params): string {
    // {{{
    return (
        '?' +
        [...Object.entries(params)]
            .reduce(
                (arr, [key, val]) => [
                    ...arr,
                    `${key}=${
                        Array.isArray(val)
                            ? encodeURIComponent(val.join(','))
                            : val
                    }`,
                ],
                <string[]>[],
            )
            .join('&')
    );
    // }}}
}

async function _getMany<T>(
    endpoint: string,
    params: Params = {},
    page: number = 1,
    endPage = Infinity,
    collection: T[] = [],
): Promise<T[]> {
    // {{{
    params = {
        ...params,
        page,
    };
    const response = await _get(endpoint, params);

    if (!response.headers.has('X-WP-TotalPages')) {
        throw new Error(
            'X-WP-TotalPages header must be set to iterate entire collection.',
        );
    }
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages')!, 10);

    collection = [...collection, ...(await response.json())];

    return page >= totalPages || page === endPage
        ? collection
        : _getMany(endpoint, params, page + 1, endPage, collection);
    // }}}
}

// vim: set fdm=marker:
