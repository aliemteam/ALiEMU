import * as Moment from 'moment';

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
export const downloadPolyfill = (filename: string, blob: Blob, browser: BrowserType, ElementID: string): void  => {
    switch (browser) {
        case 'chrome':
        case 'firefox':
        case 'edge':
            let a: HTMLAnchorElement = document.createElement('a');
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
            let target = document.getElementById(ElementID);
            target.setAttribute('href', URL.createObjectURL(blob));
            target.setAttribute('download', filename);
            alert('Right click the button and select "save target as" to download CSV file.');
    }
};


/**
 * Retrieves the category for a given courseID
 * TODO: still need to test this
 * @param {string} courseID       The courseID.
 * @param {Categories} categories The entire CategoryObject.
 * @return {string}  The category.
 */
export const getCourseCategory = (courseID: string, categories: Categories): string => {
    let category: string;
    Object.keys(categories).some(key => {
        if (categories[key].hasOwnProperty(courseID)) {
            category = key;
            return true;
        }
    });
    return category;
};


/**
 * Returns either a formatted date or 'X' based on whether or not the date string
 *   is defined.
 *
 * @param {number|undefined} date  The date string (or undefined).
 * @return {string} The parsed date string or 'X'.
 */
export const parseCompletionDate = (date: number|undefined): string => {
    if (typeof date === 'undefined') {
        return 'X';
    }
    return new Date(
        date * 1000
    ).toLocaleDateString();
};


/**
 * Calculates a given user's III hours based on the recommended hours for the course.
 *
 * @param  {User} user A given user's metadata object.
 * @param  {CourseMeta} courseMeta The complete CourseMetaObject.
 * @return {number} The user's calculated III hours.
 */
export const calculateIIIHours = (user: User, courseMeta: CourseMeta, dateRange: {start: moment.Moment, end: moment.Moment}): number => {
    return Object.keys(user.courseCompleted).reduce((prev, curr) => {
        const { start, end } = dateRange;
        const d = Moment.unix(user.courseCompleted[curr]);
        const addedHours: number = courseMeta[curr].recommendedHours + prev;
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
                let isBetween = d.isBetween(start, end);
                let isSame = d.isSame(start) || d.isSame(end);
                if (isBetween || isSame) return addedHours;
                return prev;
        }
    }, 0);
};
