import * as api from './_internal';

const ENDPOINT = '/wp-json/wp/v2/users/me/groups/learners';

export async function add(id: number, tag: string): Promise<string[]> {
    return api.POST(`${ENDPOINT}/${id}/tags`, {
        tag,
    });
}

export async function remove(id: number, tag: string): Promise<string[]> {
    return api.DELETE(`${ENDPOINT}/${id}/tags`, { tag });
}
