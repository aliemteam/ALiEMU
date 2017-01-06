// tslint:disable max-line-length
import * as utils from '../DashboardUtils';
import * as moment from 'moment';
import { courseData, users } from '../../../../lib/utils/Fixtures';
const before = beforeAll;

const D = {
    jan: 1420088400,
    feb: 1422766800,
    mar: 1425186000,
    apr: 1427860800,
    may: 1430452800,
    jun: 1433131200,
    jul: 1435723200,
    aug: 1438401600,
    sep: 1441080000,
    oct: 1443672000,
    nov: 1446350400,
    dec: 1448946000,
};

interface TestUserMetaCompleted {
    courseCompleted: {
        [i: number]: number;
    };
}

interface TestCourseMetaHours {
    [i: number]: {
        recommendedHours: number;
    };
}

const testUser: TestUserMetaCompleted = {
    courseCompleted: {
        1: D.jan,
        5: D.may,
        10: D.dec,
    },
};

const testMeta: TestCourseMetaHours = {
    1: {
        recommendedHours: 1,
    },
    2: {
        recommendedHours: 2,
    },
    3: {
        recommendedHours: 3,
    },
    4: {
        recommendedHours: 4,
    },
    5: {
        recommendedHours: 5,
    },
    6: {
        recommendedHours: 6,
    },
    7: {
        recommendedHours: 7,
    },
    8: {
        recommendedHours: 8,
    },
    9: {
        recommendedHours: 9,
    },
    10: {
        recommendedHours: 10,
    },
};

describe('calculateHours', () => {

    const setup = (s?: string, e?: string) => {
        let start: moment.Moment = null;
        let end: moment.Moment = null;
        if (s) start = moment(s, 'YYYY-MM-DD');
        if (e) end = moment(e, 'YYYY-MM-DD');
        return {
            start,
            end,
        };
    };

    let user;
    let meta;

    before(() => {
        meta = Object.assign({}, testMeta);
        user = Object.assign({}, testUser);
    });

    afterEach(() => {
        user = Object.assign({}, testUser);
    });

    it('should calculate total hours with no date range', () => {
        const userTest: TestUserMetaCompleted = {
            courseCompleted: {
                1: D.jan,
                5: D.may,
                10: D.dec,
            },
        };

        expect(utils.calculateIIIHours(<any>userTest, meta, setup())).toEqual(16);

        // Add 7
        userTest.courseCompleted[7] = 1231234;
        expect(utils.calculateIIIHours(<any>userTest, meta, setup())).toEqual(23);

        // Subtract 10
        delete userTest.courseCompleted[10];
        expect(utils.calculateIIIHours(<any>userTest, meta, setup())).toEqual(13);

        // Subtract 13
        userTest.courseCompleted = {};
        expect(utils.calculateIIIHours(<any>userTest, meta, setup())).toEqual(0);

        // Add 5
        userTest.courseCompleted[5] = 12341234;
        expect(utils.calculateIIIHours(<any>userTest, meta, setup())).toEqual(5);

        // Throw TypeError
        userTest.courseCompleted[100] = 2341234;
        try {
            utils.calculateIIIHours(<any>userTest, meta, setup());
        } catch (e) {
            expect(e.name).toBe('TypeError');
        }

    });

    it('should calculate total hours with a start date only', () => {
        expect(utils.calculateIIIHours(user, meta, setup('2015-05-01'))).toBe(15);
        expect(utils.calculateIIIHours(user, meta, setup('2015-05-02'))).toBe(10);
        expect(utils.calculateIIIHours(user, meta, setup('2014-01-24'))).toBe(16);
        expect(utils.calculateIIIHours(user, meta, setup('2016-01-24'))).toBe(0);
    });

    it('should calculate total hours with an end date only', () => {
        expect(utils.calculateIIIHours(user, meta, setup(null, '2015-05-02'))).toBe(6);
        expect(utils.calculateIIIHours(user, meta, setup(null, '2015-04-30'))).toBe(1);
        expect(utils.calculateIIIHours(user, meta, setup(null, '2014-01-24'))).toBe(0);
        expect(utils.calculateIIIHours(user, meta, setup(null, '2016-01-24'))).toBe(16);
    });

    it('should calculate total hours with a full date range', () => {
        expect(utils.calculateIIIHours(user, meta, setup('2015-02-01', '2015-05-02'))).toBe(5);
        expect(utils.calculateIIIHours(user, meta, setup('2015-02-01', '2015-04-30'))).toBe(0);
        expect(utils.calculateIIIHours(user, meta, setup('2015-01-01', '2015-04-30'))).toBe(1);
        expect(utils.calculateIIIHours(user, meta, setup('2015-02-01', '2016-04-30'))).toBe(15);
        expect(utils.calculateIIIHours(user, meta, setup('2015-02-13', '2016-04-30'))).toBe(15);
        expect(utils.calculateIIIHours(user, meta, setup('2015-06-30', '2015-12-24'))).toBe(10);
        expect(utils.calculateIIIHours(user, meta, setup('2013-01-01', '2016-01-24'))).toBe(16);
        expect(utils.calculateIIIHours(user, meta, setup('2015-04-30', '2016-01-24'))).toBe(15);
    });
});

describe('parseCompletionDate', () => {
    it('should parse undefined as "X"', () => {
        expect(utils.parseCompletionData(undefined)).toBe('X');
    });
    it('should parse various date strings correctly', () => {
        expect(/03\/2[1-3]\/2016/.test(utils.parseCompletionData(1458692807))).toBe(true);
        expect(/04\/0[1-3]\/2016/.test(utils.parseCompletionData(1459616977))).toBe(true);
        expect(/04\/2[0-2]\/2016/.test(utils.parseCompletionData(1461229758))).toBe(true);
        expect(/04\/2[2-4]\/2015/.test(utils.parseCompletionData(1429798848))).toBe(true);
    });
    it('should parse date with hours and give back date and hours', () => {
        let payload = utils.parseCompletionData(1458692807, '12').split('","');
        expect(/03\/2[1-3]\/2016/.test(payload[0])).toBe(true);
        expect(payload[1]).toBe('12');
        payload = utils.parseCompletionData(1461229758, '3').split('","');
        expect(/04\/2[0-2]\/2016/.test(payload[0])).toBe(true);
        expect(payload[1]).toBe('3');
        expect(utils.parseCompletionData(undefined, '3')).toBe('X","0');
        expect(utils.parseCompletionData(undefined, '8')).toBe('X","0');
    });
});

describe('downloadPolyfill', () => {

    const setup = () => {
        document.body.innerHTML = `
            <div><a id='test'>Test</a></div>
        `;
        const spyCreateObjectURL = jest.fn();
        const spyMsSaveBlob = jest.fn();
        window.URL.createObjectURL = spyCreateObjectURL;
        window.navigator.msSaveBlob = spyMsSaveBlob;
        const blob = new Blob(
            ['test,test,test,test\ntest,test,test,test'],
            { type: 'text/csv;charset=utf-8' },
        );
        return {
            blob,
            spyCreateObjectURL,
            spyMsSaveBlob,
        };
    };

    it('should call the correct functions based on browser', () => {
        const { blob, spyMsSaveBlob, spyCreateObjectURL } = setup();
        utils.downloadPolyfill('test.csv', blob, 'chrome', 'test');
        utils.downloadPolyfill('test.csv', blob, 'ie', 'test');
        utils.downloadPolyfill('test.csv', blob, 'opera', 'test');
        expect(spyCreateObjectURL).toHaveBeenCalledTimes(2);
        expect(spyMsSaveBlob).toHaveBeenCalledTimes(1);
    });
});

const categories: ALiEMU.EducatorDashboard.CategoryObject = {
    'TEST1': {
        100: 100,
        150: 150,
        175: 175,
    },
    'TEST2': {
        200: 200,
        250: 250,
        275: 275,
    },
    'TEST3': {
        300: 300,
        350: 350,
        375: 375,
    },
};

describe('getCourseCategory', () => {
    it('should return the correct category', () => {
        expect(utils.getCourseCategory('200', categories)).toBe('TEST2');
        expect(utils.getCourseCategory('150', categories)).toBe('TEST1');
        expect(utils.getCourseCategory('300', categories)).toBe('TEST3');
        expect(utils.getCourseCategory('375', categories)).toBe('TEST3');
        expect(utils.getCourseCategory('250', categories)).toBe('TEST2');
        expect(utils.getCourseCategory('100', categories)).toBe('TEST1');
        expect(utils.getCourseCategory('275', categories)).toBe('TEST2');
    });
});

describe('CSV Class', () => {
    let CSV;

    it('should construct', () => {
        expect(new utils.CSV(users, courseData)).toBeTruthy();
    });

    before(() => {
        CSV = new utils.CSV(users, courseData);
    });

    describe('CSV.user()', () => {
        it('should return a properly formatted user CSV', () => {
            const expected: ALiEMU.CSV = {
                filename: 'Maximal_User.csv',
                data: `"Registered Courses","Steps Completed","Date Completed","Associated III Credit Hours","Category"\n"Course 1","5 out of 5","06/09/2015","1","AIR"\n"Course 3","1 out of 5","X","0","AIR"\n`,
            };
            expect(CSV.user('2')).toEqual(expected);
        });
        it('should return false if the user has not interacted with courses', () => {
            expect(CSV.user('1')).toBe(false);
        });
    });

    describe('CSV.allUsers()', () => {
        it('should return a CSV without date range', () => {
            const expected = {
                filename: 'ALiEMU_Program_Export.csv',
                data: `"Last Name","First Name","Class of","Total III Hours Awarded","Courses In Progress","Courses Completed"\n"User","Minimal","","0","0","0"\n"User","Maximal","2018","1","1","1"\n`,
            };
            expect(CSV.allUsers({start: null, end: null})).toEqual(expected);
        });
        it('should return a CSV with a date range', () => {
            const expected = {
                filename: 'ALiEMU_Program_Export.csv',
                data: `"Last Name","First Name","Class of","Total III Hours Awarded","Courses In Progress","Courses Completed"\n"User","Minimal","","0","0","0"\n"User","Maximal","2018","0","1","1"\n`,
            };
            const dateRange = {
                start: moment('2015-07-01'),
                end: null,
            };
            expect(CSV.allUsers(dateRange)).toEqual(expected);
        });
    });

    describe('CSV.course()', () => {
        it('should return a CSV', () => {
            const expected = {
                filename: 'Course_1.csv',
                data: `"Last Name","First Name","Course Completed","Lesson: Lesson 110","Lesson: Lesson 120","Lesson: Lesson 130","Lesson: Lesson 140"\n"User","Minimal","X","X","X","X","X"\n"User","Maximal","06/09/2015","Completed","Completed","Completed","Completed"\n`,
            };
            expect(CSV.course('100')).toEqual(expected);
            const newUsers = Object.assign({}, users);
            newUsers[2].courseProgress[100].lessons[140] = 0;
            const newCSV = new utils.CSV(newUsers, courseData);
            const newExpected = {
                filename: 'Course_1.csv',
                data: `"Last Name","First Name","Course Completed","Lesson: Lesson 110","Lesson: Lesson 120","Lesson: Lesson 130","Lesson: Lesson 140"\n"User","Minimal","X","X","X","X","X"\n"User","Maximal","06/09/2015","Completed","Completed","Completed","X"\n`,
            };
            expect(newCSV.course('100')).toEqual(newExpected);
        });
    });
});
