import React from 'react';
import renderer from 'react-test-renderer';

import ProgressDots from '../index';

it('renders correctly', () => {
    const tree = renderer.create(<ProgressDots steps={5} currentStep={3} />);
    expect(tree).toMatchSnapshot();
});
