import React from 'react';
import renderer from 'react-test-renderer';

import ClickToEdit from '../index';

it('should render correctly', () => {
    const tree = renderer.create(
        <>
            <ClickToEdit onSave={jest.fn()} />
            <ClickToEdit placeholder="With Placeholder" onSave={jest.fn()} />
        </>,
    );
    expect(tree).toMatchSnapshot();
});
