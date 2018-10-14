export interface ICoach extends WordPress.User<'view'> {
    email: string;
}

export interface ILearner extends WordPress.User<'edit'> {
    learner_tags: string[];
}

type CourseBase = WordPress.BasePost & WordPress.Supports.PageAttributes;
export interface ICourse extends CourseBase {
    description: string;
    hours: number;
}
