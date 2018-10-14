import React from 'react';
import renderer from 'react-test-renderer';

import Spinner from '../';

describe('<Spinner />', () => {
    it('should render size 50', () => {
        const tree = renderer.create(<Spinner size={50} />);
        expect(tree).toMatchSnapshot();
    });

    it('should render size 100', () => {
        const tree = renderer.create(<Spinner size={100} />);
        expect(tree).toMatchSnapshot();
    });
});
