import React from 'react';
import renderer from 'react-test-renderer';

import ProgressRadial from '../index';

it('renders correctly', () => {
    const tree = renderer.create(
        <ProgressRadial diameter={50} thickness={5} max={100} value={50} />,
    );
    expect(tree).toMatchSnapshot();
});
