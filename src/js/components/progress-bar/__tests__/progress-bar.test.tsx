import React from 'react';
import renderer from 'react-test-renderer';

import ProgressBar from '../index';

it('renders correctly', () => {
    const tree = renderer.create(<ProgressBar max={10} value={5} />);
    expect(tree).toMatchSnapshot();
});
