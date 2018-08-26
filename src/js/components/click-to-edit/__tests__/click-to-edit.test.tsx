import React from 'react';
import renderer from 'react-test-renderer';

import ClickToEdit from '../index';

it('should render correctly', () => {
    const tree = renderer.create(
        <>
            <ClickToEdit onSave={jest.fn()} />
            <ClickToEdit onSave={jest.fn()} placeholder="With Placeholder" />
        </>,
    );
    expect(tree).toMatchSnapshot();
});
