import React from 'react';
import renderer from 'react-test-renderer';

import ProgressDots from '../index';

it('renders correctly', () => {
    const tree = renderer.create(<ProgressDots currentStep={3} steps={5} />);
    expect(tree).toMatchSnapshot();
});
