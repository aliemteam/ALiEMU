import React from 'react';
import renderer from 'react-test-renderer';

import Label from '../label';

it('should render correctly', () => {
    const tree = renderer.create(
        <>
            <Label>Normal</Label>
            <Label disabled>Disabled</Label>
        </>,
    );
    expect(tree).toMatchSnapshot();
});
