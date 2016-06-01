jest.unmock('../DashboardUtils');
jest.unmock('moment');

import * as utils from '../DashboardUtils';
import * as sinon from 'sinon';
import * as Moment from 'moment';

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
        [i: number]: number
    };
}

interface TestCourseMetaHours {
    [i: number]: {
        recommendedHours: number
    };
}

let testUser: TestUserMetaCompleted = {
    courseCompleted: {
        1: D.jan,
        5: D.may,
        10: D.dec,
    },
};

let testMeta: TestCourseMetaHours = {
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

type UM = ALiEMU.EducatorDashboard.UserMeta
type CM = ALiEMU.EducatorDashboard.CourseMetaObject

describe('calculateHours', () => {

    const setup = (s?: string, e?: string) => {
        let start: moment.Moment = null;
        let end: moment.Moment = null;
        if (s) start = Moment(s, 'YYYY-MM-DD');
        if (e) end = Moment(e, 'YYYY-MM-DD');
        return {
            start,
            end,
        };
    };

    let user;
    const meta = Object.assign({}, testMeta) as CM;

    beforeEach(() => {
        user = Object.assign({}, testUser) as UM;
    });

    afterEach(() => {
        user = Object.assign({}, testUser) as UM;
    });


    it('should calculate total hours with no date range', () => {
        const userTest: TestUserMetaCompleted = {
            courseCompleted: {
                1: D.jan,
                5: D.may,
                10: D.dec,
            },
        };

        expect(utils.calculateIIIHours(userTest as UM, meta, setup())).toEqual(16);

        // Add 7
        userTest.courseCompleted[7] = 1231234;
        expect(utils.calculateIIIHours(userTest as UM, meta, setup())).toEqual(23);

        // Subtract 10
        delete userTest.courseCompleted[10];
        expect(utils.calculateIIIHours(userTest as UM, meta, setup())).toEqual(13);

        // Subtract 13
        userTest.courseCompleted = {};
        expect(utils.calculateIIIHours(userTest as UM, meta, setup())).toEqual(0);

        // Add 5
        userTest.courseCompleted[5] = 12341234;
        expect(utils.calculateIIIHours(userTest as UM, meta, setup())).toEqual(5);

        // Throw TypeError
        userTest.courseCompleted[100] = 2341234;
        try {
            utils.calculateIIIHours(userTest as UM, meta, setup());
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
        expect(utils.calculateIIIHours(user, meta, setup(null, '2015-05-01'))).toBe(6);
        expect(utils.calculateIIIHours(user, meta, setup(null, '2015-04-30'))).toBe(1);
        expect(utils.calculateIIIHours(user, meta, setup(null, '2014-01-24'))).toBe(0);
        expect(utils.calculateIIIHours(user, meta, setup(null, '2016-01-24'))).toBe(16);
    });

    it('should calculate total hours with a full date range', () => {
        expect(utils.calculateIIIHours(user, meta, setup('2015-02-01', '2015-05-01'))).toBe(5);
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
        expect(utils.parseCompletionDate(undefined)).toBe('X');
    });
    it('should parse various date strings correctly', () => {
        expect(/3\/2[1-3]\/2016/.test(utils.parseCompletionDate(1458692807))).toBe(true);
        expect(/4\/[1-3]\/2016/.test(utils.parseCompletionDate(1459616977))).toBe(true);
        expect(/4\/2[0-2]\/2016/.test(utils.parseCompletionDate(1461229758))).toBe(true);
        expect(/4\/2[2-4]\/2015/.test(utils.parseCompletionDate(1429798848))).toBe(true);
    });
});



describe('downloadPolyfill', () => {

    const setup = () => {
        document.body.innerHTML = `
            <div><a id='test'>Test</a></div>
        `;
        const spyCreateObjectURL = sinon.spy();
        const spyMsSaveBlob = sinon.spy();
        window.URL.createObjectURL = spyCreateObjectURL;
        window.navigator.msSaveBlob = spyMsSaveBlob;
        const blob = new Blob(
            ['test,test,test,test\ntest,test,test,test', ], { type: 'text/csv;charset=utf-8', }
        );
        return {
            blob,
            spyCreateObjectURL,
            spyMsSaveBlob,
        };
    };

    it('should call the correct functions based on browser', () => {
        const { blob, spyMsSaveBlob, spyCreateObjectURL, } = setup();
        utils.downloadPolyfill('test.csv', blob, 'chrome', 'test');
        utils.downloadPolyfill('test.csv', blob, 'ie', 'test');
        utils.downloadPolyfill('test.csv', blob, 'opera', 'test');
        expect(spyCreateObjectURL.callCount).toBe(2);
        expect(spyMsSaveBlob.callCount).toBe(1);
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
