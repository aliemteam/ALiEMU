import React from 'react';
import renderer from 'react-test-renderer';

import Tag from '../index';

it('should render correctly', () => {
    const tree = renderer.create(<Tag text="Hello World" />);
    expect(tree).toMatchSnapshot();
});
