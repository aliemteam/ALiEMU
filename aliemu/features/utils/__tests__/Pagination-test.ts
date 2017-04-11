import { paginate } from '../Pagination';
const before = beforeAll;

describe('Paginate Function', () => {
    let rows: number[];

    before(() => {
        rows = Array.from(Array(100).keys());
    });

    it('should paginate correctly', () => {
        expect(paginate(rows, 10, 5)).toEqual([50, 51, 52, 53, 54, 55, 56, 57, 58, 59]);
        expect(paginate(rows, 3, 2)).toEqual([6, 7, 8]);
        expect(paginate(rows, 1, 39)).toEqual([39]);
        expect(paginate(rows, 100, 4)).toEqual([]);
        expect(paginate(rows, 0, 10)).toEqual([]);
    });
});
