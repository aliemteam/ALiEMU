import React from 'react';
import renderer from 'react-test-renderer';

import Input from '../input';

it('should render correctly', () => {
    const tree = renderer.create(
        <>
            <Input label="Labelled Input" />
            <Input defaultValue="Unlabelled Input" />
            <Input placeholder="Placeholder Input" />
            <Input disabled />
            <Input isRaised label="Raised Input" />
        </>,
    );
    expect(tree).toMatchSnapshot();
});
