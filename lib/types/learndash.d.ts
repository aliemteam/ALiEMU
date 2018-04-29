// tslint:disable: no-namespace
declare namespace LearnDash {
    type CourseBase = WordPress.BasePost & WordPress.Supports.PageAttributes;
    interface Course extends CourseBase {
        certificate: string;
        course_disable_content_table: string;
        course_disable_lesson_progression: 'on' | 'off';
        course_materials: string;
        course_points: string;
        course_points_access: string;
        course_points_enabled: string;
        course_prerequisite: number[];
        course_prerequisite_compare: string;
        course_prerequisite_enabled: 'on' | 'off';
        course_price: string;
        course_price_type: string;
        expire_access: string;
        expire_access_days: string;
        expire_access_delete_progress: string;

        // ALiEMU custom fields
        course_short_description: string;
        recommendedHours: string;
    }
}
