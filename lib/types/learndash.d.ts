// tslint:disable: no-namespace
declare namespace LearnDash {
    type CourseBase = WordPress.BasePost & WordPress.Supports.PageAttributes;
    interface Course extends CourseBase {
        description: string;
        hours: number;
    }
}
