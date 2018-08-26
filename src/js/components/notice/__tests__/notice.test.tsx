import React from 'react';
import renderer from 'react-test-renderer';

import Notice from '../index';

it('renders correctly', () => {
    const tree = renderer.create(<Notice>Hello World</Notice>);
    expect(tree).toMatchSnapshot();
});
