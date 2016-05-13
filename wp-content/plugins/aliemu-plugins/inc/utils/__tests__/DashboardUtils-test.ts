jest.unmock('../DashboardUtils');

import * as utils from '../DashboardUtils';
import * as sinon from 'sinon';

const categoryMock: ALiEMU.EducatorDashboard.CategoryObject = JSON.parse(`{"AIR":{"93":93,"144":144,"179":179,"221":221,"259":259,"286":286,"339":339,"807":807,"1274":1274,"1910":1910,"1948":1948,"1989":1989,"2016":2016,"2677":2677},"Capsules":{"408":408,"1406":1406,"1604":1604,"1715":1715,"2178":2178,"2438":2438},"":{"2528":2528,"2638":2638}}`);

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
        1: 1221341,
        5: 5244353,
        10: 1232522,
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
    it('should calculate the hours correctly', () => {

        expect(utils.calculateIIIHours(testUser as UM, testMeta as CM)).toEqual(16);

        // Add 7
        testUser.courseCompleted[7] = 1231234;
        expect(utils.calculateIIIHours(testUser as UM, testMeta as CM)).toEqual(23);

        // Subtract 10
        delete testUser.courseCompleted[10];
        expect(utils.calculateIIIHours(testUser as UM, testMeta as CM)).toEqual(13);

        // Subtract 13
        testUser.courseCompleted = {};
        expect(utils.calculateIIIHours(testUser as UM, testMeta as CM)).toEqual(0);

        // Add 5
        testUser.courseCompleted[5] = 12341234;
        expect(utils.calculateIIIHours(testUser as UM, testMeta as CM)).toEqual(5);

        // Throw TypeError
        testUser.courseCompleted[100] = 2341234;
        try {
            utils.calculateIIIHours(testUser as UM, testMeta as CM);
        } catch (e) {
            expect(e.name).toBe('TypeError');
        }

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

describe('downloadPolyfill', () => {
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
