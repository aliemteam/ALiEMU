// tslint:disable no-namespace
declare namespace ALiEMU {

    type BrowserType = 'edge'|'safari'|'ie'|'opera'|'chrome'|'firefox';

    interface CSV {
        data: string;
        filename: string;
    }

    namespace LearnDash {

        // Date below in the following form: `YYYY-MM-DD HH:MM:SS`
        interface Courses {
            ID: number;
            lessons: string[];
            postAuthor: number;
            postDate: string;
            postModified: string;
            postTitle: string;
        }

        interface Lessons {
            ID: number;
            menuOrder: number;
            postAuthor: number;
            postDate: string;
            postModified: string;
            postTitle: string;
        }

        /**
         * Lessons can either be an object who's keys are completed lesson IDs or, if
         * no lessons are completed, an empty array.
         */
        interface CourseProgress {
            completed: number;
            lessons: number[] | {
                [lessonID: number]: number;
            };
            topics: {
                [lessonID: number]: {
                    [topicID: number]: number;
                };
            };
            total: number;
        }

        interface Quiz {
            count: number;
            pass: number;
            percentage: string;
            'pro_quizid': string;
            quiz: string;
            rank: string;
            score: string;
            time: number;
            timespent: string;
            'total_points': string;
        }

    }
}
