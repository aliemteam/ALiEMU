import * as api from './_internal';

const ENDPOINT = '/wp-json/wp/v2/comments';

export type Comment = WordPress.Comment;

export async function fetchOne(
    id: number,
    params?: api.Params,
): Promise<Comment> {
    return api.GET(`${ENDPOINT}/${id}`, params);
}
