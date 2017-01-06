import { unix, Moment } from 'moment';

type Users = ALiEMU.EducatorDashboard.UserObject;
type Courses = ALiEMU.EducatorDashboard.CourseData;
type User = ALiEMU.EducatorDashboard.UserMeta;
type CourseMeta = ALiEMU.EducatorDashboard.CourseMetaObject;
type Categories = ALiEMU.EducatorDashboard.CategoryObject;

/**
 * Either immediately triggers a file download or saves a downloadable file blob
 *   to an HTML anchor element, depending on browser support for the "download"
 *   attribute.
 *
 * @param {string} filename The name of the file (with .csv as the suffix).
 * @param {Blob}   blob     A prepared file blob for download.
 * @param {BrowserType} browser The browser type.
 * @param {string} ElementID The HTML ID of the target element.
 * @return {void}
 */
export function downloadPolyfill(filename: string, blob: Blob, browser: ALiEMU.BrowserType, ElementID: string): void {
    switch (browser) {
        case 'chrome':
        case 'firefox':
        case 'edge':
            const a: HTMLAnchorElement = document.createElement('a');
            document.body.appendChild(a);
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
            document.body.removeChild(a);
            break;
        case 'ie':
            window.navigator.msSaveBlob(blob, filename);
            break;
        default:
            const target = document.getElementById(ElementID);
            target.setAttribute('href', URL.createObjectURL(blob));
            target.setAttribute('download', filename);
            alert('Right click the button and select "save target as" to download CSV file.');
    }
}

/**
 * Retrieves the category for a given courseID
 * @param {string} courseID       The courseID.
 * @param {Categories} categories The entire CategoryObject.
 * @return {string}  The category.
 */
export function getCourseCategory(courseID: string, categories: Categories): string {
    let category: string;
    Object.keys(categories).some(key => {
        if (categories[key].hasOwnProperty(courseID)) {
            category = key;
            return true;
        }
    });
    return category;
}

/**
 * Returns either a formatted date or 'X' based on whether or not the date string
 *   is defined.
 *
 * @param date  The date string (or undefined).
 * @param hours The associated hours for the course.
 * @return The parsed date and hours string or X","X. (format allows array join)
 */
export function parseCompletionData(date: number|undefined, hours?: string): string {
    if (!hours) {
        if (date === undefined) {
            return `X`;
        }
        return unix(date).calendar();
    }

    if (date === undefined) {
        return `X","0`;
    }
    return `${unix(date).calendar()}","${hours}`;
}

/**
 * Calculates a given user's III hours based on the recommended hours for the course.
 *
 * @param  {User} user A given user's metadata object.
 * @param  {CourseMeta} courseMeta The complete CourseMetaObject.
 * @return {number} The user's calculated III hours.
 */
export function calculateIIIHours(
    user: User,
    courseMeta: CourseMeta,
    dateRange: {start: Moment, end: Moment},
): number {
    if (!user.courseCompleted) return 0;
    return Object.keys(user.courseCompleted).reduce((prev, curr) => {
        const { start, end } = dateRange;
        const d = unix(user.courseCompleted[curr]);
        const addedHours: number = parseInt(courseMeta[curr].recommendedHours, 10) + prev;
        switch (true) {
            case !start && !end:
                return addedHours;
            case !start && end !== null:
                if (d.isBefore(end) || d.isSame(end)) return addedHours;
                return prev;
            case start !== null && !end:
                if (d.isAfter(start) || d.isSame(start)) return addedHours;
                return prev;
            default:
                const isBetween = d.isBetween(start, end);
                const isSame = d.isSame(start) || d.isSame(end);
                if (isBetween || isSame) return addedHours;
                return prev;
        }
    }, 0);
}

/* TODO: document this */
export class CSV {

    private users: Users;
    private courses: ALiEMU.EducatorDashboard.CourseObject;
    private courseData: ALiEMU.EducatorDashboard.CourseData;
    private courseMeta: ALiEMU.EducatorDashboard.CourseMetaObject;
    private categories: ALiEMU.EducatorDashboard.CategoryObject;
    private lessons;

    constructor(users: Users, courses: Courses) {
        this.users = users;
        this.courses = courses.courses;
        this.courseData = courses;
        this.courseMeta = courses.courseMeta;
        this.categories = courses.categories;
        this.lessons = courses.lessons;
    }

    allUsers(dateRange: ALiEMU.EducatorDashboard.DateRange): ALiEMU.CSV {
        const filename = 'ALiEMU_Program_Export.csv';
        let data = [
            'Last Name',
            'First Name',
            'Class of',
            'Total III Hours Awarded',
            'Courses In Progress',
            'Courses Completed',
        ]
        .map(i => `"${i}"`)
        .join(',') + '\n';

        Object.keys(this.users).forEach((uid: string) => {
            const inProgress: number = this.users[uid].courseProgress
                ? Object.keys(this.users[uid].courseProgress).length
                : 0;

            const completed: number = this.users[uid].courseCompleted
                ? Object.keys(this.users[uid].courseCompleted).length
                : 0;
            data += [
                this.users[uid].lastName,
                this.users[uid].firstName,
                this.users[uid].auGraduationYear || '',
                calculateIIIHours(this.users[uid], this.courseMeta, dateRange),
                inProgress - completed,
                completed,
            ]
            .map(i => `"${i}"`)
            .join(',') + '\n';
        });
        return { filename, data };
    }

    user(userID: string): ALiEMU.CSV|boolean {

        const courseProgress = this.users[userID].courseProgress;
        const { courses, courseMeta, categories } = this.courseData;

        if (!courseProgress) return false;

        const filename = `${this.users[userID].displayName.replace(/\s/, '_')}.csv`;
        let data: string = [
            'Registered Courses',
            'Steps Completed',
            'Date Completed',
            'Associated III Credit Hours',
            'Category',
        ]
        .map(i => `"${i}"`)
        .join(',') + '\n';

        for (const key of Object.keys(courseProgress)) {
            data += [
                courses[key].postTitle,
                `${courseProgress[key].completed} out of ${courseProgress[key].total}`,
                parseCompletionData(
                    this.users[userID].courseCompleted[key],
                    courseMeta[key].recommendedHours,
                ),
                getCourseCategory(key, categories),
            ]
            .map(i => `"${i}"`)
            .join(',') + '\n';
        }
        return { filename, data };
    }

    course(courseID: string): ALiEMU.CSV {
        const filename = `${this.courses[courseID].postTitle.replace(/\s/, '_')}.csv`;
        const lessonIDs = [];

        let data: string = [
            'Last Name',
            'First Name',
            'Course Completed',
            ...this.courses[courseID].lessons
                .filter((lessonID: string) => this.lessons[lessonID] !== undefined)
                .map((lessonID: string) => {
                    lessonIDs.push(lessonID);
                    return `Lesson: ${this.lessons[lessonID].postTitle}`;
                }),
        ]
        .map(i => `"${i}"`)
        .join(',') + '\n';

        Object.keys(this.users).forEach((userID: string) => {
            const completionData = this.users[userID].courseCompleted
                ? parseCompletionData(this.users[userID].courseCompleted[courseID])
                : 'X';
            data += [
                this.users[userID].lastName,
                this.users[userID].firstName,
                completionData,
                ...lessonIDs.map((lessonID: string) => {
                    try {
                        const completed = this.users[userID].courseProgress[courseID].lessons[lessonID];
                        if (completed === 1) {
                            return 'Completed';
                        }
                        return 'X';
                    } catch (e) {
                        return 'X';
                    }
                }),
            ]
            .map(i => `"${i}"`)
            .join(',') + '\n';
        });
        return { filename, data };
    }
}
