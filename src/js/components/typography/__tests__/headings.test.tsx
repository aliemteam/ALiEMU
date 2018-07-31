import React from 'react';
import renderer from 'react-test-renderer';

import { SectionHeading } from '../headings';

it('should render <SectionHeading>', () => {
    const tree = renderer.create(<SectionHeading>Hello World</SectionHeading>);
    expect(tree).toMatchSnapshot();
});
