import React from 'react';
import renderer from 'react-test-renderer';

import Tag from '../index';

it('should render correctly', () => {
    const tree = renderer.create(<Tag>Hello World</Tag>);
    expect(tree).toMatchSnapshot();
});
