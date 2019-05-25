import * as api from './_internal';

const ENDPOINT = '/wp-json/aliemu/v1/courses';

type CourseBase = WordPress.BasePost & WordPress.Supports.PageAttributes;

export interface Course extends CourseBase {
    description: string;
    hours: number;
}

export async function fetchOne(
    id: number,
    params?: api.Params,
): Promise<Course> {
    return api.GET(`${ENDPOINT}/${id}`, params);
}

export async function fetchMany(
    params: api.Params = {},
    collection: Course[] = [],
): Promise<Course[]> {
    return api.fetchMany(ENDPOINT, params, collection);
}
