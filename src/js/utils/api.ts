// tslint:disable:await-promise
import { Coach, Course, Learner } from 'utils/types';

interface Params {
    [k: string]: string | number | boolean | string[] | number[];
}

type IComment = WordPress.Comment;
type IUser = WordPress.User<'edit'>;

export class Comments {
    // {{{
    private static endpoint = '/wp-json/wp/v2/comments';

    static async fetchOne(id: number, params?: Params): Promise<IComment> {
        return _get<IComment>(`${Comments.endpoint}/${id}`, params);
    }
    // }}}
}

export class Courses {
    // {{{
    private static endpoint = '/wp-json/aliemu/v1/courses';

    static async fetchOne(id: number, params?: Params): Promise<Course> {
        return _get<Course>(`${Courses.endpoint}/${id}`, params);
    }

    static async fetchMany(
        params: Params = {},
        startPage = 1,
        endPage = Infinity,
    ): Promise<Course[]> {
        return _getMany<Course>(Courses.endpoint, params, startPage, endPage);
    }
    // }}}
}

export class Groups {
    // {{{
    private static endpoint = '/wp-json/wp/v2/users/me/groups';

    static async fetchCoaches(params: Params = {}): Promise<Coach[]> {
        return _getMany<Coach>(`${Groups.endpoint}/coaches`, params);
    }

    static async addCoach(email: string): Promise<Coach> {
        return _post<Coach>(`${Groups.endpoint}/coaches`, { email });
    }

    static async removeCoach(id: number): Promise<void> {
        return _delete(`${Groups.endpoint}/coaches/${id}`);
    }

    static async fetchLearners(params: Params = {}): Promise<Learner[]> {
        return _getMany<Learner>(`${Groups.endpoint}/learners`, params);
    }

    static async removeLearner(id: number): Promise<void> {
        return _delete(`${Groups.endpoint}/learners/${id}`);
    }

    static async addLearnerTag(id: number, tag: string): Promise<string[]> {
        return _post<string[]>(`${Groups.endpoint}/learners/${id}/tags`, {
            tag,
        });
    }

    static async removeLearnerTag(id: number, tag: string): Promise<void> {
        return _delete(`${Groups.endpoint}/learners/${id}/tags`, { tag });
    }
    // }}}
}

export class Users {
    // {{{
    private static endpoint = '/wp-json/wp/v2/users';

    static async update(
        fields: Partial<IUser> | FormData,
        id?: number,
    ): Promise<IUser> {
        return _post<IUser>(`${Users.endpoint}/${id ? id : 'me'}`, fields);
    }
    // }}}
}

async function _get<T>(endpoint: string, params?: Params): Promise<T> {
    // {{{
    const response: T = await jQuery.ajax(endpoint, {
        headers: {
            'X-WP-Nonce': window.AU_API.nonce,
        },
        dataType: 'json',
        data: params,
    });
    return response;
    // }}}
}

async function _post<T>(
    endpoint: string,
    params: object | FormData,
): Promise<T> {
    // {{{
    const response: T = await jQuery.ajax(endpoint, {
        method: 'POST',
        data: JSON.stringify(params),
        dataType: 'json',
        headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.AU_API.nonce,
        },
    });
    return response;
    // }}}
}

async function _delete(endpoint: string, params: object = {}): Promise<void> {
    // {{{
    const response = await jQuery.ajax(endpoint, {
        method: 'DELETE',
        data: JSON.stringify(params),
        dataType: 'json',
        headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.AU_API.nonce,
        },
    });
    return response;
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
    const request = jQuery.ajax(endpoint, {
        headers: {
            'X-WP-Nonce': window.AU_API.nonce,
        },
        dataType: 'json',
        data: params,
    });
    const response = await request;
    const pages = request.getResponseHeader('X-WP-TotalPages');
    if (!pages) {
        throw new Error(
            'X-WP-TotalPages header must be set to iterate entire collection.',
        );
    }
    const totalPages = parseInt(pages, 10);

    collection = [...collection, ...response];

    return page >= totalPages || page === endPage
        ? collection
        : _getMany(endpoint, params, page + 1, endPage, collection);
    // }}}
}

// vim: set fdm=marker:
