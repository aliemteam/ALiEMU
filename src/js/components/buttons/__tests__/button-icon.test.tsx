import React from 'react';
import renderer from 'react-test-renderer';

import IconButton from '../button-icon';

it('should render correctly', () => {
    const tree = renderer.create(
        <>
            <IconButton icon="accessible_forward" />
            <IconButton icon="done_outline" size={50} />
            <IconButton color="red" icon="pets" size={25} />
        </>,
    );
    expect(tree).toMatchSnapshot();
});
