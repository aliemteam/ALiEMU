
export const categories: ALiEMU.EducatorDashboard.CategoryObject = {
    AIR: {
        100: 100,
        200: 200,
        300: 300,
        400: 400,
    },
    CAPSULES: {
        500: 500,
        600: 600,
        700: 700,
        800: 800,
    },
};

export const courses: ALiEMU.EducatorDashboard.CourseObject = {
    100: {
        ID: 100,
        lessons: ['110', '120', '130', '140'],
        postAuthor: 1,
        postDate: '2016-01-01 01:01:01',
        postModified: '2016-01-01 01:01:01',
        postTitle: 'Course 1',
    },
    200: {
        ID: 200,
        lessons: [],
        postAuthor: 2,
        postDate: '2016-02-02 02:02:02',
        postModified: '2016-02-02 02:02:02',
        postTitle: 'Course 2',
    },
    300: {
        ID: 300,
        lessons: ['310', '320', '330', '340'],
        postAuthor: 3,
        postDate: '2016-03-03 03:03:03',
        postModified: '2016-03-03 03:03:03',
        postTitle: 'Course 3',
    },
    400: {
        ID: 400,
        lessons: [],
        postAuthor: 4,
        postDate: '2016-04-04 04:04:04',
        postModified: '2016-04-04 04:04:04',
        postTitle: 'Course 4',
    },
    500: {
        ID: 500,
        lessons: [],
        postAuthor: 5,
        postDate: '2016-05-05 05:05:05',
        postModified: '2016-05-05 05:05:05',
        postTitle: 'Course 5',
    },
    600: {
        ID: 600,
        lessons: [],
        postAuthor: 6,
        postDate: '2016-06-06 06:06:06',
        postModified: '2016-06-06 06:06:06',
        postTitle: 'Course 6',
    },
    700: {
        ID: 700,
        lessons: [],
        postAuthor: 7,
        postDate: '2016-07-07 07:07:07',
        postModified: '2016-07-07 07:07:07',
        postTitle: 'Course 7',
    },
    800: {
        ID: 800,
        lessons: [],
        postAuthor: 8,
        postDate: '2016-08-08 08:08:08',
        postModified: '2016-08-08 08:08:08',
        postTitle: 'Course 8',
    },
};

export const courseMeta: ALiEMU.EducatorDashboard.CourseMetaObject = {
    100: {
        accessList: '',
        certificate: '',
        customButtonUrl: '',
        disableLessonProgression: '',
        expireAccessDays: '',
        lessonOrder: 'ASC',
        lessonOrderBy: '',
        materials: '',
        prerequisite: '',
        price: '',
        priceType: 'free',
        recommendedHours: 1,
        shortDescription: '',
    },
    200: {
        accessList: '',
        certificate: '',
        customButtonUrl: '',
        disableLessonProgression: '',
        expireAccessDays: '',
        lessonOrder: 'ASC',
        lessonOrderBy: '',
        materials: '',
        prerequisite: '',
        price: '',
        priceType: 'free',
        recommendedHours: 2,
        shortDescription: '',
    },
    300: {
        accessList: '',
        certificate: '',
        customButtonUrl: '',
        disableLessonProgression: '',
        expireAccessDays: '',
        lessonOrder: 'ASC',
        lessonOrderBy: '',
        materials: '',
        prerequisite: '',
        price: '',
        priceType: 'free',
        recommendedHours: 3,
        shortDescription: '',
    },
    400: {
        accessList: '',
        certificate: '',
        customButtonUrl: '',
        disableLessonProgression: '',
        expireAccessDays: '',
        lessonOrder: 'ASC',
        lessonOrderBy: '',
        materials: '',
        prerequisite: '',
        price: '',
        priceType: 'free',
        recommendedHours: 4,
        shortDescription: '',
    },
    500: {
        accessList: '',
        certificate: '',
        customButtonUrl: '',
        disableLessonProgression: '',
        expireAccessDays: '',
        lessonOrder: 'ASC',
        lessonOrderBy: '',
        materials: '',
        prerequisite: '',
        price: '',
        priceType: 'free',
        recommendedHours: 5,
        shortDescription: '',
    },
    600: {
        accessList: '',
        certificate: '',
        customButtonUrl: '',
        disableLessonProgression: '',
        expireAccessDays: '',
        lessonOrder: 'ASC',
        lessonOrderBy: '',
        materials: '',
        prerequisite: '',
        price: '',
        priceType: 'free',
        recommendedHours: 6,
        shortDescription: '',
    },
    700: {
        accessList: '',
        certificate: '',
        customButtonUrl: '',
        disableLessonProgression: '',
        expireAccessDays: '',
        lessonOrder: 'ASC',
        lessonOrderBy: '',
        materials: '',
        prerequisite: '',
        price: '',
        priceType: 'free',
        recommendedHours: 7,
        shortDescription: '',
    },
    800: {
        accessList: '',
        certificate: '',
        customButtonUrl: '',
        disableLessonProgression: '',
        expireAccessDays: '',
        lessonOrder: 'ASC',
        lessonOrderBy: '',
        materials: '',
        prerequisite: '',
        price: '',
        priceType: 'free',
        recommendedHours: 8,
        shortDescription: '',
    },
};

export const users: ALiEMU.EducatorDashboard.UserObject = {
    1: {
        ID: 1,
        accountStatus: 'approved',
        auGraduationYear: null,
        courseAccessed: [],
        description: '',
        displayName: 'Minimal User',
        email: 'minimaluser@gmail.com',
        firstName: 'Minimal',
        lastName: 'User',
        registerDate: '2016-01-01 01:01:01',
        residencyUsEm: 'Hawaii - ALiEM University',
        role: 'admin',
        submitted: '',
        umLastLogin: 1462832070,
        username: 'minimaluser',
    },
    2: {
        ID: 2,
        accountStatus: 'approved',
        auGraduationYear: 2018,
        country: 'United States',
        courseAccessed: {
            100: 1433879463,
            200: 1433879463,
            300: 1433879463,
            400: 1433879463,
        },
        courseCompleted: {
            100: 1433879463,
        },
        courseProgress: {
            100: {
                completed: 5,
                lessons: {
                    110: 1,
                    120: 1,
                    130: 1,
                    140: 1,
                },
                topics: {
                    115: {
                        116: 1,
                        117: 1,
                        118: 1,
                    },
                    125: {
                        126: 1,
                        127: 1,
                        128: 1,
                    },
                },
                total: 5,
            },
            300: {
                completed: 1,
                lessons: {
                    310: 1,
                    320: 1,
                    330: 1,
                    340: 1,
                },
                topics: {
                    315: {
                        316: 1,
                        317: 1,
                        318: 1,
                    },
                    325: {
                        326: 1,
                        327: 1,
                        328: 1,
                    },
                },
                total: 5,
            },
        },
        description: '',
        displayName: 'Maximal User',
        emResident: true,
        email: 'maximaluser@gmail.com',
        firstName: 'Maximal',
        lastActivity: '2016-01-01 01:01:01',
        lastName: 'User',
        medicineExperiencelevel: 'Resident',
        quizzes: [],
        residencyUsEm: 'Hawaii - ALiEM University',
        registerDate: '2016-01-01 01:01:01',
        role: 'admin',
        submitted: '',
        twitter: 'maximaluser',
        umLastLogin: 1462832070,
        userAgreement: true,
        userDiscipline: 'Medicine',
        userUsState: 'Hawaii',
        username: 'maximaluser',
    },
};

export const createMinimalUser = (id: number, gradYear: number) => (
    {
        ID: id,
        accountStatus: 'approved',
        auGraduationYear: gradYear,
        courseAccessed: [],
        courseProgress: {},
        description: '',
        displayName: `User ${id}`,
        email: 'minimaluser@gmail.com',
        firstName: `fname${id}`,
        lastName: `lname${id}`,
        registerDate: '2016-01-01 01:01:01',
        residencyUsEm: 'Hawaii - ALiEM University',
        role: 'admin',
        submitted: '',
        umLastLogin: 1462832070,
        username: `username${id}`,
    }
);

export const lessons: {[i: number]: LearnDash.Lessons} = {
    110: {
        ID: 110,
        menuOrder: 0,
        postAuthor: 0,
        postDate: '2015-04-20 14:21:26',
        postModified: '2015-04-20 14:21:26',
        postTitle: 'Lesson ',
    },
    120: {
        ID: 120,
        menuOrder: 1,
        postAuthor: 0,
        postDate: '2015-04-20 14:21:26',
        postModified: '2015-04-20 14:21:26',
        postTitle: 'Lesson ',
    },
    130: {
        ID: 130,
        menuOrder: 2,
        postAuthor: 0,
        postDate: '2015-04-20 14:21:26',
        postModified: '2015-04-20 14:21:26',
        postTitle: 'Lesson ',
    },
    140: {
        ID: 140,
        menuOrder: 3,
        postAuthor: 0,
        postDate: '2015-04-20 14:21:26',
        postModified: '2015-04-20 14:21:26',
        postTitle: 'Lesson ',
    },
    210: {
        ID: 210,
        menuOrder: 0,
        postAuthor: 0,
        postDate: '2015-04-20 14:21:26',
        postModified: '2015-04-20 14:21:26',
        postTitle: 'Lesson ',
    },
    220: {
        ID: 220,
        menuOrder: 1,
        postAuthor: 0,
        postDate: '2015-04-20 14:21:26',
        postModified: '2015-04-20 14:21:26',
        postTitle: 'Lesson ',
    },
    230: {
        ID: 230,
        menuOrder: 2,
        postAuthor: 0,
        postDate: '2015-04-20 14:21:26',
        postModified: '2015-04-20 14:21:26',
        postTitle: 'Lesson ',
    },
    240: {
        ID: 240,
        menuOrder: 3,
        postAuthor: 0,
        postDate: '2015-04-20 14:21:26',
        postModified: '2015-04-20 14:21:26',
        postTitle: 'Lesson ',
    },
};

export const courseData = {
    categories: Object.assign({}, categories),
    courseMeta: Object.assign({}, courseMeta),
    courses: Object.assign({}, courses),
    lessons: Object.assign({}, lessons),
};