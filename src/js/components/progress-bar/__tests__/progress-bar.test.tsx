import React from 'react';
import renderer from 'react-test-renderer';

import ProgressBar from '../index';

it('renders correctly', () => {
    const tree = renderer.create(<ProgressBar value={5} max={10} />);
    expect(tree).toMatchSnapshot();
});
