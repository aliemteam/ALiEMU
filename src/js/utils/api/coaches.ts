import * as api from './_internal';

const ENDPOINT = '/wp-json/wp/v2/users/me/groups/coaches';

export interface Coach extends WordPress.User<'view'> {
    email: string;
}

export async function fetch(params: api.Params = {}): Promise<Coach[]> {
    return api.fetchMany<Coach>(ENDPOINT, params, []);
}

export async function add(email: string): Promise<Coach> {
    return api.POST(ENDPOINT, { email });
}

export async function remove(id: number): Promise<void> {
    return api.DELETE(`${ENDPOINT}/${id}`);
}
