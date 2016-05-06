jest.unmock('../Pagination.ts');

import paginate from '../Pagination';

let rows = {};
for (let i = 1; i < 101; i++) {
  rows[i] = i;
};

describe('Paginate Function', () => {
  it('should paginate correctly', () => {

    expect(paginate(rows, 10, 5)).toEqual(['51', '52', '53', '54', '55', '56', '57', '58', '59', '60']);
    expect(paginate(rows, 3, 2)).toEqual(['7', '8', '9']);
    expect(paginate(rows, 1, 39)).toEqual(['40']);
    expect(paginate(rows, 100, 4)).toEqual([]);
    expect(paginate(rows, 0, 10)).toEqual([]);

  });
});
