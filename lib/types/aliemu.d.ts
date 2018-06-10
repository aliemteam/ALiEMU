// tslint:disable no-namespace
declare namespace ALiEMU {
    type CoachOfUser = WordPress.User<'view'> & { email: string };
    type LearnerOfUser = WordPress.User<'edit'>;

    interface Groups {
        coaches: number[];
        learners: number[];
        _links: WordPress.API.Links;
        _embedded?: {
            coaches?: [CoachOfUser[]];
            learners?: [LearnerOfUser[]];
        };
    }

    interface Course
        extends WordPress.BasePost,
            WordPress.Supports.PageAttributes {
        description: string;
        hours: number;
    }

    // DEPRECATED {{{

    /** @deprecated */
    type BrowserType =
        | 'edge'
        | 'safari'
        | 'ie'
        | 'opera'
        | 'chrome'
        | 'firefox';

    /** @deprecated */
    interface CSV {
        data: string;
        filename: string;
    }

    /** @deprecated */
    namespace EducatorDashboard {
        interface DateRange {
            start: any;
            end: any;
        }

        interface EducatorData {
            courseData: CourseData;
            currentUser: {
                ID: number;
                meta: UserMeta;
            };
            users: UserObject;
        }

        interface UserObject {
            [userID: number]: UserMeta;
        }

        interface Lessons {
            [i: number]: LearnDash.Lessons;
        }

        interface CourseData {
            categories: CategoryObject;
            courseMeta: CourseMetaObject;
            courses: CourseObject;
            lessons: Lessons;
        }

        interface CategoryObject {
            [categoryName: string]: {
                [courseOrLessonID: number]: number;
            };
        }

        interface CourseObject {
            [courseID: number]: LearnDash.Courses;
        }

        interface CourseMetaObject {
            [courseID: number]: CourseMeta;
        }

        interface CourseMeta {
            accessList: string;
            certificate: string;
            customButtonUrl: string;
            disableLessonProgression: string;
            expireAccessDays: string;
            lessonOrder: 'ASC' | 'DSC';
            lessonOrderBy: string;
            materials: string;
            prerequisite: string;
            price: string;
            priceType: string;
            recommendedHours: number;
            shortDescription: string;
        }

        interface UserMeta {
            ID: number;
            accountStatus: string;
            auGraduationYear?: number;
            badgeosAchievements?: any;
            badgeosActiveAchievements?: any;
            badgeosPoints?: number;
            completed?: string;
            country?: string;
            courseAccessed:
                | {
                      [courseID: number]: number;
                  }
                | number[];
            courseCompleted?:
                | {
                      [courseID: string]: number;
                  }
                | number[];
            courseProgress?: {
                [courseID: number]: LearnDash.CourseProgress;
            };
            description: string;
            displayName: string;
            emFacultyRole?: string;
            emResident?: boolean;
            email: string;
            firstName: string;
            lastActivity?: string;
            lastName: string;
            medicineExperiencelevel?: string;
            nursingExperiencelevel?: string;
            profilePhoto?: string;
            quizzes?: LearnDash.Quiz[];
            residencyUsEm?: string;
            registerDate: string;
            role: string;
            twitter?: string;
            umLastLogin: number;
            userAgreement?: boolean;
            userDiscipline?: string;
            userUsState?: string;
            username: string;
        }
    }

    /** @deprecated */
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
            lessons:
                | number[]
                | {
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
            pro_quizid: string;
            quiz: string;
            rank: string;
            score: string;
            time: number;
            timespent: string;
            total_points: string;
        }
    }

    // }}}
}
// vim: set fdm=marker:
