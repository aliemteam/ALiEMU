import React from 'react';
import renderer from 'react-test-renderer';

import Checkbox from '../checkbox';

it('should render correctly', () => {
    const tree = renderer.create(
        <>
            <Checkbox label="Unchecked" />
            <Checkbox label="Checked" checked />
        </>,
    );
    expect(tree).toMatchSnapshot();
});
