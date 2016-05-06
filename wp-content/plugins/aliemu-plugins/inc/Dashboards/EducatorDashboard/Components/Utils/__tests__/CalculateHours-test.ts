jest.unmock('../CalculateHours');

import calculateHours from '../CalculateHours';


interface TestUserMetaCompleted {
  courseCompleted: {
    [i: number]: number
  }
}

interface TestCourseMetaHours {
  [i: number]: {
    recommendedHours: number
  }
}

let testUser: TestUserMetaCompleted = {
  courseCompleted: {
    1: 1221341,
    5: 5244353,
    10: 1232522,
  }
}

let testMeta: TestCourseMetaHours = {
  1: {
    recommendedHours: 1
  },
  2: {
    recommendedHours: 2
  },
  3: {
    recommendedHours: 3
  },
  4: {
    recommendedHours: 4
  },
  5: {
    recommendedHours: 5
  },
  6: {
    recommendedHours: 6
  },
  7: {
    recommendedHours: 7
  },
  8: {
    recommendedHours: 8
  },
  9: {
    recommendedHours: 9
  },
  10: {
    recommendedHours: 10
  },
}

type UM = ALiEMU.EducatorDashboard.UserMeta
type CM = ALiEMU.EducatorDashboard.CourseMetaObject

describe('calculateHours', () => {
  it('should calculate the hours correctly', () => {

    expect(calculateHours(testUser as UM, testMeta as CM)).toEqual(16);

    // Add 7
    testUser.courseCompleted[7] = 1231234;
    expect(calculateHours(testUser as UM, testMeta as CM)).toEqual(23);

    // Subtract 10
    delete testUser.courseCompleted[10];
    expect(calculateHours(testUser as UM, testMeta as CM)).toEqual(13);

    // Subtract 13
    testUser.courseCompleted = {};
    expect(calculateHours(testUser as UM, testMeta as CM)).toEqual(0);

    // Add 5
    testUser.courseCompleted[5] = 12341234;
    expect(calculateHours(testUser as UM, testMeta as CM)).toEqual(5);

    // Throw TypeError
    testUser.courseCompleted[100] = 2341234;
    try {
      calculateHours(testUser as UM, testMeta as CM);
    } catch(e) {
      expect(e.name).toBe('TypeError');
    }

  })
})
