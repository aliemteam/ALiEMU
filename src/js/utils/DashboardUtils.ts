// temporary until this file can be scrutinized further
// tslint:disable:no-unnecessary-type-assertion

import { Moment, unix } from 'moment';

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
export function downloadPolyfill(
    filename: string,
    blob: Blob,
    browser: ALiEMU.BrowserType,
    ElementID: string
): void {
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
            if (!target) {
                return;
            }
            target.setAttribute('href', URL.createObjectURL(blob));
            target.setAttribute('download', filename);
            alert(
                'Right click the button and select "save target as" to download CSV file.'
            );
    }
}

/**
 * Retrieves the category for a given courseID
 * @param {string} courseID       The courseID.
 * @param {Categories} categories The entire CategoryObject.
 * @return {string}  The category.
 */
export function getCourseCategory(
    courseID: string,
    categories: Categories
): string | undefined {
    let category: string | undefined;
    Object.keys(categories).some(key => {
        if (categories[key].hasOwnProperty(courseID)) {
            category = key;
            return true;
        }
        return false;
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
export function parseCompletionData(
    date: number | undefined,
    hours?: string
): string {
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
    dateRange: { start: Moment | null; end: Moment | null }
): number {
    if (!user.courseCompleted) {
        return 0;
    }
    return Object.keys(user.courseCompleted).reduce((prev, curr) => {
        const { start, end } = dateRange;
        const completionDate = (<any>user.courseCompleted)![curr];
        const d = unix(completionDate);
        const addedHours: number =
            parseFloat((<any>courseMeta)[curr].recommendedHours) + prev;
        switch (true) {
            case !start && !end:
                return addedHours;
            case !start && end !== null:
                if (d.isBefore(end!) || d.isSame(end!)) {
                    return addedHours;
                }
                return prev;
            case start !== null && !end:
                if (d.isAfter(start!) || d.isSame(start!)) {
                    return addedHours;
                }
                return prev;
            default:
                const isBetween = d.isBetween(start!, end!);
                const isSame = d.isSame(start!) || d.isSame(end!);
                if (isBetween || isSame) {
                    return addedHours;
                }
                return prev;
        }
    }, 0);
}

export class CSV {
    private users: Users;
    private courses: ALiEMU.EducatorDashboard.CourseObject;
    private courseData: ALiEMU.EducatorDashboard.CourseData;
    private courseMeta: ALiEMU.EducatorDashboard.CourseMetaObject;
    private lessons: ALiEMU.EducatorDashboard.Lessons;

    constructor(users: Users, courses: Courses) {
        this.users = users;
        this.courses = courses.courses;
        this.courseData = courses;
        this.courseMeta = courses.courseMeta;
        this.lessons = courses.lessons;
    }

    allUsers(dateRange: ALiEMU.EducatorDashboard.DateRange): ALiEMU.CSV {
        const filename = 'ALiEMU_Program_Export.csv';
        let data =
            [
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
            const id = parseInt(uid, 10);
            const inProgress: number = this.users[id].courseProgress
                ? Object.keys(this.users[id].courseProgress!).length
                : 0;

            const completed: number = this.users[id].courseCompleted
                ? Object.keys(this.users[id].courseCompleted!).length
                : 0;
            data +=
                [
                    this.users[id].lastName,
                    this.users[id].firstName,
                    this.users[id].auGraduationYear || '',
                    calculateIIIHours(
                        this.users[id],
                        this.courseMeta,
                        dateRange
                    ),
                    inProgress - completed,
                    completed,
                ]
                    .map(i => `"${i}"`)
                    .join(',') + '\n';
        });
        return { filename, data };
    }

    user(userID: string): ALiEMU.CSV | boolean {
        const id = parseInt(userID, 10);
        const courseProgress = this.users[id].courseProgress;
        const { courses, courseMeta, categories } = this.courseData;

        if (!courseProgress) {
            return false;
        }

        const filename = `${this.users[id].displayName.replace(/\s/, '_')}.csv`;
        let data: string =
            [
                'Registered Courses',
                'Steps Completed',
                'Date Completed',
                'Associated III Credit Hours',
                'Category',
            ]
                .map(i => `"${i}"`)
                .join(',') + '\n';

        for (const key of Object.keys(courseProgress)) {
            const k = parseInt(key, 10);
            data +=
                [
                    courses[k].postTitle,
                    `${courseProgress[k].completed} out of ${
                        courseProgress[k].total
                    }`,
                    parseCompletionData(
                        (<any>this.users[id]).courseCompleted![k],
                        (<any>courseMeta[k]).recommendedHours
                    ),
                    getCourseCategory(key, categories),
                ]
                    .map(i => `"${i}"`)
                    .join(',') + '\n';
        }
        return { filename, data };
    }

    course(courseID: string): ALiEMU.CSV {
        const id = parseInt(courseID, 10);
        const filename = `${this.courses[id].postTitle.replace(/\s/, '_')}.csv`;
        const lessonIDs: string[] = [];

        let data: string =
            [
                'Last Name',
                'First Name',
                'Course Completed',
                ...this.courses[id].lessons
                    .filter(
                        (lessonID: string) =>
                            this.lessons[parseInt(lessonID, 10)] !== undefined
                    )
                    .map((lessonID: string) => {
                        lessonIDs.push(lessonID);
                        return `Lesson: ${
                            this.lessons[parseInt(lessonID, 10)].postTitle
                        }`;
                    }),
            ]
                .map(i => `"${i}"`)
                .join(',') + '\n';

        Object.keys(this.users).forEach((userID: string) => {
            const uid = parseInt(userID, 10);
            const completionData = this.users[uid].courseCompleted
                ? parseCompletionData(
                      (<any>this.users[uid]).courseCompleted![courseID]
                  )
                : 'X';
            data +=
                [
                    this.users[uid].lastName,
                    this.users[uid].firstName,
                    completionData,
                    ...lessonIDs.map((lessonID: string) => {
                        try {
                            const completed = this.users[uid].courseProgress![
                                id
                            ].lessons[parseInt(lessonID, 10)];
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
