import React from 'react';
import renderer from 'react-test-renderer';

jest.mock('lodash', () => ({
    uniqueId: jest.fn(id => `${id}TEST`),
}));

import Pagination from '../index';

describe('<Pagination />', () => {
    beforeAll(() => {
        Date.now = jest.fn(() => 0);
    });
    it('should render correctly', () => {
        const tree = renderer.create(
            <Pagination total={5} value={3} onChange={jest.fn()} />,
        );
        expect(tree).toMatchSnapshot();
    });
});
