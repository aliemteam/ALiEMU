import React from 'react';
import renderer from 'react-test-renderer';

import Card from '../index';

it('renders correctly', () => {
    const tree = renderer.create(<Card>Hello World</Card>).toJSON();
    expect(tree).toMatchSnapshot()
});
