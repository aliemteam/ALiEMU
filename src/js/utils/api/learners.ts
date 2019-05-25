import * as api from './_internal';

const ENDPOINT = '/wp-json/wp/v2/users/me/groups/learners';

export interface Learner extends WordPress.User<'edit'> {
    learner_tags: string[];
}

export async function fetch(params: api.Params = {}): Promise<Learner[]> {
    return api.fetchMany<Learner>(ENDPOINT, params, []);
}

export async function remove(id: number): Promise<void> {
    return api.DELETE(`${ENDPOINT}/${id}`);
}
