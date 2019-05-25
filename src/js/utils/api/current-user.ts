import * as api from './_internal';
import { Coach } from './coaches';
import { Learner } from './learners';

export type User = Learner & Coach;
const endpoint = '/wp-json/wp/v2/users/me';

export async function update(fields: Partial<User>): Promise<User> {
    return api.POST(endpoint, fields);
}
