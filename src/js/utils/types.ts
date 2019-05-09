export interface Coach extends WordPress.User<'view'> {
    email: string;
}

export interface Learner extends WordPress.User<'edit'> {
    learner_tags: string[];
}

type CourseBase = WordPress.BasePost & WordPress.Supports.PageAttributes;
export interface Course extends CourseBase {
    description: string;
    hours: number;
}
