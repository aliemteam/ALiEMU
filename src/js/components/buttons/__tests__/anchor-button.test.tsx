import React from 'react';
import renderer from 'react-test-renderer';

import AnchorButton from '../anchor-button';

it('should render correctly', () => {
    const tree = renderer.create(
        <>
            <AnchorButton>Hello World</AnchorButton>
        </>,
    );
    expect(tree).toMatchSnapshot();
});
