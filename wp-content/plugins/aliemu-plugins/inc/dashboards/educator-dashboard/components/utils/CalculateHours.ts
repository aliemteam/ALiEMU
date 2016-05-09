
type User = ALiEMU.EducatorDashboard.UserMeta;
type CourseMeta = ALiEMU.EducatorDashboard.CourseMetaObject;

/**
 * Calculates a given user's III hours based on the recommended hours for the course.
 *
 * @param  {User} user A given user's metadata object.
 * @param  {CourseMeta} courseMeta The complete CourseMetaObject.
 * @return {number} The user's calculated III hours.
 */
export default function calculateHours(user: User, courseMeta: CourseMeta): number {
    return Object.keys(user.courseCompleted).reduce((prev, curr) => {
        let val = courseMeta[curr].recommendedHours;
        return val + prev;
    }, 0);
}
